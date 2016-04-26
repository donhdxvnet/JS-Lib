var switchValue = function(objId, attrib, value1, value2)
{
	try {
		objId = "#" + objId; //important		
		if (jQuery(objId).css(attrib) == value1)
			jQuery(objId).css(attrib, value2);
		else
			jQuery(objId).css(attrib, value1);		
	} catch (oE) { alert(oE.message); }
}

var checkUncheck = function(obj, listObj)
{
	try
	{
		if ( obj.checked || obj.selected )
		{
			for (i = 0; i < listObj.length; i++)
			{
				document.getElementById(listObj[i]).checked = false;
				document.getElementById(listObj[i]).selected = false;
			}
		}
	}
	catch (oError)
	{
		//alert(oError.message);
	}
}

var enable = function(obj, listObj)
{
	try
	{
		if (obj.selected || obj.checked)
		{
			for (i = 0; i < listObj.length; i++)
			{
				document.getElementById(listObj[i]).disabled = true;
			}
		}
	}
	catch (oError)
	{
		//alert(oError.message);
	}
}

var disable = function(obj, listObj)
{
	try
	{
		for (i = 0; i < listObj.length; i++)
		{
			document.getElementById(listObj[i]).disabled = ! obj.selected;
			document.getElementById(listObj[i]).disabled = ! obj.checked;
		}
	}
	catch (oError)
	{
		//alert(oError.message);
	}
}

var uncheck = function(obj, listObj)
{
	try
	{
		if ( ! obj.checked || ! obj.selected )
		{
			for (i = 0; i < listObj.length; i++)
			{
				//alert( document.getElementById(listObj[i]).checked);
				document.getElementById(listObj[i]).checked = false;
				document.getElementById(listObj[i]).selected = false;
			}
		}
	}
	catch (oError)
	{
		//alert(oError.message);
	}
}

// Exemple : check(this, ['module|player'])
var check = function(obj, listObj)
{
	try
	{
		if ( obj.checked || obj.selected )
		{
			for (i = 0; i < listObj.length; i++)
			{
				document.getElementById(listObj[i]).checked = true;
				document.getElementById(listObj[i]).selected = true;
			}
		}
	}
	catch (oError)
	{
		//alert(oError.message);
	}
}

function isDate(str) {
	var reg = new RegExp("^[0-9]{8}$","g");
	return reg.test(str);
}

function isAlphabetic(val) {
	if (val.match(/^[a-zA-Z]+$/)) return true;
	return false;
}

function isAlphaNumeric(val) {
	if (val.match(/^[a-zA-Z0-9]+$/)) return true;
	return false; 
}

function isUrl(url)
{
	return url.match(/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/);
}

function isStreamingUrl(url)
{
    if (url.indexOf("://") == -1) return false;    
    return true;        
}

function isAlphaNumericHyphenUnderscoreSlash(text)
{
	var regExpression = /^[\w/-]+$/;
	if (regExpression.test(text)) return true;
	else return false;
}

function isAlphaNumericHyphenUnderscore(text)
{
	var regExpression = /^[\w-]+$/;
	if (regExpression.test(text)) return true;
	else return false;
}

function isAlphaNumericAccentsHyphenUnderscore(text)
{
	var regExpression = /^[\wÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôùû-]+$/;
	if (regExpression.test(text)) return true;
	else return false;
}

function isAlphaNumericHyphenUnderscoreAndSpace(text)
{
	var regExpression = /^[\w -]+$/;
	if (regExpression.test(text)) return true;
	else return false;
}

function isAlphaNumericAccentsHyphenUnderscoreAndSpace(text)
{
	var regExpression = /^[\wÀÂÇÈÉÊËÎÔÙÛàâçèéêëîôùû -]+$/;
	if (regExpression.test(text)) return true;
	else return false;
}

