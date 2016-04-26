
(function($){
	$.MPopup = {
		// vitesse du fade	
		fadeSpeed: 100,
		
		// taille minimum de la popup
		minWidth: 300,
		minHeight: 75,
		popHeight: 75,
		
		/* id des div*/
		overLayerId: 'm_over_layer',
		panelId: 'm_panel',
		titleId: 'm_title',
		closeId: 'm_close',
		closeButtonId: 'm_closebt',
		contentId : 'm_content',
		contentIdLogo : 'm_content_logo',
		contentIdText : 'm_content_text',
		footerId : 'm_footer',
		
		alert : function (msg, title, fn){
			if ( title == null)title = 'Alert';
			$.MPopup._show(msg, title, 'alert', function (data){
				if ( fn ) fn(data);
			});
		},
		
		confirm : function (msg, title, fn){
			if ( title == null) title = 'Confirm';
			$.MPopup._show(msg, title, 'confirm', function (data){
				if ( fn ) fn(data);
			});
		},
		
		content : function (msg, title, fn){
			$.MPopup._show(msg, title, 'content', function (data){
				if ( fn ) fn(data);
			});
		},
		
		_show : function(msg, title, type, fn){
			$.MPopup.createPanel();
			
			$.MPopup.showOverlayer('#'+$.MPopup.panelId);

			jQuery('#'+$.MPopup.closeButtonId).click(function(evt){
				$.MPopup.remove();
			});
			jQuery('#'+$.MPopup.titleId).append(title);
			jQuery('#'+$.MPopup.contentId).append(msg);			

			
			switch( type){
				case 'alert':
					//jQuery('<img src="assets/images/important.png" border="0"/>').appendTo('#'+$.MPopup.contentIdLogo);
					jQuery('#'+$.MPopup.contentId).after('<div id="'+$.MPopup.footerId+'"></div>');
					
					jQuery('<input type="button" class="button" value="Ok"/>')
					.appendTo('#'+$.MPopup.footerId)
					.click(function(){
						$.MPopup.remove(function(){
							fn(true)
						});
					});
					jQuery('#'+$.MPopup.contentId).addClass('alert');
				break;
				
				case 'confirm':
					//jQuery('<img src="assets/images/help.png" border="0"/>').appendTo('#'+$.MPopup.contentIdLogo);
					jQuery('#'+$.MPopup.contentId).after('<div id="'+$.MPopup.footerId+'"></div>');
					
					jQuery('<input type="button" class="button" value="Ok"/>')
					.appendTo('#'+$.MPopup.footerId)
					.click(function(){
						$.MPopup.remove(function(){
							fn(true)
						});
					});
					jQuery('<input type="button" class="button" value="Cancel"/>')
					.appendTo('#'+$.MPopup.footerId)
					.click(function(){
						$.MPopup.remove(function(){
							fn(false)
						});
					});
					jQuery('#'+$.MPopup.contentId).addClass('alert');
				break;
				
				case 'content':
					fn(true);
				break;
			}
			$.MPopup.moveCenter();
                        $.MPopup.actualiseSize();
		},
		
		createPanel:function(){
			jQuery('#'+$.MPopup.panelId).remove();
			//alert(jQuery(document).height());
			$.MPopup.popHeight = jQuery(document).height();
			
			
			jQuery('<div id="'+$.MPopup.panelId+'">'+
					'<div id="'+$.MPopup.closeId+'">'+
						'<img src="assets/images/close_pop.png" id="'+$.MPopup.closeButtonId+'" border="0"/>'+
					'</div>'+
					'<div id="'+$.MPopup.titleId+'"></div>'+
				'<div id="'+$.MPopup.contentId+'">'+
					//'<div id="'+$.MPopup.contentIdLogo+'"></div>'+
					//'<div id="'+$.MPopup.contentIdText+'"></div>'+
				'</div></div>').appendTo('body');
			
			/*
			var _w = document.createElement('div');
			_w.setAttribute('class', 'window');
			_w.setAttribute('id',$.MPopup.panelId);
			
			var _t = document.createElement('div');
			_t.setAttribute('class', 'title');
			
			var _th = document.createElement('div');
			_th.setAttribute('id', $.MPopup.titleId);
			_t.appendChild(_th);
			
			var _sp1 = document.createElement('div');
			_sp1.setAttribute('class', 'buttons');
			
			var _spmin2 = document.createElement('div');
			_spmin2.setAttribute('id', $.MPopup.closeButtonId);
			_spmin2.setAttribute('class', 'close');
			
			_sp1.appendChild(_spmin2);
			
			_t.appendChild(_sp1);
			_w.appendChild(_t);
			
			var _con = document.createElement('div');
			_con.setAttribute('id', 'content');
			_con.setAttribute('class', 'content');
			
			_w.appendChild(_con);
			
			document.body.appendChild(_w);
			*/
		},
		
		remove:function(fn){
			if ( jQuery('#'+$.MPopup.panelId).length != 0 ){
				jQuery('body').css('height','auto');
				jQuery('#'+$.MPopup.panelId).fadeOut($.MPopup.fadeSpeed, function(){
					jQuery('#'+$.MPopup.panelId).remove();
					jQuery("#"+$.MPopup.overLayerId).fadeTo($.MPopup.fadeSpeed, 0.0, function(){
						jQuery("#"+$.MPopup.overLayerId).remove();
						if(fn)
							fn();
					});
				});
			}
		},
		
		showOverlayer:function(next_win){
			//$.MPopup.removeOverlayer();
			if(jQuery("#"+$.MPopup.overLayerId).length == 0){
			
				var layer = document.createElement('div');
				layer.setAttribute('id',$.MPopup.overLayerId);
				//layer.setAttribute('style','position:absolute; top:0px; left:0px; z-index:1; -moz-opacity:0.0; opacity:0.0;filter:alpha(opacity=0);background:#000000;');
				document.body.appendChild(layer);
				var overlayer = jQuery("#"+$.MPopup.overLayerId);
				//overlayer.css({'width':'100%', 'height':'100%'});
				overlayer.width(jQuery(window).width());
				overlayer.height($.MPopup.popHeight);
				overlayer.fadeTo($.MPopup.fadeSpeed, 0.6, function(){
					jQuery(next_win).fadeIn($.MPopup.fadeSpeed);
				});
			}
			  
		},
		
		removeOverlayer : function(){		
			if(jQuery("#"+$.MPopup.overLayerId).length != 0){
				jQuery("#"+$.MPopup.overLayerId).fadeTo($.MPopup.fadeSpeed, 0.0, function(){
					jQuery("#"+$.MPopup.overLayerId).remove();
				});
			}
		},
		
		actualiseSize : function (){
                    var width = jQuery('#'+$.MPopup.panelId).width();
                    var height = jQuery('#'+$.MPopup.panelId).height();

                    var winWidth = 0;
                    var winHeight = 0;
                      if( typeof( window.innerWidth ) == 'number' )
                      {
                        //Non-IE
                        winWidth = window.innerWidth;
                        winHeight = window.innerHeight;
                      }
                      else
                          if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
                          {
                            //IE 6+ in 'standards compliant mode'
                            winWidth = document.documentElement.clientWidth;
                            winHeight = document.documentElement.clientHeight;
                          }
                          else
                             if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) 
                             {
                             //IE 4 compatible
                             winWidth = document.body.clientWidth;
                             winHeight = document.body.clientHeight;
                             }

                    if(width > (winWidth - 200))
                    {
                        var newWidth = width + 200;
                        jQuery('body').css('width',''+newWidth+'px');
                        document.documentElement.style.overflow = 'scroll';
                        jQuery('#'+$.MPopup.panelId).css('position','absolute');
                    }

                    if(height > (winHeight - 200))
                    {
                        var newHeight = height + 200;
                        jQuery('body').css('height',''+newHeight+'px');
                        document.documentElement.style.overflow = 'scroll';
                        jQuery('#'+$.MPopup.panelId).css('position','absolute');
                        var newTop = (newHeight - height)/2;
                       jQuery('#'+$.MPopup.panelId).css('top',newTop);
                    }
		},
		
		moveCenter : function(){	
			var overlayerHeight;
			if(jQuery(window).height() > $.MPopup.popHeight) overlayerHeight = jQuery(window).height();
			else overlayerHeight = $.MPopup.popHeight
			// overlayer
			var overlayer = jQuery("#"+$.MPopup.overLayerId);
                        
			overlayer.width(jQuery(window).width());
			overlayer.height(overlayerHeight);
			// panel
			hWidth = jQuery(window).width();
			hHeight = jQuery(window).height();
			
			jQuery("#"+$.MPopup.panelId).css("display", "block");
			
			pWidth = jQuery('#'+$.MPopup.panelId).width();
			pHeight = jQuery('#'+$.MPopup.panelId).height();
			
			
			var frmLeft = ((hWidth  - pWidth) / 2);
			var frmTop = ((hHeight  - pHeight)/ 3);
			
			jQuery('#'+$.MPopup.panelId).css("left", frmLeft) ;
			jQuery('#'+$.MPopup.panelId).css('top', frmTop) ;
                        jQuery('#'+$.MPopup.panelId).css('position','fixed') ;
		}		
	};
        
	jQuery(window).resize(function(){
		$.MPopup.moveCenter();
		$.MPopup.actualiseSize();
	});
	
	MClose = function (){
		$.MPopup.remove();
	};
	
	MAlert = function ( msg, title, fn){
		$.MPopup.alert( msg, title, fn);
	};
	
	MConfirm = function (msg, title, fn){
		$.MPopup.confirm( msg, title, fn);
	};
	
	MContent = function (content, title, fn){
		$.MPopup.content( content, title, fn);
	};
})(jQuery);
