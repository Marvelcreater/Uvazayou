
function isMobile(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /mobile/i.test(window.location.href.toString())) {
		return true;
	}
	return false;
}
function  getUrlParameter(name){
	try {
		return new URLSearchParams(window.location.search).get(name);
	} catch(e){
		return null;
	}

}
function joyStickSetup(){

	document.getElementById('login-button').addEventListener('click', function() {
		joy = new JoyStick('gamepad', {"internalFillColor":"rgba(186,186,186,0.75)",
			"internalStrokeColor":"rgba(186,186,186,0.25)", "externalStrokeColor":"rgba(186,186,186,0.75)", "width":100, "height":100});
		if (isMobile()){
			document.getElementById('gamepad').style.display = "block";
			document.getElementById('partylink').remove();
			console.log("Device is mobile");
        // initialise a simple listener for the joystick
        setInterval(function() {
        	var dir = joy.GetDir();

        	if (dir == 'N') {
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 68}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 83}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 65}));
        		window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 87}));
        	} else if (dir == 'E') {
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 87}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 65}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 83}));
        		window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 68}));
        	} else if (dir == 'S') {
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 65}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 87}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 68}));
        		window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 83}));
        	} else if (dir == 'W') {
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 87}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 83}));
        		window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 68}));
        		window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 65}));
                // no movement. Joystick in center
            } else if (dir == 'C') {
            	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 87}));
            	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 68}));
            	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 83}));
            	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 65}));
            }

                // account for secondary directions
                else if (dir == 'NE') {
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 83}));
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 65}));
                	
                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 87}));
                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 68}));
                } else if (dir == 'SE') {
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 87}));
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 65}));

                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 83}));
                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 68}));
                } else if (dir == 'SW') {
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 87}));
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 68}));

                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 83}));
                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 65}));
                }else if (dir == 'NW') {
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 68}));
                	window.dispatchEvent(new KeyboardEvent("keyup",{keyCode: 83}));

                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 87}));
                	window.dispatchEvent(new KeyboardEvent("keydown",{keyCode: 65}));
                }

            }, 100);
    }else{
    	console.log(parseInt(window.innerWidth)+"Device is not mobile");
    	document.getElementById('gamepad').style.display = "none";

    }

    
});
}
function gaerror(msg,f) {
	// window.gameanalytics.GameAnalytics.addErrorEvent(window.gameanalytics.EGAErrorSeverity.Error, msg,f);
}
function gadebug(msg,f) {
	// window.gameanalytics.GameAnalytics.addErrorEvent(window.gameanalytics.EGAErrorSeverity.Debug, msg,f);
}
function updateAchievementsUrl(url) {
	jQuery(document).ready(function(){
	jQuery.ajax({ dataType: "json",
	        url: url+"/api/users/achievements_cooldown.json",
	        crossDomain: true,xhrFields: {withCredentials: true},
	        success: function(data){
				jQuery('#achievements-tab').html('');

				for(let i in data){
					let a=data[i];
					jQuery('#achievements-tab').append($('<div class="achievement-list">').html(
					`${a.diamonds}<i class="fa-solid fa-gem" style="color:#20e9ff;"></i> <b>${a.name}</b> (${a.count}) <span class="time-left" data-seconds="${a.next_available_in}"></span> <br />${a.instructions}`
					));
				}
				jQuery('#achievements-tab').append('<br /><a href="javascript:void(0);" class="ui-button" onclick="updateAchievements();">Refresh</a>');
	        }}).fail(function(data){ //not signed in
	        	jQuery('#achievements-tab').html('Error');
				jQuery('#achievements-tab').append('<br /><a href="javascript:void(0);" class="ui-button" onclick="updateAchievements();">Refresh</a>');
	        });
	        

	        
	   
	    
	});
}

/*! js-cookie v3.0.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,o=e.Cookies=t();o.noConflict=function(){return e.Cookies=n,o}}())}(this,(function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)e[o]=n[o]}return e}return function t(n,o){function r(t,r,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n.write(r,t)+c}}return Object.create({set:r,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var t=document.cookie?document.cookie.split("; "):[],o={},r=0;r<t.length;r++){var i=t[r].split("="),c=i.slice(1).join("=");try{var u=decodeURIComponent(i[0]);if(o[u]=n.read(c,u),e===u)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){r(t,"",e({},n,{expires:-1}))},withAttributes:function(n){return t(this.converter,e({},this.attributes,n))},withConverter:function(n){return t(e({},this.converter,n),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(n)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})}));