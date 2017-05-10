 
	//Copy from https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
	var availableHeaderTags = [
			  "Accept",
			  "Accept-Charset",
			  "Accept-Encoding",
			  "Accept-Language",
			  "Accept-Datetime",
			  "Authorization",
			  "Cache-Control",
			  "Connection",
			  "Cookie",
			  "Content-Length",
			  "Content-MD5",
			  "Content-Type",
			  "Date",
			  "Expect",
			  "Forwarded",
			  "From",
			  "Host",
			  "If-Match",
			  "If-Modified-Since",
			  "If-None-Match",
			  "If-Range",
			  "If-Unmodified-Since",
			  "Max-Forwards",
			  "Origin",
			  "Pragma",
			  "Proxy-Authorization",
			  "Range",
			  "Referer",
			  "TE",
			  "User-Agent",
			  "Upgrade",
			  "Via",
			  "Warning"
	];
	
	var availableHeaderValueTags = [
			  "application/octet-stream",	
			  "application/postscript",
			  "application/base64",
			  "application/macbinhex40",
			  "application/pdf",
			  "application/xml",
			  "application/atom+xml",
			  "application/rss+xml",
			  "application/x-compressed",
			  "application/x-zip-compressed",
			  "application/x-gzip-compressed",
			  "application/java",
			  "application/x-msdownload",
			  "application/json",
			  "audio/x-aiff",
			  "audio/basic",
			  "audio/mid",
			  "audio/wav",
			  "image/gif",
			  "image/jpeg",
			  "image/pjpeg",
			  "image/png",
			  "image/x-png",
			  "image/tiff",
			  "image/bmp",
			  "image/x-xbitmap",
			  "image/x-jg",
			  "image/x-emf",
			  "image/x-wmf",
			  "text/plain",
			  "text/html",
			  "text/xml",
			  "text/richtext",
			  "text/scriptlet",
			  "video/avi",
			  "video/mpeg"
			  
	];
 
	var proxyUrlDataStr="\"data\":[";
	var webApiProxyCnt = 0;
 
	$(function() {
		$( "#tabs" ).tabs();
	});

	$(function() {
		$( "#checkParams" ).button();
		//$( "#proxyParamscheck" ).button();
		$( "#checkHeaders" ).button();
	});

	$(function() {
		$( "#proxyMethod" ).selectmenu({
			position: { my : "left top", at: "left bottom", collision: "none" }
		});
	});

	$(function() {
		$( "button:first" ).button({
			icons: {
				primary: "ui-icon-extlink"
				//secondary: "ui-icon-triangle-1-s"
			}
		});
	});	

	$(function() {
		$( document ).tooltip({ show: { duration: 800 } });
	});

	
	$(document).ready(function(){
		
		//Compose the test proxy url
		$( "#proxyUrl" ).val(location.protocol + '//' + location.host+'/restapi/proxy');
		
		configButtons();
		
		//configTexts();
		//$("#oDataURL").attr("title", $("#oDataURL").val()); //tooltip
		
		setHeaderAutoComplete();
		
		$('.proxySend').click(function(){
			proxySendSubmit();
		});	
	}); //end $(document).ready
	
	function checkUrl(urlStr){
		var isUrlValid = false;
		var urlexp = new RegExp('(http|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'i');
		if ( urlexp.test(urlStr) ){
			isUrlValid = true;
		}
		return isUrlValid;
	}
	
	function proxySendSubmit(){
		
		var proxyUrl = $('#OData').find('[name="proxyURL"]').val();
		if(proxyUrl!=null)	proxyUrl = proxyUrl.trim();
		
        console.log("proxyUrl="+proxyUrl);
		
		var fullUrl = $('#OData').find('[name="oDataURL"]').val();
		if(fullUrl!=null)	fullUrl = fullUrl.trim();
		
		
		if(checkUrl(fullUrl) == false){
			jqAlert("Please type the valid URL!","Alert");
            return;
		}
		
		if(fullUrl=== undefined || fullUrl.length==0){
			jqAlert("Please type the URL!","Alert");
            return;
		}
		
        var urlArr = fullUrl.split("?");
		
        var url =  urlArr[0];
        var type = $('#OData').find('[name="proxyMethod"]').val();
        var data ;
        var headers ;
		
		contForm.action = proxyUrl;
		contForm.url.value = url;
		contForm.type.value = type;
		
		//@TODO alex - print data on text area
		proxyUrlDataStr="";		
        proxyUrlDataStr += (++ajax_counter)+". "+ $('#proxyUrl').val();
		
		proxyUrlDataStr += "\n\n{\n  \"url\":\"" + urlArr[0] + "\",\n";
        proxyUrlDataStr += "  \"type\":\"" + $('#OData').find('[name="proxyMethod"]').val() + "\",\n";
        proxyUrlDataStr += "  \"data\":[" ;
		
		//Remove data[]
		removeFormArr("data[]");
		
		var dataStrArr = getDataArray();
		if(dataStrArr!=null && dataStrArr.length>0){
			for(var idx=0; idx<dataStrArr.length; idx++){
				$('<input type="text" id="data[]" name="data[]" value="'+ dataStrArr[idx] +'">').appendTo( $('#formDiv') );
				
				var notLastQuote="";
				if(idx==(dataStrArr.length-1)){
					notLastQuote="";
				}else{
					notLastQuote=",";
				}
				proxyUrlDataStr += ( "\n\t\""+dataStrArr[idx]+ "\""+notLastQuote);
			}
		}
		
		proxyUrlDataStr += "\n  ],";
		
		console.log(proxyUrlDataStr);
		
		//Remove headers[]
		removeFormArr("headers[]");
		
		proxyUrlDataStr += "\n  \"headers\":[\n" ;
		
		var headersArray = getHeadersArray();
		if(headersArray!=null && headersArray.length>0){
			for(var idx=0; idx<headersArray.length; idx++){
				$('<input type="text" id="headers[]" name="headers[]" value="'+ headersArray[idx] +'">').appendTo( $('#formDiv') );
				proxyUrlDataStr += "\t\"" + headersArray[idx] + "\"\n";
			}
		}
		proxyUrlDataStr += "  ]\n}\n";
		
		$response_area.html('');
		$("#respArea").append(proxyUrlDataStr);
		
		contForm.submit();
	}
	
	function jqAlert(outputMsg, titleMsg, onCloseCallback) {
	    if (!titleMsg)
	        titleMsg = 'Alert';

	    if (!outputMsg)
	        outputMsg = 'Unknow error!';
	    //ui-icon-info ui-icon-notice ui-icon-alert ui-icon-help
	    outputMsg = '<table align="left"><tr valign="center"><td>'+
                    '<span class="ui-icon ui-icon-alert" style="float:left; margin:100 200px 200px 100;"></span>'+
                    '</td></tr></table>'+
                    '<span style="color:orange;font-weight:bold;">&nbsp;'+outputMsg+'</span>';
        //outputMsg = '<img src="./resources/img/alert.jpg" alt="Alert!" />'+ outputMsg;
        
	    //$("<div></div>").html(outputMsg).dialog({
	    $('<div></div>').html(outputMsg).dialog({	
	        title: titleMsg,
	        resizable: false,
	        modal: true,
	        buttons: {
	            "OK": function () {
	                $(this).dialog("close");
	            }
	        },
	        close: onCloseCallback
	    });
	}

	function configTexts(){
		//headerKeyTxtName[]
		/*
		$("#headerTxtId").each(function( index ) {
			console.log( index + "<--:--> " + $( this ).text() );
		});
		.ui-state-default .ui-state-focus .ui-state-active
		*/
		$(":text").each(function (index){
			if($(this).attr("name") == "headerKeyTxtName[]"){	
				//	$(this).addClass("ui-state-highlight ui-corner-all");
				//$(this).addClass("ui-state-active");		
				
					
				//$(this).attr("calss","ui-state-hover ");
				/*
				$(this).mouseover(function() {
					console.log("mouseenter---");
					$( this ).addClass("ui-state-highlight ui-corner-all"); 
				});
				$(this).mouseout(function() {
					console.log("mouseleave---");
					//$(this).attr("calss","");
					$( this ).removeClass("ui-state-highlight ui-corner-all"); 
				});
				*/
			}
		});	
		
		
	}
	
	function setTxtFocusStyle(uiObj){
		if(uiObj!=null){
			$(uiObj).addClass("txtFocusClass"); 	
		}
	}
	
	function removeTxtFocusStyle(uiObj){
		if(uiObj!=null){
			//console.log("removeTxtFocusStyle---");
			$(uiObj).removeClass("txtFocusClass"); 
			$(uiObj).addClass("defaultTxtClass"); 	
		}
	}
	
	function setHighlight(uiObj){
		if(uiObj!=null){
			$(uiObj).addClass("ui-state-highlight ui-corner-all"); 	
		}		
	}
	
	function recoverHighlight(uiObj){
		if(uiObj!=null){
			$(uiObj).removeClass("ui-state-highlight ui-corner-all"); 	
		}		
	}
	
	/** Parse the data url. */
	function parseDataUrl(){
		var fullUrl = $("#oDataURL").val();
		var urlArr = fullUrl.split("?");
		if(urlArr[1]!=null){
			var paramArr = urlArr[1].split("&");
			var hasParamBln = false;
			for(var idx=0; idx< paramArr.length; idx++){
				var keyValArr = paramArr[idx].split("=");
				var paramKey = keyValArr[0];
				var paramValue = keyValArr[1];
				
				if(idx==0){//Remove the 1st empty row, just do once
					$("#paramMinusBut").parent().parent().remove();
					hasParamBln = true;
				}
				
				//Add 1 parameter row with parameter
				addParamRow(paramKey, paramValue);
			}
			//var input = $( ":button" ).addClass( "paramAcceptButClass" );
			if(hasParamBln == true) 	addParamRow("", "");
		}
		
	}
	
	function configButtons(){
		
		$("#headerMinusBut").addClass("headerMinusButClass");
		$("#headerAcceptBut").addClass("headerAcceptButClass");
		$("#paramAcceptBut").addClass("paramAcceptButClass");
		$("#paramMinusBut").addClass("paramMinusButClass");			
		
		
		$('headerAcceptBut').button({
			icons: {
				primary: 'ui-icon-trash'
			},
			text: false
		});
    
		$( "#proxyMethod" ).position({
			my: "left center",
			at: "left center"
			
		});
		
		//$("#proxyReset").addClass("proxyResetClass");
		$("#proxyReset").button({
			icons: {
				primary: "ui-icon-trash"
			}
		});
		//$("#proxyContentPage").addClass("proxyTestClass");
		$("#proxyContentPage").button({
			icons: {
				primary: "ui-icon-info"
			}
		});
	}
	
	/**
	 * Load test Header and values
	 * param.headers=[{'Authorization':'AccessToken=wy39DVLSkXyG5ab2zrdCqtC65qLEqUeuk79EY7DgqTTUGPbFL63C9U2y',
	 *               'ACCEPT':'application/json;odata=verbose'}];
	 */
	function loadTestHeader(){
		$("#headerMinusBut").parent().parent().remove();
		
		addHeaderRow("Authorization","AccessToken=wy39DVLSkXyG5ab2zrdCqtC65qLEqUeuk79EY7DgqTTUGPbFL63C9U2y");
		addHeaderRow("ACCEPT","application/json;odata=verbose");
		addHeaderRow("","");
		
	}
	
	function removeHeader(thisHead){
		var thisImgIdx = 0;
		var maxImgIdx = 0;
		$(":button").each(function (index){
			if($(this).attr("name") == "headerMinusBut"){
				maxImgIdx++;
				if($(this).is($(thisHead)) ){ //Get the index of action image button
					thisImgIdx=maxImgIdx;	
				}	
			}
		})	
		
		var countIdx = 0;
		$(":text").each(function (index){
			if($(this).attr("name") == "headerKeyTxtName[]"){	
				countIdx++;
			}
		})	
		
		var thisKeyTxtIdx=0;
		$(":text").each(function (index){
			if($(this).attr("name") == "headerKeyTxtName[]"){	
				
				thisKeyTxtIdx++;
				//console.log("thisKeyTxtIdx="+thisKeyTxtIdx);
				if(thisImgIdx==thisKeyTxtIdx){//Get the text by the index of action image button
					console.log("headerKeyTxtName[] $(this).val()="+$(this).val()+" maxImgIdx="+maxImgIdx);
					//Header key text without value
					if( $(this).val().length==0 ){
						//More than 2 rows
						if(maxImgIdx>1 && countIdx>1){
							$(thisHead).parent().parent().remove();	
						}
					}else{
						if(countIdx>1)
							$(thisHead).parent().parent().remove();	
					}
				}
			}
		})		
	}

	
	function removeParam(thisParam){
		if($(thisParam).val().length == 0){
			var countIdx = 0;
			$(":text").each(function (index){
				if($(this).attr("name") == "paramKeyTxtName[]"){	
					countIdx++;
				}
			})	
			
			if(countIdx>1){
				$(thisParam).parent().parent().remove();	
			}
		}
		
		updateUrl();
	}
	
	/** Create a header row */
	function addHeaderRow(headerKey, headerValue){
		var headerButStr = '<tr valign="top">\n';
			headerButStr +=		'<td valign="center">';
			headerButStr +=			'<button id="headerAcceptBut" name="headerAcceptBut" class="ui-icon ui-icon-circle-check"></button>';
			headerButStr +=		'</td>';
			headerButStr +=		'<td width="50%">';
			headerButStr +=			'<input type="text" id="headerTxtId" class="defaultTxtClass" name="headerKeyTxtName[]" value="'+headerKey+'"';
			headerButStr += 				' placeholder="Header" ';
			headerButStr +=					' onclick="checkHeaderRowTxt(this,'  + "'headerKeyTxtName[]'" + ');" ';
			headerButStr +=					' onmouseover="setHighlight(this);" onmouseout="recoverHighlight(this);" onblur="removeTxtFocusStyle(this);" />'; 
			headerButStr +=		'</td>';
			headerButStr +=		'<td width="50%">';
			headerButStr +=			'<input type="text" id="headerTxtValue" class="defaultTxtClass" name="headerValueTxtName[]" value="'+headerValue+'"';
			headerButStr +=				' placeholder="Value" ';
			headerButStr +=			'onclick="checkHeaderRowTxt(this,'  + "'headerValueTxtName[]'" + ');" ';
			headerButStr +=		' onmouseover="setHighlight(this);" onmouseout="recoverHighlight(this);" onblur="removeTxtFocusStyle(this);" />'; 
			headerButStr +=		'</td>';
			headerButStr +=		'<td valign="center">';
			headerButStr +=			'<button id="headerMinusBut" name="headerMinusBut" class="ui-icon ui-icon-circle-minus" onclick="removeHeader(this)" ></button>';
			headerButStr +=		'</td>';
			headerButStr +=	'</tr>';
			
		$("#customFieldsHeaders").append(headerButStr);
		
		setIconButtonCss("headerMinusBut");
		setIconButtonCss("headerAcceptBut");
		setHeaderAutoComplete();
	}	
	
	function setIconButtonCss(txtName){
		$(":button").each(function (index){
			if($(this).attr("name") == txtName){	
				$(this).css('cursor', 'pointer');
				$(this).css('border', 'none');
			}
		})	
	}
	
	function setHeaderAutoComplete(){
		
		$(":text").each(function (index){
			if($(this).attr("name") == "headerKeyTxtName[]"){	
				$(this).autocomplete({
					source: availableHeaderTags
				});
			}
			
			if($(this).attr("name") == "headerValueTxtName[]"){	
				$(this).autocomplete({
					source: availableHeaderValueTags
				});
			}
		})	
	}
	
	/** Add a new row when click the last text. */
	function checkHeaderRowTxt(thisTxt, attrName){
		var lastIdx = 0;
		var lastObj;
		//Get the last param text index 
		$(":text").each(function (index){
			//if($(this).attr("name") == "paramKeyTxtName[]"){
			if($(this).attr("name") == attrName){	
				lastIdx = index;
				lastObj = $(this);	
			}
		})
		
		//If the last index object is the same object comparing with the target focus object. Create a new row.
		$(":text").each(function (index){
			if($(this).attr("name") == attrName){	
				console.log( index + ": " + $( this ).val() +" - "+ $(this).attr("name") + " - " + $(this).prop("name") );	
				if(lastIdx == index){
					if($(thisTxt).is($(this))){
						addHeaderRow("","");	
					}
				}	
			}
		})
		
		//Update the last index
		$(":text").each(function (index){
			if($(this).attr("name") == attrName){	
				lastIdx = index;		
			}
		})
		
		//Focus on the last one key text
		$(":text").each(function (index){
			if($(this).attr("name") == attrName){	
				if(lastIdx == index){
					if($(this).is($(thisTxt))){
						console.log("lastIdx="+lastIdx+" index="+index);
						$(this).addClass("txtFocusClass");
						$(this).focus();
						
					}else{
						$(thisTxt).addClass("txtFocusClass");
						$(thisTxt).focus();
					}
					
				}	
			}
		})
	}
	
	/** Select the text of the url string. */
	function selectUrl(){
		//$("#oDataURL").select();
		
		$("#oDataURL").addClass("txtFocusClass");
	}
	
	/** Update the parameter fields by the url text. */
	function updateParamsByUrl(){
		
		var emptyCnt=resetAllTxtFields("paramKeyTxtName[]");
		var fullUrl = $('#OData').find('[name="oDataURL"]').val();
		
		if(fullUrl!=null)	fullUrl = fullUrl.trim();
		
		var urlArr = fullUrl.split("?");
		var paramArr = "";
		//var paramStr = urlArr[1]; 
		if( urlArr[1]!=null ){
			paramArr = urlArr[1].split("&");	
		}
		
		var keyvalArr;
		
		if(paramArr!=null && paramArr.length>0){
			var paramId, paramVal;
			for(var idx=0; idx< paramArr.length; idx++){
				keyvalArr = paramArr[idx].split("=");
				paramId = keyvalArr[0];
				paramVal = keyvalArr[1];
				if(paramId === undefined) 	paramId="";
				if(paramVal === undefined) 	paramVal="";
				if(paramId!=""){
					addParamRow(paramId,paramVal);	
				}
			}
			
			for(var empCnt=0; empCnt<emptyCnt ; empCnt++){
				addParamRow("","");
			}			
		}else{//Add a empty row if no parameter field
			addParamRow("","");
		}
		
		$("#oDataURL").removeClass("txtFocusClass");
		$("#oDataURL").addClass("defaultTxtClass");
	}	
	
	function resetAllTxtFields(txtName){
		var emptyCnt=0;
		$(":text").each(function (index){
			//if($(this).attr("name") == "paramKeyTxtName[]"){
			if($(this).attr("name") == txtName){
				if($(this).val()==""){
					emptyCnt++;
				}	
				$(this).parent().parent().remove();
			}
		})	
		return emptyCnt;
	}
	
	/** Update the url by the parameter fields */
	function updateUrl(uiObj){
		
		if(uiObj!= null){
			//console.log("updateUrl uiObj removeClass");
			$(uiObj).removeClass("txtFocusClass");
			$(uiObj).addClass("defaultTxtClass");
		}
		
		
		var originalFullUrl = $("#oDataURL").val();
		
		if(originalFullUrl!=null)	originalFullUrl = originalFullUrl.trim();
		
		var originalUrlArr = originalFullUrl.split("?");
		var originalUrl = originalUrlArr[0];
		var tmpParamId = $('#OData').find('[name="paramKeyTxtName[]"]');
		var tmpParamVal = $('#OData').find('[name="paramValueTxtName[]"]');
		
		var tmpParamIdObj,tmpParamValueObj;
		var paramArr = "";
		var paramIdStr = "";
		var paramValueStr = "";
		
		//couldn't use the single quote here, $.parseJSON() couldn't parse it.
		for(var idx=0; idx< tmpParamVal.length; idx++){
			paramIdStr = tmpParamId.eq(idx).val();
			paramValueStr = tmpParamVal.eq(idx).val();
			
			if( !(paramIdStr === undefined) && paramIdStr!=null && paramIdStr.length>0){
				paramArr += ( paramIdStr + '=');
				if( !(paramValueStr === undefined) && paramValueStr!=null && paramValueStr.length>0){
					paramArr += ( paramValueStr );	
				}	

				if(idx < (tmpParamVal.length-1) ){
					paramArr += "&";
				}
			}
		}
		
		//delete the last quote when the last one is empty.
		if(paramArr.charAt(paramArr.length -1) === "&"){
			paramArr = paramArr.substr(0,paramArr.length -1);
		}
		
		if(originalUrl!=null && originalUrl.length>0){
			$('#oDataURL').val( originalUrl+"?"+paramArr );	
		}
		
	}
	
	//Create the parameter row
	function addParamRow(paramKey, paramValue){
		if(paramKey === undefined)		paramKey="";
		if(paramValue === undefined)		paramValue="";
		
		var paramButStr = '<tr valign="top">';
		paramButStr +=		'<td valign="center">';
		paramButStr +=			'<button id="paramAcceptBut" name="paramAcceptBut" class="ui-icon ui-icon-circle-check"></button>';
		paramButStr +=		'</td>';
		paramButStr +=		'<td width="50%">';
		paramButStr +=			'<input type="text" class="defaultTxtClass" name="paramKeyTxtName[]" value="'+ paramKey +'" placeholder="Param Key" ';
		paramButStr +=					'onclick="checkParamRowTxt(this,'  + "'paramKeyTxtName[]'" + ');" ';
		paramButStr +=					' onmouseover="setHighlight(this);" onmouseout="recoverHighlight(this);" onblur="updateUrl(this);" />'; 
		paramButStr +=		'</td>';
		paramButStr +=		'<td width="50%">';
		paramButStr +=			'<input type="text" class="defaultTxtClass" name="paramValueTxtName[]" value="'+ paramValue + '" '+'placeholder="Param Value" ';
		paramButStr +=			'onclick="checkParamRowTxt(this,'  + "'paramValueTxtName[]'" + ');" onblur="updateUrl(this);" ';
		paramButStr +=			' onmouseover="setHighlight(this);" onmouseout="recoverHighlight(this);"  />'; 
		paramButStr +=		'</td>';
		paramButStr +=		'<td valign="center">';
		paramButStr +=			'<button id="paramMinusBut" name="paramMinusBut" class="ui-icon ui-icon-circle-minus" onclick="removeParam(this)" ></button>';
		paramButStr +=		'</td>';
		paramButStr += '</tr>';
		$("#customFieldsParams").append(paramButStr);
		
		//$("#paramAcceptBut").addClass("paramAcceptButClass");
		//$("#paramMinusBut").addClass("paramMinusButClass");
		
		setIconButtonCss("paramMinusBut");
		setIconButtonCss("paramAcceptBut");
		
		//var input = $( ":button" ).addClass( "paramAcceptButClass" );
	}
	
	/** 
	* Add a new row when click the last text. 
	* Because the focus event will cause the recursive call, using the onclick event and set the focus action here.
	*/
	function checkParamRowTxt(thisTxt, attrName){
		var lastIdx = 0;
		var lastObj;
		//Get the last param text index 
		$(":text").each(function (index){
			//if($(this).attr("name") == "paramKeyTxtName[]"){
			if($(this).attr("name") == attrName){	
				lastIdx = index;	
				lastObj = $(this);	
			}
		})
		
		//If the last index object is the same object comparing with the target focus object. Create a new row.
		$(":text").each(function (index){
			if($(this).attr("name") == attrName){	
				//console.log( index + ": " + $( this ).val() +" - "+ $(this).attr("name") + " - " + $(this).prop("name") );	
				if(lastIdx == index){
					if($(thisTxt).is($(this))){
						addParamRow("","");	
					}
				}	
			}
		})
		
		//Update the last index
		$(":text").each(function (index){
			if($(this).attr("name") == attrName){	
				lastIdx = index;		
			}
		})
		
		//Focus on the last one key text
		$(":text").each(function (index){
			if($(this).attr("name") == attrName){	
				if(lastIdx == index){
					if($(this).is($(thisTxt))){
						//setHighlight($(this));
						$(this).addClass("txtFocusClass");
						$(this).focus();
					}else{
						//setHighlight($(thisTxt));
						$(thisTxt).addClass("txtFocusClass");
						$(thisTxt).focus();
					}	
				}	
			}
		})
	}
	
	function getParamKeyTxtValue(index){
		$(function() {
			$("#paramKeyTxtName").each(function( index ) {
				//console.log( index + ": " + $( this ).text() );
				return index + ": " + $( this ).text();
			});
		});	
	}
	
	function proxyContentSubmit(){
		var proxyUrl = $('#OData').find('[name="proxyURL"]').val();
        console.log("proxyUrl="+proxyUrl);
		
		var fullUrl = $('#OData').find('[name="oDataURL"]').val();
        var urlArr = fullUrl.split("?");
		
        var url =  urlArr[0];
        var type = $('#OData').find('[name="proxyMethod"]').val();
        var data ;
        var headers ;
		
		contForm.action = proxyUrl;
		contForm.url.value = url;
		contForm.type.value = type;
		
		//@TODO alex - print data on text area
		
		//Remove data[]
		removeFormArr("data[]");
		
		var dataStrArr = getDataArray();
		if(dataStrArr!=null && dataStrArr.length>0){
			for(var idx=0; idx<dataStrArr.length; idx++){
				$('<input type="text" id="data[]" name="data[]" value="'+ dataStrArr[idx] +'">').appendTo( $('#formDiv') );
			}
		}
		
		//Remove headers[]
		removeFormArr("headers[]");
		
		var headersArray = getHeadersArray();
		if(headersArray!=null && headersArray.length>0){
			for(var idx=0; idx<headersArray.length; idx++){
				$('<input type="text" id="headers[]" name="headers[]" value="'+ headersArray[idx] +'">').appendTo( $('#formDiv') );
			}
		}
		
		contForm.submit();
	}

	function removeFormArr(elementId){
		//document.getElementById("data[]").remove();
		var element;
		//while( document.getElementById("data[]")!=null ){
			while( document.getElementById(elementId)!=null ){
			element = document.getElementById(elementId);
			element.remove();
		}
	}
	
	function getDataArray(){
		var dataStrArr = [];
		
		var fullUrl = $('#OData').find('[name="oDataURL"]').val();
        var urlArr = fullUrl.split("?");
		
		var paramStr = urlArr[1];
		console.log('paramStr='+paramStr);
		var paramArr ;	
		if(urlArr[1]!=null){
			paramArr = urlArr[1].split("&");
		}
		
        var keyvalArr;
		if(paramArr!=null && paramArr.length>0){
			for(var idx=0; idx< paramArr.length; idx++){
				
				keyvalArr = paramArr[idx].split("=");
				
				if(keyvalArr[0]=== undefined)	keyvalArr[0]="";
				if(keyvalArr[1]=== undefined)	keyvalArr[1]="";
				
				if(keyvalArr[0]!=null && keyvalArr[0].length>0){
					keyvalArr[0] = replaceAll(keyvalArr[0]," ","+");
				}
				
				if(keyvalArr[1]!=null && keyvalArr[1].length>0){
					keyvalArr[1] = replaceAll(keyvalArr[1]," ","+");	
				}	
				
				//Skip the key is not undfined
				if( !(keyvalArr[0]=== undefined) && keyvalArr[0].trim().length>0 ) {
					//dataArr[idx] = keyvalArr[0]  + ":" + keyvalArr[1];
					//contentPageWin.document.write('<input type="hidden" name="data[]" value="'+ keyvalArr[0]  + ":" + keyvalArr[1] +'" />\n');
					dataStrArr[idx] = keyvalArr[0]  + ":" + keyvalArr[1];
				}	
			}//end for
				
            
        }
		
		return dataStrArr;
	}
	
	function getHeadersArray(){
		var headersArray = [];
		var tmpHeaderId = $('#OData').find('[name="headerKeyTxtName[]"]');
		var tmpHeaderVal = $('#OData').find('[name="headerValueTxtName[]"]');
        var tmpRowStr = "";
        
		//couldn't use the single quote here, $.parseJSON() couldn't parse it.
		for(var idx=0; idx< tmpHeaderVal.length; idx++){
			headerIdStr = tmpHeaderId.eq(idx).val();
			
			if(headerIdStr != 'undefined' && headerIdStr!=null && headerIdStr.trim().length>0){
                tmpRowStr = "";
                tmpRowStr += ( tmpHeaderId.eq(idx).val() );
                tmpRowStr += (':'+ tmpHeaderVal.eq(idx).val() );
                //To keep the same getting parameters way, using [] as the tail of the name
				headersArray[idx] = tmpRowStr;
			}
		}
		
		return headersArray;
	}
	
    var contentPageWin;
    
	function proxyTest(){
        //https://nsoewebservices.cbsnorthstar.com/ReportService/ConfigurationData.svc/Employees()?$filter=Disabled eq false&$orderby=FullName&$expand=EmployeeJobRates/Job
        $('#OData').find('[name="oDataURL"]').val("https://nsoewebservices.cbsnorthstar.com/ReportService/ConfigurationData.svc/Employees()?$filter=Disabled+eq+false&$orderby=FullName&$expand=EmployeeJobRates/Job");
		loadTestHeader();
		parseDataUrl();
	}
	
	function proxyReset(){
		console.log("proxyReset");
		$("#oDataURL").val("");
		resetAllTxtFields("paramKeyTxtName[]");
		addParamRow("","");
		resetAllTxtFields("headerKeyTxtName[]");
		addHeaderRow("","");
		
	}
	function jq( myid ) {
		return "#" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
	}
	
	function replaceAll(str, find, replace) {
      return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function escapeRegExp(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function htmlEncode(str){  

        var s="";  
        if(str.length==0) return "";  

        s=str.replace(/&/g,"&gt;");  
        s = s.replace(/</g,"&lt;");  
        s = s.replace(/>/g,"&gt;");  
        s = s.replace(/ /g,"&nbsp;");
        s = s.replace(/\'/g,"'");
        s = s.replace(/\"/g,"&quot;"); 
        s = s.replace(/\r/g,"");
        s = s.replace(/\n/g,"<br>");  

        s = replaceAll(s,"\\r\\n","<br>");
        return    s;  
    }  

    function htmlDecode(str){  
         var s = "";  

         if(str.length == 0) return "";  
         s = str.replace(/&gt;/g, "&");  
         s = s.replace(/&lt;/g, "<");  
         s = s.replace(/&gt;/g, ">");  
         s = s.replace(/&nbsp;/g, "    ");  
         s = s.replace(/'/g, "\'");  
         s = s.replace(/&quot;/g, "\"");  
         s = s.replace(/<br>/g, "\n");  
         return s;  
    }   

    function tidyHtml(htmlStr){
        options = {
                  "indent":"auto",
                  "indent-spaces":2,
                  "wrap":80,
                  "markup":true,
                  "output-xml":false,
                  "numeric-entities":true,
                  "quote-marks":true,
                  "quote-nbsp":false,
                  "show-body-only":true,
                  "quote-ampersand":false,
                  "break-before-br":true,
                  "uppercase-tags":false,
                  "uppercase-attributes":false,
                  "drop-font-tags":true,
                  "tidy-mark":false
                }
        var result = tidy_html5(htmlStr, options);
        console.log(result);
    }
