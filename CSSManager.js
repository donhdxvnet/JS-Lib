/*
 * Copyright (c) 2007-2013 DBee SA 
 * 34-36 rue de la Belle Feuille 92100 Boulogne Billancourt, FRANCE
 * Tous droits reserves
 *
 * $Id$
 *
 */
var CSSManager = (function() {
	var LINK_ID = "dyn_module_css";

	return {
		load : function(sCssName){
			var oLink = document.getElementById(LINK_ID);

			if(oLink){
				oLink.href = sCssName;
			} else {			
				oLink = document.createElement("link");
				oLink.media = "screen";
				oLink.rel = "stylesheet";
				oLink.type = "text/css";
				oLink.id = LINK_ID;
				oLink.href = sCssName;

				var oHead = document.getElementsByTagName("head")[0];
				oHead.appendChild(oLink);
			}
		},
		unload : function(){
			var oLink = document.getElementById(LINK_ID);
			if(!oLink) return;
			var oHead = document.getElementsByTagName("head")[0];
			oHead.removeChild(oLink);
		}
	}
})();