function global_option_click(){
	var params = {
		mod : 'menu',
		ajax : 'updateadmincontent',
		client: false
	};
	Helper.load('global_content', params, function(){
		if(jQuery('ul#adminMenu li.nav_on').length > 0) change_body_class(jQuery('ul#adminMenu li.nav_on').attr('id').split('_')[1]);
	});
}

function global_client_onchange(o){
	if ( o.value == '0') return;
	var params = {
		mod : 'menu',
		ajax : 'updateclientcontent',
		id : o.value
	};
	//o.selectedIndex = 0; //Garde l'element selectionne
	Helper.load('global_content', params, function(){
		if(jQuery('ul#clientMenu li.nav_on').length > 0)
                {
                    change_body_class(jQuery('ul#clientMenu li.nav_on').attr('id').split('_')[1]);
                }
	});
}

function changeBodyClassFromClientMenu(){
	if(jQuery('ul#clientMenu li.nav_on').length > 0) change_body_class(jQuery('ul#clientMenu li.nav_on').attr('id').split('_')[1]);
}

function global_event(id, datas_version, cc_version)
{
	var params = {
		'mod': 'menu',
		'ajax': 'updateeventcontent',
		id :id
	}
	if (jQuery.type(datas_version) !== "undefined") params["datas_version"] = datas_version;
	if (jQuery.type(cc_version) !== "undefined") params["cc_version"] = cc_version;
	Helper.load('client_content', params, function(){
		if(jQuery('ul#eventMenu li.nav_2_on').length > 0){
			var sModule = jQuery('ul#eventMenu li.nav_2_on').attr('id').split('_')[1];
			if(sModule == 'gestion')
				sModule = jQuery('#nav_3 ul.content_menu_3 li.nav_3_on').attr('id').split('_')[1];
			change_body_class(sModule);
			menu_2_onchange(jQuery('ul#eventMenu li.nav_2_on'), "nav_2_on", "nav_2_off", "puce_nav_2_prev_on", "puce_nav_2_next_on");
		}
	});

	var params2 = {
		'mod': 'menu',
		'ajax': 'updateeventtitle',
		id :id
	}
	Helper.load('nom_event', params2);
	
	var params3 = {
		'mod' : 'menu',
		'ajax' : 'updateversion'		
	}
	Helper.load('datasVersion', params3);
}

function update_customCssPath(path)
{
    jQuery('#customMainCssSkin').attr('href',path);
}

content_menu_2_onchange = function(o, sDestinationDiv){
	var aSplitId = o.id.split("_");
	var sModule = aSplitId[1];
	var params = {
			mod : sModule,
			ajax : true,
			client: true,
			menu : o.id.split('_')[0]
	};
	Helper.load(sDestinationDiv, params, function(){
		menu_2_onchange(o, "nav_2_on", "nav_2_off", "puce_nav_2_prev_on", "puce_nav_2_next_on");
		menu_3_clear("nav_3", "nav_3_on", "nav_3_off");
		change_body_class(sModule);
	});
}

content_menu_3_onchange = function(o, sDestinationDiv, sMenu2Div){
	var aSplitId = o.id.split("_");
	var sModule = aSplitId[1];
	var params = {
			mod : sModule,
			ajax : true,
			client: true
	};
	Helper.load(sDestinationDiv, params, function(){
		menu_2_onchange(jQuery("#"+sMenu2Div), "nav_2_on", "nav_2_off", "puce_nav_2_prev_on", "puce_nav_2_next_on");
		menu_3_onchange(o, "nav_3_on", "nav_3_off");
		change_body_class(sModule);
	});
}

content_menu_3_goto = function(oId, sDestinationDiv, sMenu2Div) {
	var aSplitId = oId.split("_");
	var sModule = aSplitId[1];
	var params = {
			mod : sModule,
			ajax : true,
			client: true
	};
	Helper.load(sDestinationDiv, params, function() {
		change_body_class(sModule);
	});
}

