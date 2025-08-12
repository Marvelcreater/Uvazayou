const puppeteer = require('puppeteer');

async function delay(ms){return new Promise(r=>setTimeout(r,ms));}

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  await page.goto('https://glar.io', { waitUntil: 'domcontentloaded' });

  // Wait a bit for bundles to execute
  await delay(4000);

  const result = await page.evaluate(async () => {
    function collectFromWebpack() {
      try {
        const chunkKey = Object.keys(window).find(k => k.startsWith('webpackChunk'));
        if (!chunkKey) return { arrays: [], objects: [] };
        window[chunkKey].push([[Date.now()], {}, req => (window.__req = req)]);
        const cache = window.__req?.c || {};
        const arrays = [];
        const objects = [];
        const seenSig = new Set();

        const looksLikeArrayOfObjects = (arr) => {
          if (!Array.isArray(arr) || arr.length === 0) return false;
          const sample = arr.find(x => x && typeof x === 'object');
          if (!sample) return false;
          const keys = Object.keys(sample);
          const signal = ['id','name','title','type','price','cost','hp','dmg','range','speed','sprite','icon','label'];
          return keys.some(k => signal.includes(k));
        };

        const looksLikeObjectMap = (obj) => {
          if (!obj || typeof obj !== 'object') return false;
          const vals = Object.values(obj);
          if (!vals.length) return false;
          const sample = vals.find(x => x && typeof x === 'object');
          if (!sample) return false;
          const keys = Object.keys(sample);
          const signal = ['id','name','title','type'];
          return keys.some(k => signal.includes(k));
        };

        for (const mod of Object.values(cache)) {
          const exp = mod?.exports;
          if (!exp) continue;
          const values = typeof exp === 'object' ? Object.values(exp) : [exp];
          for (const val of values) {
            try {
              if (looksLikeArrayOfObjects(val)) {
                const sig = JSON.stringify(val[0]).slice(0, 200);
                if (!seenSig.has(sig)) {
                  seenSig.add(sig);
                  arrays.push(val);
                }
              } else if (looksLikeObjectMap(val)) {
                const sig = Object.keys(val).slice(0,10).join(',');
                if (!seenSig.has(sig)) {
                  seenSig.add(sig);
                  objects.push(val);
                }
              }
            } catch (e) {}
          }
        }
        return { arrays, objects };
      } catch (e) {
        return { arrays: [], objects: [], error: String(e) };
      }
    }

    function normalizeArray(items) {
      return items.filter(Boolean).map((it, idx) => ({
        id: it.id ?? it.itemId ?? it.typeId ?? it.kind ?? idx,
        name: it.name ?? it.title ?? it.label ?? '(no name)',
        type: it.type ?? it.category ?? it.kind ?? '',
        raw: it,
      }));
    }

    const wp = collectFromWebpack();

    const arrays = (wp.arrays || []).map(a => normalizeArray(a));
    const objects = (wp.objects || []).map(o => normalizeArray(Object.values(o)));

    // Try to classify by simple heuristics
    const flat = arrays.concat(objects);
    const classify = (arr) => {
      const text = JSON.stringify(arr).toLowerCase();
      if (/hat|cap|helmet|crown/.test(text)) return 'hats';
      if (/wall|spike|door|totem|portal|floor|block|tower|trap/.test(text)) return 'buildings';
      if (/sword|axe|hammer|bow|pick|weapon/.test(text)) return 'items';
      if (/unit|npc|monster|dragon|cyclops|spider|guard/.test(text)) return 'units';
      return 'misc';
    };

    const grouped = { hats: [], buildings: [], items: [], units: [], misc: [] };
    for (const arr of flat) {
      grouped[classify(arr)].push(arr);
    }

    const dedupById = (list) => {
      const map = new Map();
      for (const arr of list) {
        for (const it of arr) {
          if (it.id == null) continue;
          if (!map.has(it.id)) map.set(it.id, { id: it.id, name: it.name, type: it.type });
        }
      }
      return Array.from(map.values()).sort((a,b) => (a.id> b.id?1:a.id<b.id?-1:0));
    };

    return {
      hats: dedupById(grouped.hats),
      buildings: dedupById(grouped.buildings),
      items: dedupById(grouped.items),
      units: dedupById(grouped.units),
      misc: dedupById(grouped.misc),
      counts: {
        arrays: wp.arrays?.length || 0,
        objects: wp.objects?.length || 0,
      }
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

run().catch(err => {
  console.error('ERR', err);
  process.exit(1);
});