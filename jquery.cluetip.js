/*
 * jQuery clueTip plugin
 * Version 1.0.7  (January 28, 2010)
 * @requires jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
 
/*
 *
 * Full list of options/settings can be found at the bottom of this file and at http://plugins.learningjquery.com/cluetip/
 *
 * Examples can be found at http://plugins.learningjquery.com/cluetip/demo/
 *
*/

(function(jQuery) {
  jQuery.cluetip = {version: '1.0.6'};
  var jQuerycluetip, jQuerycluetipInner, jQuerycluetipOuter, jQuerycluetipTitle, jQuerycluetipArrows, jQuerycluetipWait, jQuerydropShadow, imgCount;
  
  jQuery.fn.cluetip = function(js, options) {
    if (typeof js == 'object') {
      options = js;
      js = null;
    }
    if (js == 'destroy') {
      return this.removeData('thisInfo').unbind('.cluetip');
    }
    return this.each(function(index) {
      var link = this, jQuerythis = jQuery(this);
      
      // support metadata plugin (v1.0 and 2.0)
      var opts = jQuery.extend(true, {}, jQuery.fn.cluetip.defaults, options || {}, jQuery.metadata ? jQuerythis.metadata() : jQuery.meta ? jQuerythis.data() : {});

      // start out with no contents (for ajax activation)
      var cluetipContents = false;
      var cluezIndex = +opts.cluezIndex;
      jQuerythis.data('thisInfo', {title: link.title, zIndex: cluezIndex});
      var isActive = false, closeOnDelay = 0;

      // create the cluetip divs
      if (!jQuery('#cluetip').length) {
        jQuery(['<div id="cluetip">',
          '<div id="cluetip-outer">',
            '<h3 id="cluetip-title"></h3>',
            '<div id="cluetip-inner"></div>',
          '</div>',
          '<div id="cluetip-extra"></div>',
          '<div id="cluetip-arrows" class="cluetip-arrows"></div>',
        '</div>'].join(''))
        [insertionType](insertionElement).hide();
        
        jQuerycluetip = jQuery('#cluetip').css({position: 'absolute'});
        jQuerycluetipOuter = jQuery('#cluetip-outer').css({position: 'relative', zIndex: cluezIndex});
        jQuerycluetipInner = jQuery('#cluetip-inner');
        jQuerycluetipTitle = jQuery('#cluetip-title');
        jQuerycluetipArrows = jQuery('#cluetip-arrows');
        jQuerycluetipWait = jQuery('<div id="cluetip-waitimage"></div>')
          .css({position: 'absolute'}).insertBefore(jQuerycluetip).hide();
      }
      var dropShadowSteps = (opts.dropShadow) ? +opts.dropShadowSteps : 0;
      if (!jQuerydropShadow) {
        jQuerydropShadow = jQuery([]);
        for (var i=0; i < dropShadowSteps; i++) {
          jQuerydropShadow = jQuerydropShadow.add(jQuery('<div></div>').css({zIndex: cluezIndex-1, opacity:.1, top: 1+i, left: 1+i}));
        }
        jQuerydropShadow.css({position: 'absolute', backgroundColor: '#000'})
        .prependTo(jQuerycluetip);
      }
      var tipAttribute = jQuerythis.attr(opts.attribute), ctClass = opts.cluetipClass;
      if (!tipAttribute && !opts.splitTitle && !js) {
        return true;
      }
      // if hideLocal is set to true, on DOM ready hide the local content that will be displayed in the clueTip
      if (opts.local && opts.localPrefix) {tipAttribute = opts.localPrefix + tipAttribute;}
      if (opts.local && opts.hideLocal) { jQuery(tipAttribute + ':first').hide(); }
      var tOffset = parseInt(opts.topOffset, 10), lOffset = parseInt(opts.leftOffset, 10);
      // vertical measurement variables
      var tipHeight, wHeight,
          defHeight = isNaN(parseInt(opts.height, 10)) ? 'auto' : (/\D/g).test(opts.height) ? opts.height : opts.height + 'px';
      var sTop, linkTop, posY, tipY, mouseY, baseline;
      // horizontal measurement variables
      var tipInnerWidth = parseInt(opts.width, 10) || 275,
          tipWidth = tipInnerWidth + (parseInt(jQuerycluetip.css('paddingLeft'),10)||0) + (parseInt(jQuerycluetip.css('paddingRight'),10)||0) + dropShadowSteps,
          linkWidth = this.offsetWidth,
          linkLeft, posX, tipX, mouseX, winWidth;
            
      // parse the title
      var tipParts;
      var tipTitle = (opts.attribute != 'title') ? jQuerythis.attr(opts.titleAttribute) : '';
      if (opts.splitTitle) {
        if (tipTitle == undefined) {tipTitle = '';}
        tipParts = tipTitle.split(opts.splitTitle);
        tipTitle = tipParts.shift();
      }
      if (opts.escapeTitle) {
        tipTitle = tipTitle.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;');
      }
      
      var localContent;
      function returnFalse() { return false; }

/***************************************      
* ACTIVATION
****************************************/
    
//activate clueTip
    var activate = function(event) {
      if (!opts.onActivate(jQuerythis)) {
        return false;
      }
      isActive = true;
      jQuerycluetip.removeClass().css({width: tipInnerWidth});
      if (tipAttribute == jQuerythis.attr('href')) {
        jQuerythis.css('cursor', opts.cursor);
      }
      if (opts.hoverClass) {
        jQuerythis.addClass(opts.hoverClass);
      }
      linkTop = posY = jQuerythis.offset().top;
      linkLeft = jQuerythis.offset().left;
      mouseX = event.pageX;
      mouseY = event.pageY;
      if (link.tagName.toLowerCase() != 'area') {
        sTop = jQuery(document).scrollTop();
        winWidth = jQuery(window).width();
      }
// position clueTip horizontally
      if (opts.positionBy == 'fixed') {
        posX = linkWidth + linkLeft + lOffset;
        jQuerycluetip.css({left: posX});
      } else {
        posX = (linkWidth > linkLeft && linkLeft > tipWidth)
          || linkLeft + linkWidth + tipWidth + lOffset > winWidth 
          ? linkLeft - tipWidth - lOffset 
          : linkWidth + linkLeft + lOffset;
        if (link.tagName.toLowerCase() == 'area' || opts.positionBy == 'mouse' || linkWidth + tipWidth > winWidth) { // position by mouse
          if (mouseX + 20 + tipWidth > winWidth) {  
            jQuerycluetip.addClass(' cluetip-' + ctClass);
            posX = (mouseX - tipWidth - lOffset) >= 0 ? mouseX - tipWidth - lOffset - parseInt(jQuerycluetip.css('marginLeft'),10) + parseInt(jQuerycluetipInner.css('marginRight'),10) :  mouseX - (tipWidth/2);
          } else {
            posX = mouseX + lOffset;
          }
        }
        var pY = posX < 0 ? event.pageY + tOffset : event.pageY;
        jQuerycluetip.css({
          left: (posX > 0 && opts.positionBy != 'bottomTop') ? posX : (mouseX + (tipWidth/2) > winWidth) ? winWidth/2 - tipWidth/2 : Math.max(mouseX - (tipWidth/2),0),
          zIndex: jQuerythis.data('thisInfo').zIndex
        });
        jQuerycluetipArrows.css({zIndex: jQuerythis.data('thisInfo').zIndex+1});
      }
        wHeight = jQuery(window).height();

/***************************************
* load a string from cluetip method's first argument
***************************************/
      if (js) {
        if (typeof js == 'function') {
          js = js.call(link);
        }
        jQuerycluetipInner.html(js);
        cluetipShow(pY);
      }
/***************************************
* load the title attribute only (or user-selected attribute). 
* clueTip title is the string before the first delimiter
* subsequent delimiters place clueTip body text on separate lines
***************************************/

      else if (tipParts) {
        var tpl = tipParts.length;
        jQuerycluetipInner.html(tpl ? tipParts[0] : '');
        if (tpl > 1) {
          for (var i=1; i < tpl; i++){
            jQuerycluetipInner.append('<div class="split-body">' + tipParts[i] + '</div>');
          }          
        }
        cluetipShow(pY);
      }
/***************************************
* load external file via ajax          
***************************************/

      else if (!opts.local && tipAttribute.indexOf('#') !== 0) {
        if (/\.(jpe?g|tiff?|gif|png)jQuery/i.test(tipAttribute)) {
          jQuerycluetipInner.html('<img src="' + tipAttribute + '" alt="' + tipTitle + '" />');
          cluetipShow(pY);
        } else if (cluetipContents && opts.ajaxCache) {
          jQuerycluetipInner.html(cluetipContents);
          cluetipShow(pY);
        } else {
          var optionBeforeSend = opts.ajaxSettings.beforeSend,
              optionError = opts.ajaxSettings.error,
              optionSuccess = opts.ajaxSettings.success,
              optionComplete = opts.ajaxSettings.complete;
          var ajaxSettings = {
            cache: false, // force requested page not to be cached by browser
            url: tipAttribute,
            beforeSend: function(xhr) {
              if (optionBeforeSend) {optionBeforeSend.call(link, xhr, jQuerycluetip, jQuerycluetipInner);}
              jQuerycluetipOuter.children().empty();
              if (opts.waitImage) {
                jQuerycluetipWait
                .css({top: mouseY+20, left: mouseX+20, zIndex: jQuerythis.data('thisInfo').zIndex-1})
                .show();
              }
            },
            error: function(xhr, textStatus) {
              if (isActive) {
                if (optionError) {
                  optionError.call(link, xhr, textStatus, jQuerycluetip, jQuerycluetipInner);
                } else {
                  jQuerycluetipInner.html('<i>sorry, the contents could not be loaded</i>');
                }
              }
            },
            success: function(data, textStatus) {       
              cluetipContents = opts.ajaxProcess.call(link, data);
              if (isActive) {
                if (optionSuccess) {optionSuccess.call(link, data, textStatus, jQuerycluetip, jQuerycluetipInner);}
                jQuerycluetipInner.html(cluetipContents);
              }
            },
            complete: function(xhr, textStatus) {
              if (optionComplete) {optionComplete.call(link, xhr, textStatus, jQuerycluetip, jQuerycluetipInner);}
              var imgs = jQuerycluetipInner[0].getElementsByTagName('img');
              imgCount = imgs.length;
              for (var i=0, l = imgs.length; i < l; i++) {
                if (imgs[i].complete) {
                  imgCount--;
                }
              }
              if (imgCount && !jQuery.browser.opera) {
                jQuery(imgs).bind('load error', function() {
                  imgCount--;
                  if (imgCount<1) {
                    jQuerycluetipWait.hide();
                    if (isActive) { cluetipShow(pY); }
                  }
                }); 
              } else {
                jQuerycluetipWait.hide();
                if (isActive) { cluetipShow(pY); }
              } 
            }
          };
          var ajaxMergedSettings = jQuery.extend(true, {}, opts.ajaxSettings, ajaxSettings);
          
          jQuery.ajax(ajaxMergedSettings);
        }

/***************************************
* load an element from the same page
***************************************/
      } else if (opts.local) {
        
        var jQuerylocalContent = jQuery(tipAttribute + (/#\S+jQuery/.test(tipAttribute) ? '' : ':eq(' + index + ')')).clone(true).show();
        jQuerycluetipInner.html(jQuerylocalContent);
        cluetipShow(pY);
      }
    };

// get dimensions and options for cluetip and prepare it to be shown
    var cluetipShow = function(bpY) {
      jQuerycluetip.addClass('cluetip-' + ctClass);
      if (opts.truncate) { 
        var jQuerytruncloaded = jQuerycluetipInner.text().slice(0,opts.truncate) + '...';
        jQuerycluetipInner.html(jQuerytruncloaded);
      }
      function doNothing() {}; //empty function
      tipTitle ? jQuerycluetipTitle.show().html(tipTitle) : (opts.showTitle) ? jQuerycluetipTitle.show().html('&nbsp;') : jQuerycluetipTitle.hide();
      if (opts.sticky) {
        var jQuerycloseLink = jQuery('<div id="cluetip-close"><a href="#">' + opts.closeText + '</a></div>');
        (opts.closePosition == 'bottom') ? jQuerycloseLink.appendTo(jQuerycluetipInner) : (opts.closePosition == 'title') ? jQuerycloseLink.prependTo(jQuerycluetipTitle) : jQuerycloseLink.prependTo(jQuerycluetipInner);
        jQuerycloseLink.bind('click.cluetip', function() {
          cluetipClose();
          return false;
        });
        if (opts.mouseOutClose) {
          jQuerycluetip.bind('mouseleave.cluetip', function() {
            cluetipClose();
          });
        } else {
          jQuerycluetip.unbind('mouseleave.cluetip');
        }
      }
// now that content is loaded, finish the positioning 
      var direction = '';
      jQuerycluetipOuter.css({zIndex: jQuerythis.data('thisInfo').zIndex, overflow: defHeight == 'auto' ? 'visible' : 'auto', height: defHeight});
      tipHeight = defHeight == 'auto' ? Math.max(jQuerycluetip.outerHeight(),jQuerycluetip.height()) : parseInt(defHeight,10);
      tipY = posY;
      baseline = sTop + wHeight;
      if (opts.positionBy == 'fixed') {
        tipY = posY - opts.dropShadowSteps + tOffset;
      } else if ( (posX < mouseX && Math.max(posX, 0) + tipWidth > mouseX) || opts.positionBy == 'bottomTop') {
        if (posY + tipHeight + tOffset > baseline && mouseY - sTop > tipHeight + tOffset) { 
          tipY = mouseY - tipHeight - tOffset;
          direction = 'top';
        } else { 
          tipY = mouseY + tOffset;
          direction = 'bottom';
        }
      } else if ( posY + tipHeight + tOffset > baseline ) {
        tipY = (tipHeight >= wHeight) ? sTop : baseline - tipHeight - tOffset;
      } else if (jQuerythis.css('display') == 'block' || link.tagName.toLowerCase() == 'area' || opts.positionBy == "mouse") {
        tipY = bpY - tOffset;
      } else {
        tipY = posY - opts.dropShadowSteps;
      }
      if (direction == '') {
        posX < linkLeft ? direction = 'left' : direction = 'right';
      }
      jQuerycluetip.css({top: tipY + 'px'}).removeClass().addClass('clue-' + direction + '-' + ctClass).addClass(' cluetip-' + ctClass);
      if (opts.arrows) { // set up arrow positioning to align with element
        var bgY = (posY - tipY - opts.dropShadowSteps);
        jQuerycluetipArrows.css({top: (/(left|right)/.test(direction) && posX >=0 && bgY > 0) ? bgY + 'px' : /(left|right)/.test(direction) ? 0 : ''}).show();
      } else {
        jQuerycluetipArrows.hide();
      }

// (first hide, then) ***SHOW THE CLUETIP***
      jQuerydropShadow.hide();
      jQuerycluetip.hide()[opts.fx.open](opts.fx.openSpeed || 0);
      if (opts.dropShadow) { jQuerydropShadow.css({height: tipHeight, width: tipInnerWidth, zIndex: jQuerythis.data('thisInfo').zIndex-1}).show(); }
      if (jQuery.fn.bgiframe) { jQuerycluetip.bgiframe(); }
      // delayed close (not fully tested)
      if (opts.delayedClose > 0) {
        closeOnDelay = setTimeout(cluetipClose, opts.delayedClose);
      }
      // trigger the optional onShow function
      opts.onShow.call(link, jQuerycluetip, jQuerycluetipInner);
    };

/***************************************
   =INACTIVATION
-------------------------------------- */
    var inactivate = function(event) {
      isActive = false;
      jQuerycluetipWait.hide();
      if (!opts.sticky || (/click|toggle/).test(opts.activation) ) {
        cluetipClose();
        clearTimeout(closeOnDelay);        
      }
      if (opts.hoverClass) {
        jQuerythis.removeClass(opts.hoverClass);
      }
    };
// close cluetip and reset some things
    var cluetipClose = function() {
      jQuerycluetipOuter
      .parent().hide().removeClass();
      opts.onHide.call(link, jQuerycluetip, jQuerycluetipInner);
      jQuerythis.removeClass('cluetip-clicked');
      if (tipTitle) {
        jQuerythis.attr(opts.titleAttribute, tipTitle);
      }
      jQuerythis.css('cursor','');
      if (opts.arrows) {
        jQuerycluetipArrows.css({top: ''});
      }
    };

    jQuery(document).bind('hideCluetip', function(e) {
      cluetipClose();
    });
/***************************************
   =BIND EVENTS
-------------------------------------- */
  // activate by click
      if ( (/click|toggle/).test(opts.activation) ) {
        jQuerythis.bind('click.cluetip', function(event) {
          if (jQuerycluetip.is(':hidden') || !jQuerythis.is('.cluetip-clicked')) {
            activate(event);
            jQuery('.cluetip-clicked').removeClass('cluetip-clicked');
            jQuerythis.addClass('cluetip-clicked');
          } else {
            inactivate(event);
          }
          this.blur();
          return false;
        });
  // activate by focus; inactivate by blur    
      } else if (opts.activation == 'focus') {
        jQuerythis.bind('focus.cluetip', function(event) {
          activate(event);
        });
        jQuerythis.bind('blur.cluetip', function(event) {
          inactivate(event);
        });
  // activate by hover
      } else {
        // clicking is returned false if clickThrough option is set to false
        jQuerythis[opts.clickThrough ? 'unbind' : 'bind']('click', returnFalse);
        //set up mouse tracking
        var mouseTracks = function(evt) {
          if (opts.tracking == true) {
            var trackX = posX - evt.pageX;
            var trackY = tipY ? tipY - evt.pageY : posY - evt.pageY;
            jQuerythis.bind('mousemove.cluetip', function(evt) {
              jQuerycluetip.css({left: evt.pageX + trackX, top: evt.pageY + trackY });
            });
          }
        };
        if (jQuery.fn.hoverIntent && opts.hoverIntent) {
          jQuerythis.hoverIntent({
            sensitivity: opts.hoverIntent.sensitivity,
            interval: opts.hoverIntent.interval,  
            over: function(event) {
              activate(event);
              mouseTracks(event);
            }, 
            timeout: opts.hoverIntent.timeout,  
            out: function(event) {inactivate(event); jQuerythis.unbind('mousemove.cluetip');}
          });           
        } else {
          jQuerythis.bind('mouseenter.cluetip', function(event) {
            activate(event);
            mouseTracks(event);
          })
          .bind('mouseleave.cluetip', function(event) {
            inactivate(event);
            jQuerythis.unbind('mousemove.cluetip');
          });
        }
        jQuerythis.bind('mouseover.cluetip', function(event) {
          jQuerythis.attr('title','');
        }).bind('mouseleave.cluetip', function(event) {
          jQuerythis.attr('title', jQuerythis.data('thisInfo').title);
        });
      }
    });
  };
  
/*
 * options for clueTip
 *
 * each one can be explicitly overridden by changing its value. 
 * for example: jQuery.fn.cluetip.defaults.width = 200;
 * would change the default width for all clueTips to 200. 
 *
 * each one can also be overridden by passing an options map to the cluetip method.
 * for example: jQuery('a.example').cluetip({width: 200});
 * would change the default width to 200 for clueTips invoked by a link with class of "example"
 *
 */
  
  jQuery.fn.cluetip.defaults = {  // set up default options
    width:            275,      // The width of the clueTip
    height:           'auto',   // The height of the clueTip
    cluezIndex:       97,       // Sets the z-index style property of the clueTip
    positionBy:       'auto',   // Sets the type of positioning: 'auto', 'mouse','bottomTop', 'fixed'
    topOffset:        15,       // Number of px to offset clueTip from top of invoking element
    leftOffset:       15,       // Number of px to offset clueTip from left of invoking element
    local:            false,    // Whether to use content from the same page for the clueTip's body
    localPrefix:      null,       // string to be prepended to the tip attribute if local is true
    hideLocal:        true,     // If local option is set to true, this determines whether local content
                                // to be shown in clueTip should be hidden at its original location
    attribute:        'rel',    // the attribute to be used for fetching the clueTip's body content
    titleAttribute:   'title',  // the attribute to be used for fetching the clueTip's title
    splitTitle:       '',       // A character used to split the title attribute into the clueTip title and divs
                                // within the clueTip body. more info below [6]
    escapeTitle:      false,    // whether to html escape the title attribute
    showTitle:        true,     // show title bar of the clueTip, even if title attribute not set
    cluetipClass:     'default',// class added to outermost clueTip div in the form of 'cluetip-' + clueTipClass.
    hoverClass:       '',       // class applied to the invoking element onmouseover and removed onmouseout
    waitImage:        true,     // whether to show a "loading" img, which is set in jquery.cluetip.css
    cursor:           'help',
    arrows:           false,    // if true, displays arrow on appropriate side of clueTip
    dropShadow:       true,     // set to false if you don't want the drop-shadow effect on the clueTip
    dropShadowSteps:  6,        // adjusts the size of the drop shadow
    sticky:           false,    // keep visible until manually closed
    mouseOutClose:    false,    // close when clueTip is moused out
    activation:       'hover',  // set to 'click' to force user to click to show clueTip
                                // set to 'focus' to show on focus of a form element and hide on blur
    clickThrough:     false,    // if true, and activation is not 'click', then clicking on link will take user to the link's href,
                                // even if href and tipAttribute are equal
    tracking:         false,    // if true, clueTip will track mouse movement (experimental)
    delayedClose:     0,        // close clueTip on a timed delay (experimental)
    closePosition:    'top',    // location of close text for sticky cluetips; can be 'top' or 'bottom' or 'title'
    closeText:        'Close',  // text (or HTML) to to be clicked to close sticky clueTips
    truncate:         0,        // number of characters to truncate clueTip's contents. if 0, no truncation occurs
    
    // effect and speed for opening clueTips
    fx: {             
                      open:       'show', // can be 'show' or 'slideDown' or 'fadeIn'
                      openSpeed:  ''
    },     

    // settings for when hoverIntent plugin is used             
    hoverIntent: {    
                      sensitivity:  3,
              			  interval:     50,
              			  timeout:      0
    },

    // short-circuit function to run just before clueTip is shown. 
    onActivate:       function(e) {return true;},
    // function to run just after clueTip is shown. 
    onShow:           function(ct, ci){},
    // function to run just after clueTip is hidden.
    onHide:           function(ct, ci){},
    // whether to cache results of ajax request to avoid unnecessary hits to server    
    ajaxCache:        true,  

    // process data retrieved via xhr before it's displayed
    ajaxProcess:      function(data) {
                        data = data.replace(/<(script|style|title)[^<]+<\/(script|style|title)>/gm, '').replace(/<(link|meta)[^>]+>/g,'');
                        return data;
    },                

    // can pass in standard jQuery.ajax() parameters. Callback functions, such as beforeSend,
    // will be queued first within the default callbacks. 
    // The only exception is error, which overrides the default
    ajaxSettings: {
                      // error: function(ct, ci) { /* override default error callback */ }
                      // beforeSend: function(ct, ci) { /* called first within default beforeSend callback }
                      dataType: 'html'
    },
    debug: false
  };


/*
 * Global defaults for clueTips. Apply to all calls to the clueTip plugin.
 *
 * @example jQuery.cluetip.setup({
 *   insertionType: 'prependTo',
 *   insertionElement: '#container'
 * });
 * 
 * @property
 * @name jQuery.cluetip.setup
 * @type Map
 * @cat Plugins/tooltip
 * @option String insertionType: Default is 'appendTo'. Determines the method to be used for inserting the clueTip into the DOM. Permitted values are 'appendTo', 'prependTo', 'insertBefore', and 'insertAfter'
 * @option String insertionElement: Default is 'body'. Determines which element in the DOM the plugin will reference when inserting the clueTip.
 *
 */
   
  var insertionType = 'appendTo', insertionElement = 'body';

  jQuery.cluetip.setup = function(options) {
    if (options && options.insertionType && (options.insertionType).match(/appendTo|prependTo|insertBefore|insertAfter/)) {
      insertionType = options.insertionType;
    }
    if (options && options.insertionElement) {
      insertionElement = options.insertionElement;
    }
  };
  
})(jQuery);