change_body_class = function(sModule){
	jQuery('body').removeClass();
	if(sModule != '') jQuery('body').addClass(sModule);
}

content_menu_2_onmouseover = function(o, sDivIdToShow){
	var oPosition = jQuery(o).position();
	var nLeft = oPosition.left - 3;
	var oDivToShow = jQuery("#" + sDivIdToShow);
	oDivToShow.css("left", nLeft + "px");
	oDivToShow.css("visibility", "visible");
}

content_menu_2_onmouseout = function(o, sDivIdToHide){
	var oDivToHide = jQuery("#" + sDivIdToHide);
	jQuery('body').one("mousemove", function(event){
		var nMouseX = event.pageX;
		var nMouseY = event.pageY;

		var oDivPosition = oDivToHide.position();
		var nDivMinX = oDivPosition.left;
		var nDivMaxX = oDivToHide.width() + nDivMinX;
		var nDivMinY = oDivPosition.top;
		var nDivMaxY = oDivToHide.height() + nDivMinY;

		if(nDivMinX <= nMouseX && nMouseX <= nDivMaxX && nDivMinY <= nMouseY && nMouseY <= nDivMaxY){
			oDivToHide.one("mouseleave", function(event){
				oDivToHide.css("visibility", "hidden");
				//oDivToHide.css("border", "1px red solid");
			});
		}else{
			oDivToHide.css("visibility", "hidden");
		}
	});
	//menu_2_onchange(o, "nav_2_on", "nav_2_off", "puce_nav_2_prev_on", "puce_nav_2_next_on", "mouseout", "nav_2_before_over");
}

content_menu_1_onchange = function(o, sDestinationDiv){
	jQuery('#nom_event').empty();
	var aSplitId = o.id.split("_");
	var sModule = aSplitId[1];
	var params = {
			mod : sModule,
			ajax : true,
			client: true,
			menu : o.id.split('_')[0]
	};
	Helper.load(sDestinationDiv, params, function(){
		menu_1_onchange(o, "nav_on", "nav_off");
		change_body_class(sModule);
	});
}

menu_1_onchange = function(clickedLi, classOn, ClassOff) {
	var aLi = jQuery(clickedLi).siblings();
	for(i=0; i<aLi.length; i++) {
		jQuery(aLi[i]).removeClass(classOn);
		if(!jQuery(aLi[i]).hasClass(ClassOff)) jQuery(aLi[i]).addClass(ClassOff);
	}
	jQuery(clickedLi).addClass(classOn);
}

menu_2_onchange = function(clickedLi, classOn, classOff, classPucePrev, classPuceNext, action, classBeforeOver) {
	/*
	var aLi = jQuery(clickedLi).siblings('.clickable');
	for(i=0; i<aLi.length; i++) {
		var oTemp = jQuery(aLi[i]);
		oTemp.removeClass(classOn);
		//oTemp.removeClass(classOnNext);
		if(!oTemp.hasClass(classOff)) oTemp.addClass(classOff);
	}
	*/
	switch(action){
		case 'mouseover' :
			var bOver = true;
			break;
		case 'mouseout' :
			var bOut = true;
			clickedLi = jQuery('.'+classBeforeOver);
			break;
	}

	var oLastLi = jQuery('.'+classOn);
	oLastLi.removeClass(classOn);
	if(bOut) jQuery('.'+classBeforeOver).removeClass(classBeforeOver);
	oLastLi.addClass(classOff);
	if(bOver) oLastLi.addClass(classBeforeOver);
	jQuery(clickedLi).addClass(classOn);
	//jQuery(clickedLi).next().addClass(classOnNext);

	var bFirst, bLast;
	try {jQuery('.'+classPucePrev).removeClass(classPucePrev);
	} catch(e) {bFirst = true;}
	try {jQuery('.'+classPuceNext).removeClass(classPuceNext);
	} catch(e) {bLast = true;}
	if(!bFirst) jQuery(clickedLi).prev().addClass(classPucePrev);
	if(!bLast) jQuery(clickedLi).next().addClass(classPuceNext);
}

menu_3_onchange = function(clickedLi, classOn, classOff) {
	var oClickedLi = jQuery(clickedLi);
	var aLi = oClickedLi.siblings();
	for(i=0; i<aLi.length; i++) {
		var oTemp = jQuery(aLi[i]);
		if(oTemp.hasClass(classOn)) oTemp.removeClass(classOn);
		if(!oTemp.hasClass(classOff)) oTemp.addClass(classOff);
	}
	oClickedLi.addClass(classOn);
}

menu_3_clear = function(sDivId, classOn, classOff) {
	var aLi = jQuery('#' + sDivId + ' > ul > li');
	for(i=0; i<aLi.length; i++) {
		var oTemp = jQuery(aLi[i]);
		if(oTemp.hasClass(classOn)) oTemp.removeClass(classOn);
		if(!oTemp.hasClass(classOff)) oTemp.addClass(classOff);
	}
}

update_global_menu_config = function(){
	var params = {
		mod : 'menu',
		ajax : 'updateglobalmenuconfig'
	};
	Helper.load('global_menu_config', params);
}

update_global_menu_client = function(){
	var params = {
		mod : 'menu',
		ajax : 'updateglobalmenuclient'
	};
	Helper.load('global_menu_client', params);
}

watch_field_form = function(form_id)
{
    jQuery('#'+form_id+' :input').each(function()
    {
        if(jQuery(this).attr('type')=='radio')
        {
            var checked = jQuery(this).is(':checked');
            jQuery(this).click(function()
                {
                    if(checked!=jQuery(this).is(':checked'))
                    {
                       var name = jQuery(this).attr('name');
                       jQuery('input[name="'+name+'"]').each(function()
                       {
                            jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('border', 'none');
                            jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('margin-left', '0px');
                       });
                       jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('border', '1px solid darkred');
                       jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('margin-left', '-1px');
                    }
                    else
                    {
                       var name2 = jQuery(this).attr('name');
                       jQuery('input[name="'+name2+'"]').each(function()
                       {
                           jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('border', 'none');
                           jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('margin-left', '0px');
                       });
                    }
                });
        }
        if(jQuery(this).attr('type')=='checkbox')
        {
            var checkedCheck = jQuery(this).is(':checked');
            jQuery(this).click(function()
                {
                    if(checkedCheck!=jQuery(this).is(':checked'))
                    {
                        jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('border', '1px solid darkred');
                        jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('margin-left', '-1px');
                    }
                    else
                    {
                       jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('border', 'none');
                       jQuery('label[for="'+jQuery(this).attr('id')+'"]').css('margin-left', '0px');
                    }
                });
        }
        else
        {
            if(jQuery(this).attr('type')=='text')
            {
                var oldValue = jQuery(this).val();
                jQuery(this).keyup(
                    function()
                    {
                        if(oldValue!=jQuery(this).val())
                        {
                        jQuery(this).css('border-color', 'darkred');
                        }
                        else
                        {
                            jQuery(this).css('border-color', ' #C5CBCB');
                        }
                    });
            }
            else
            {
                var oldValueSelect = jQuery(this).val();
                jQuery(this).change(function()
                {
                    if(oldValueSelect!=jQuery(this).val())
                    {
                        jQuery(this).css('border-color', 'darkred');
                    }
                    else
                    {
                        jQuery(this).css('border-color', ' #C5CBCB');
                    }
                });
            }
        }
    });
}

relay_enter_key = function(elementToWatchSelector,validationButtonSelector)
{
    jQuery(elementToWatchSelector).keyup(function(e){

        var code = (e.keyCode ? e.keyCode : e.which);
            if(code == 13)
            {
            jQuery(validationButtonSelector).click();
            }
        });
}

window.onresize = function()
{
    jQuery('.event').css('height','100%');
}