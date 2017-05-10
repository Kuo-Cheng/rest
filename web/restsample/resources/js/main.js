// JavaScript Document
var _d = {
	host : '',
	jsessionid : '',
	api : [
		{
			name : 'Login',
			type : 'post',
			resource : 'login',
			url : '[host]/restapi/init/user/pw/site',
			directpost : true,
			input : {
				ary : {
					name : ['user', 'pw', 'site'],
					_default : ['manager', '', 'my site'],
					empty : []
				}
			},
			callback : function(json,i){
				if(json.ok){
					_d.jsessionid = json.data.jsessionid;
					$jsessionid_area.html('jsession id = ' + _d.jsessionid);
				}
			}
		},
		{
			name : 'Check session',
			type : 'get',
			resource: 'login',
			url : '[host]/restapi/session[jsessionid]'
		},
		{
			name : 'Get Group List',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/groups[jsessionid]',
			callback : function(json,i){
				api.update_select(json,i,"Group list");
			}
		},
		{
			name : 'Get Players in Group',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/groups/[groupid][jsessionid]',
			input : {
				data : {
					name : ['groupid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				api.update_select(json,i,"Group list");
			}
		},
		{
			name : 'Restart group',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/restart/group/[groupid][jsessionid]',
			input : {
				data : {
					name : ['groupid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				//api.update_select(json,i,"Group list");
			}
		},
		{
			name : 'Power off group',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/poweroff/group/[groupid][jsessionid]',
			input : {
				data : {
					name : ['groupid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				//api.update_select(json,i,"Group list");
			}
		},
		{
			name : 'Wake on LAN group',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/wol/group/[groupid][jsessionid]',
			input : {
				data : {
					name : ['groupid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				//api.update_select(json,i,"Group list");
			}
		},
		{
			name : 'Restart player',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/restart/player/[playerid][jsessionid]',
			input : {
				data : {
					name : ['playerid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				//api.update_select(json,i,"Player list");
			}
		},
		{
			name : 'Power off player',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/poweroff/player/[playerid][jsessionid]',
			input : {
				data : {
					name : ['playerid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				//api.update_select(json,i,"Player list");
			}
		},
		{
			name : 'Wake on LAN player',
			type : 'get',
			resource: 'group',
			url : '[host]/restapi/wol/player/[playerid][jsessionid]',
			input : {
				data : {
					name : ['playerid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				//api.update_select(json,i,"Player list");
			}
		},
		{
			name : 'Get Playlist Root',
			type : 'get',
			resource: 'playlist',
			url : '[host]/restapi/playlists[jsessionid]',
			callback : function(json,i){
				api.update_select(json,i,"Combo playlist");
			}
		},
		{
			name : 'Get Playlist Detial',
			type : 'get',
			resource: 'playlist',
			url : '[host]/restapi/playlists/[playlistid][jsessionid]',
			input : {
				data : {
					name : ['playlistid'],
					_default : [''],
					empty : [1]
				}
			},
			callback : function(json,i){
				api.update_select(json,i,"Combo playlist");
			}
		},
		{
			name : 'Get all of Playlist ',
			type : 'get',
			resource: 'playlist',
			url : '[host]/restapi/playlists/all[jsessionid]',
			callback : function(json,i){
				api.update_select(json,i,"Combo playlist");
			}
		},
		{
			name : 'Publish Default Playlist',
			type : 'post',
			resource: 'playlist',
			url : '[host]/restapi/playlists/[comboplaylistid][jsessionid]',
			input : {
				data : {
					name : ['comboplaylistid'],
					_default : [''],
					empty : [1]
				},
				ary : {
					name : ['groupIds'],
					_default : [''],
					empty : [1]
				}
			}
		},
		{
			name : 'Get Scene Playlist IDs (For player SDK)',
			type : 'get',
			resource: 'playlist',
			url : '[host]/restapi/playlists/sceneidlist[jsessionid]',
			callback : function(json,i){
				api.update_select(json,i,"scene playlist");
			}
		},
		{
			name : 'Get Preload Media',
			type : 'get',
			resource: 'media',
			url : '[host]/restapi/medias/preload/[playerid][jsessionid]',
			input : {
				data : {
					name : ['playerid'],
					_default : [''],
					empty : ['']
				}
			}
		},
		{
			name : 'Get all Media Data',
			type : 'get',
			resource: 'media',
			url : '[host]/restapi/medias/all[jsessionid]'
		},
		{
			name : 'Get Urgent Cast list',
			type : 'get',
			resource: 'uc',
			url : '[host]/restapi/urgentcasts[jsessionid]',
			callback : function(json,i){
				api.update_select(json,i,"Urgent Cast list");
			}
		},
		{
			name : 'Publish Urgent Cast',
			type : 'post',
			resource: 'uc',
			url : '[host]/restapi/urgentcasts/[ucid][jsessionid]',
			input : {
				data : {
					name : ['ucid'],
					_default : [''],
					empty : [1]
				}
			}
		},
		{
			name : 'Sync User Data',
			type : 'post',
			resource: 'syncdata',
			url : '[host]/restapi/syncdata[jsessionid]',
			directpost : true,
			input : {
				ary : {
					name : ['playerid','playername'],
					_default : [],
					empty : ['',''],
				   }
			}
		},
		{
			name : 'Query Player Status Log',
			type : 'get',
			resource: 'playerstatuslog',
			url : '[host]/restapi/players/statuslog[jsessionid]',
			directpost : true,
			input : {
				ary : {
					name : ['starttime','endtime','workstarttime','workendtime'],
					_default : ['','','08:00:00','18:00:00'],
					empty : ['','','08:00:00','18:00:00']
				   }
			}
		}
		
	]
}
var ajax_counter = 0;
var $response_area, $api, $jsessionid_area;
var isSet = function(n){return !(typeof(n) == 'undefined')}
var isObj = function(n){return (typeof(n) == 'object')}
var isNum = function(n){return (typeof(n) == 'number' && !isNaN(n))}
var isStr =  function(n){return (typeof(n) == 'string')}
var isFn = function(n){return (typeof(n) == 'function')}
var trim = function(t){if(isStr(t))t = t.replace(/(^\s*|\s*$)/g,"");return t;}

var url_set = function(url, obj){
	obj = obj || {};
	obj.jsessionid = (_d.jsessionid)?_d.jsessionid : '';
	var k, v, reg, v0, v1,
	resault = [url, url];
	for(k in obj){
		v = trim(obj[k]);
		v0 = v;
		if(v == ''){
			v1 = '<span class="error">'+k+'</span>';
		}else{
			v1 = v;
		}
		if(k == 'jsessionid'){
			v1 = ';jsessionid=' + v1;
			v0 = ';jsessionid=' + v0;
		}
		reg = new RegExp("\\["+k+"\\]");
		resault[0] = resault[0].replace(reg, v0);
		resault[1] = resault[1].replace(reg, v1);
	}
	return resault;
}
var format_resault = function(t, clean){
	if(clean === true)$response_area.html('');
	if(isStr(t) || isNum(t)){
		$response_area.append(t + "\n\n");
	}else if(isObj(t)){
		$response_area.append(JSON.stringify(t,null,2) + "\n\n");
	}
}
var consoleObj = function(obj){
	if(!isObj(obj))return;
	for(k in obj){
		if(!isFn(obj[k]))console.log(k+" = "+ obj[k]);
	}
}
var api = {
	init : function(){
		$.each(_d.api, function(i, v){
			var area = '[data-name="'+v.resource+'"]';
			$apiarea = $api.find(area);
					
			var _value,
			_html = ['<div class="api" data-index="'+i+'">'];
			_html.push('<div class="api_name">'+(i+1)+'. ' +v.name+'</div>');

			_html.push('<div class="api_url"></div>');
			_html.push('<div class="api_btn">');
	
			if(api.check_input(v, 'data')){
				$.each(v.input.data.name, function(i2, data_name){
					if(v.input.data._default && isSet(v.input.data._default[i2])){
						_value = v.input.data._default[i2];
					}else{
						_value = '';
					}
					_html.push('<input type="text" data-type="data" name="'+data_name+'" placeholder="'+data_name+'" value="'+_value+'" />');
				});
			}
			if(api.check_input(v, 'ary')){
				$.each(v.input.ary.name, function(i2, ary_name){
					if(v.input.ary._default && isSet(v.input.ary._default[i2])){
						_value = v.input.ary._default[i2];
					}else{
						_value = '';
					}
					_html.push('<input type="text" data-type="ary" name="'+ary_name+'" placeholder="'+ary_name+'" value="'+_value+'" />');
				});
			}
	
			
			if (v.type == 'get'){
				_html.push('<input type="button" name="api_submit" value="GET" /></div>');
			}else if (v.type == 'post'){
				_html.push('<input type="button" name="api_submit" value="POST" /></div>');
			}
			_html.push('</div>');
			$apiarea.append(_html.join("\n"));
			
			v.url = v.url.replace(/\[host\]/, _d.host);
			api.create_url(i);
		});		
		$api.on('click', '[name="api_submit"]', api.submit);
		$api.on('keyup', 'input[data-type="data"]', api.keyup);
		$jsessionid_area = $('<div id="jsessionid_area"></div>');
		$api.find('.api').eq(0).append($jsessionid_area);
		$jsessionid_area.html(url_set('[jsessionid]')[1]);
		
		
	},
	get_target : function(i){
		return $api.find('.api[data-index="'+i+'"]');
	},
	check_input : function(v, type){
		return (v.input && v.input[type] && v.input[type].name && v.input[type].name.length > 0);
	},
	create_url : function(i){
		var 
		$target = api.get_target(i),
		_api = _d.api[i],
		url = _api.url,
		obj = {};
		if(api.check_input(_api, 'data')){
			var _data = _api.input.data;
			$.each(_data.name, function(i, v){
				var _val,
				val = trim($target.find('input[data-type="data"][name="'+v+'"]').val());
				if(val == '' && isObj(_data.empty) && isSet(_data.empty[i])){
					val = _data.empty[i];
				}
				obj[v] = val;
			});
		}
		resault = url_set(url, obj);
		$target.find('.api_url').html('<a href="'+resault[0]+'" target="_blank">'+resault[1]+'</a>');
		return resault[0];
	},
	get_input_ary : function(index){
		var $target = api.get_target(index),
		_api = _d.api[index],
		resault = {};
		if(api.check_input(_api, 'ary')){
			var _data = _api.input.ary;
			$.each(_data.name, function(i, v){
				var val = $target.find('input[data-type="ary"][name="'+v+'"]').val();
				if(val.replace(/ /g,'') == ''){
					val = v;
					if(_data.empty && isSet(_data.empty[i])) val = _data.empty[i]+'';
				}
				//if (index=="12" || index=="13"){//sync data
				if(_api.directpost){				
					if(val != ''){
						resault[v] =val;
					}
				}else{ 
					if(val != ''){
						resault[v] =val.split(",");
					}else{
						resault[v] =[];
					}
				}				
			});
		}
		return resault;
	},
	submit : function(){
		var $target = $(this).parents('.api'),
		i = $target.attr('data-index'),
		_api = _d.api[i],
		url = api.create_url(i);
		if(_api.type == 'get'){
			var data = api.get_input_ary(i);
			$.get(url, data,function(json){
				format_resault(json);
				if(isFn(_api.callback))_api.callback(json,i);
			  }).fail(function(a) {
					format_resault('ajax error');
					format_resault(a);
				  });
		}else if(_api.type == 'post'){
			var data = api.get_input_ary(i);
			$.post(url, data, function(json){
				format_resault(json);
				if(isFn(_api.callback))_api.callback(json,i);
			  }).fail(function(a) {
					format_resault('ajax error');
					format_resault(a);
				  });
		}
	},
	keyup : function(){
		api.create_url($(this).parents('.api').attr('data-index'));
	},
	update_select : function(json,i, name){
		var html = [];
		var _resource = _d.api[i].resource;
		//Data
		var sel_name = 'name="'+_resource+'"';
		html.push('<select '+ sel_name +' style = "margin-left:15px;background-color:#ffffd9">');
		html.push('<option value="">'+name +' </option>');
		
		if (_resource =="uc" && json.data.ucs){
			$.each(json.data.ucs, function(i, v){
				var value = v.urgentid;
				show = "("+v.urgentid+") " + v.name;
				html.push('<option value="'+value+'">'+show+'</option>');
			});
		}	
		else if (_resource =="playlist" && json.data.datas){
			$.each(json.data.datas, function(i, v){
				var value = v.id;
				var type ;
				if (v.isfolder == true)
					type = "[ Folder ]";
				else 
					type = "[playlist]";

				show = type+" ("+v.id+") " + v.name;
				html.push('<option value="'+value+'">'+show+'</option>');
			});
		}else if (_resource =="group" && json.data.items){
			$.each(json.data.items, function(i, v){
				var value = v.id;
				var type ;
				if (v.type == 1001)
					type = "[Folder]";
				else if (v.type == 1000)
					type = "[Group ]";
				else if(v.type == 1)
					type = "[Player]";
				show = type+ " ("+v.id+") " + v.name;
				html.push('<option value="'+value+'">'+show+'</option>');
			});
		}
		html.push('</select>');
	
		// check if select exist	
		var select = $api.find('.api[data-index="'+i+'"]').find('['+sel_name+']');	
		if (select.length > 0){
			select.html(html.join(""));
		}else{
			var $select = $(html.join(""));
			select = $api.find('.api[data-index="'+i+'"]').find('[name="api_submit"]');
			select.each(function(){
				$(this).after($select.clone());
			});
		}
		
	}
}
var _publish = {
	url : '/restapi/playlists/[playlistid][jsessionid]',
	init : function(){
		_publish.$ = {};
		_publish.$.wrapper = $('#publish_sample');
		_publish.$.get_playlist = _publish.$.wrapper.find('[data-name="get_playlist"]');
		_publish.$.get_group = _publish.$.wrapper.find('[data-name="get_group"]');
		_publish.$.api_url = _publish.$.wrapper.find('.api_url');
		_publish.$.select_playlist = _publish.$.wrapper.find('[data-name="select_playlist"]');
		_publish.$.select_group = _publish.$.wrapper.find('[data-name="select_group"]');
		_publish.$.publish = _publish.$.wrapper.find('[data-name="publish"]');
		
		_publish.$.get_playlist.click(_publish.get_playlist);
		_publish.$.get_group.click(_publish.get_group);
		_publish.$.select_playlist.change(_publish.check);
		_publish.$.select_group.change(_publish.check);
		_publish.$.publish.click(_publish.publish);
		
		_publish.check();
	},
	get_playlist : function(){
		var url = '/restapi/playlists/all[jsessionid]';
		url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
		$.get(url, function(json){
			format_resault(json);
			if(json.ok === true){
				var playlists = json.data.datas,
				tmp = ['<option value="0">Select a playlist</option>'];
				$.each(playlists, function(i, v){
					tmp.push('<option value="'+v.id+'">('+v.id+') '+v.fullpath+'</option>');
				});
				_publish.$.select_playlist.html(tmp.join(''));
			}
			_publish.check();
		});
		
	},
	get_group : function(){
		var url = '/restapi/groups/all[jsessionid]';
		url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
		$.get(url, function(json){
			format_resault(json);
			if(json.ok === true){
				var groups = json.data.items,
				tmp = ['<option value="0">Select a group</option>'];
				$.each(groups, function(i, v){
					tmp.push('<option value="'+v.id+'">('+v.id+') '+v.fullpath+'</option>');
				});
				_publish.$.select_group.html(tmp.join(''));
			}
			_publish.check();
		});
	},
	check : function(){
		var p = _publish.$.select_playlist.val(),
		g = _publish.$.select_group.val();
		if(_publish.$.select_playlist.html() == ''){
			p = 0;
			_publish.$.select_playlist.hide();
		}else{
			_publish.$.select_playlist.show();
		}
		if(_publish.$.select_group.html() == ''){
			g = 0;
			_publish.$.select_group.hide();
		}else{
			_publish.$.select_group.show();
		}
		if(p != '0' && g != '0'){
			_publish.$.publish.show();
		}else{
			_publish.$.publish.hide();
		}
		_publish.create_url();
	},
	create_url : function(){
		var url = url_set(_publish.url, {playlistid:_publish.$.select_playlist.val()});
		_publish.$.api_url.html('<a href="'+url[0]+'" target="_blank">'+url[1]+'</a>');
		return url[0];
	},
	publish : function(){
		var url = _publish.create_url(),
		data = {groupIds:[_publish.$.select_group.val()]};
		$.post(url, data, function(json){
			format_resault(json);
		});
	}
};
var _player = {
	url : '/restapi/players/[playerid][jsessionid]',
	get_list_url : '/restapi/medias/preload/[playerid][jsessionid]',
	playlist_ary : [],
	playlist_tmp : $('<div class="item"><div class="zone" contenteditable></div><div class="path" contenteditable></div><div class="duration" contenteditable></div><div class="delete">X</div></div>'),
	init : function(){
		_player.$ = {};
		_player.$.wrapper = $('#player_sample');
		_player.$.get_grouplist = _player.$.wrapper.find('[data-name="get_grouplist"]');
		_player.$.api_url = _player.$.wrapper.find('.api_url');
		_player.$.attrs = _player.$.wrapper.find('.attr');
		_player.$.lis = _player.$.wrapper.find('ul li');
		_player.$.base = _player.$.wrapper.find('.base');
		_player.$.snapshot = $('#snapshot');
		_player.$.thumbnail = $('#thumbnail');
		_player.$.get_playstatus = _player.$.wrapper.find('[data-name="get_playing_status"]');
		
		_player.$.groupid = null;
		_player.$.playerid = _player.$.wrapper.find('[name="playerid"]');
		_player.$.timeout = _player.$.base.find('[name="timeout"]');
		_player.$.getsnapshot = _player.$.snapshot.find('[name="get_snapshot"]');
		_player.$.getThumbnail = _player.$.thumbnail.find('[name="get_thumbnail"]');
		
		_player.$.snapshotdiv =  $('#player_sanpshot');
	
		_player.$.single = _player.$.wrapper.find('[data-val="single"]');
		_player.$.multiple = _player.$.wrapper.find('[data-val="multiple"]');
		_player.$.insert = _player.$.wrapper.find('[data-val="insert"]');
		_player.$.radios = _player.$.wrapper.find('[name="item"]');		
		_player.$.select = _player.$.wrapper.find('[name="playlsy_select"]');
		
		_player.$.playlist = _player.$.multiple.find('.playlist');
		
		_player.$.attrs.hide();		
		_player.$.lis.click(function(){
			var i = _player.$.lis.index(this);
			_player.$.attrs.hide().eq(i).show();
			_player.$.lis.removeClass('current').eq(i).addClass('current');
			if (i == 2){
				if (_player.$.radios[0].checked == false && _player.$.radios[1].checked == false){
					_player.handleRadioChange(1);
					document.getElementById('item1').checked = true;
				}
			}	
		}).eq(0).click();		
		_player.$.wrapper.find('[type="text"]').focusin(function(){
			$(this).removeClass('error');
		});
		_player.$.playerid.keyup(_player.create_url);
		_player.create_url();
		
		_player.$.wrapper.find('[type="button"]').click(_player.button_action);
		_player.$.playlist.on('click', '.delete', _player.delete_playlist);
		_player.$.get_grouplist.click(_player.get_group);
		_player.$.insert.find('[type="button"]').click(_player.player_insert);
	
		_player.$.radios.click(_player.handleRadioChange);
		_player.$.select.change(_player.modifytext);
		_player.$.getsnapshot.click(_player.getSnapshot);
		_player.$.get_playstatus.click(_player.getPlayerStatus);
		_player.$.getThumbnail.click(_player.getThumbnail);
		/*
		_player.$.set.find('[name="get_list"]').click(_player.get_list);
		_player.$.set.find('[name="add"]').click(_player.add_playlist);
		
		_player.$.set.find('[name="set"]').click(_player.set_player);
		
		
		
		*/
	},
	getPlayerStatus:function(){
		
		var playerid = trim(_player.$.playerid.val());
		var isGetExData = _player.$.wrapper.find('[data-name="status_ex"]').prop("checked"); ;
		var url;
		
		if (isGetExData === true)
			url = '/restapi/players/statusex/'+playerid +'[jsessionid]';
		else
			url = '/restapi/players/status/'+playerid +'[jsessionid]';
		
		url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
	
		$.ajax({
            method: "GET",
            url:url,
			contentType: 'application/json',
		    success: function(msg){ 
		    	format_resault(msg);
	        },
	        error:function(xhr, ajaxOptions, thrownError){
	        	format_resault(xhr);          
	        }
		})	
	},
	getSnapshot:function(){
		
		var playerid = trim(_player.$.playerid.val());
		var width = _player.$.snapshot.find('[name="snap_width"]').val();
		var height = _player.$.snapshot.find('[name="snap_height"]').val();
		var isRefresh = _player.$.snapshot.find('[name="cbox"]').prop("checked"); 
		var success = true;
		if(width == ''){
			 _player.$.snapshot.find('[name="snap_width"]').addClass('error');
			success = false;	 
		}
		if(height == ''){
			 _player.$.snapshot.find('[name="snap_height"]').addClass('error');
			success = false;
		}
		if (false == success)
			return false;
		
		console.log('[main] getSnapshot ' + playerid);
		data = {
				width:width,
				height:height,
				refresh:isRefresh
				};
		var ret = new querySnapshot(playerid,data,_player.updateSnapshot);
        
        //Update URL
		var snap_url = '/restapi/players/snapshot/[playerid][jsessionid]';
		var url = url_set(snap_url, {playerid:_player.$.playerid.val()});
		_player.$.api_url.html('<a href="'+url[0]+'" target="_blank">'+url[1]+'</a>');
		
		_player.$.snapshotdiv.find("img").attr("src","");
		_player.$.snapshotdiv.find('[name="hint"]').val("");
		
		ret.getSnapShotPath();
		_player.$.wrapper.find('[name="media_id"]').val("");
	},
	updateSnapshot:function(path){	
		
		var imgStr="";
		if (path == "overtime"){
			_player.$.snapshotdiv.find('[name="hint"]').val('* Get snapshot timeout');
		}
		else if (path == "Expired"){
			_player.$.snapshotdiv.find('[name="hint"]').val('* Snapshot is expired, selecet refresh and get again');
		}
		else{
			var url = '/restapi/players/snapshotpath/'+path+'[jsessionid]';
			url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
			url += "?ran=" + Math.random();
		}	
		_player.$.snapshotdiv.find("img").attr("src",url);
	},
	initimage:function(){
		
		_player.$.snapshotdiv.find('[name="hint"]').val("");
	},
	updateMediaThumbnail:function(mediaid){		
		_player.initimage();
	//	var url = '/restapi/medias/thumbnailpath/'+"9999"+'[jsessionid]';
		var url = '/restapi/medias/thumbnailpath/'+mediaid+'[jsessionid]';
			url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
			url += "?random=" + Math.random();
			
		var ret = _player.$.snapshotdiv.find("img").attr("src",url).on('error',function(event){
			//	var result = "Can not find the media"+ k;
			var result = event;
			format_resault(event);
			_player.$.snapshotdiv.find("img").off('error');
		}).load(function(){
			_player.$.snapshotdiv.find("img").off('error');
		});
		 
		format_resault(ret[0].src,true);
	},
	getThumbnail:function(){
		var mediaid = _player.$.wrapper.find('[name="media_id"]').val();
		_player.updateMediaThumbnail(mediaid);
		
	},
	modifytext:function(){
		_player.$.wrapper.find('[name="id"]').val(_player.$.select.val());
	},
	handleRadioChange: function(update){
		if (update!=1 && update!=2)
			_player.$.wrapper.find('[name="id"]').val("");
		
		if (this.id =="item1" ||this.id =="item3"|| (update!=null && update == 1)){
			var url = "";
			var listName = "";
			var placeholder = "";
			if (this.id =="item1" ||(update!=null && update == 1)){
				url = '/restapi/playlists/sceneidlist[jsessionid]';
				listName = 'Scene List';
				placeholder = 'scene id';
			}else{
				url = '/restapi/playlists/all[jsessionid]';
				listName = 'Combo Playlist';
				placeholder = 'combo playlist id';
			}	
			url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
			$.get(url, function(json){
				format_resault(json);
				
				if(json.ok == true){
					var playlists = json.data.datas,
					tmp = ['<option value="0">'+ listName +'</option>'];
					if (playlists){
					$.each(playlists, function(i, v){
						tmp.push('<option value="'+v.id+'">('+v.id+') '+v.name+'</option>');});				
					}		
					_player.$.select.html(tmp.join(''));
				}
				_player.$.wrapper.find('[name="id"]').attr('placeholder',placeholder);
			});				
		}
		else if (this.id =="item2"){
			var url = '/restapi/urgentcasts[jsessionid]';
			url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
			$.get(url, function(json){
				format_resault(json);
				
				if(json.ok == true){
					var tmp = ['<option value="0">UrgentCast List </option>'];
					var playlists = json.data.ucs;
					if (playlists){
					$.each(playlists, function(i, v){
						tmp.push('<option value="'+v.urgentid+'">('+v.urgentid+') '+v.name+'</option>');
					});
					}
					_player.$.select.html(tmp.join(''));
				}
				_player.$.wrapper.find('[name="id"]').attr('placeholder','urgent cast id');
			});			
		}
	},
	button_action : function(){
		var action = this.name,
		target = $(this).closest('[data-val]').attr('data-val');
		if($.inArray(action, ['play', 'pause', 'stop', 'first', 'previous', 'next', 'last']) != -1){
			_player.control(action, target);
		}else if(action == 'set'){
			_player.set(target);
		}else if(action == 'add'){
			var data = _player.get_playlist(target);
			if(data){
				_player.playlist_ary.push(data);
				_player.set_playlist();
			}
		}else if(action == 'get_list'){
			_player.get_list();
		}
	},
	create_url : function(){
		var url = url_set(_player.url, {playerid:_player.$.playerid.val()});
		_player.$.api_url.html('<a href="'+url[0]+'" target="_blank">'+url[1]+'</a>');
		return url[0];
	},
	get_timeout : function(){
		var data = {},
		timeout = parseInt(_player.$.timeout.val()),
		playerid = trim(_player.$.playerid.val());
		if(isNum(timeout)){
			data.timeout = timeout;
			_player.$.timeout.val(timeout);
		}else{
			_player.$.timeout.val('');
		}
		if(playerid == ''){
			_player.$.playerid.addClass('error');
			return false;
		}else{
			return data;
		}
	},
	get_group : function(){
		var $this = $(this);
		var url = '/restapi/groups/all[jsessionid]';
		url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
		$.get(url, function(json){
			format_resault(json);
			
			if(json.ok === true){
				var html = ['<select name="select_groups">'];
				html.push('<option value="">Select a Group</option>');
				var groups = json.data.items;
				
				$.each(json.data.items, function(i, v){
					console.log(v);
				//	var value = v.mediaid.toString(16).toUpperCase(),
					show = "("+v.mediaid+") " + v.name;
					html.push('<option value="'+v.id+'">('+v.id+') '+v.fullpath+'</option>');
				});
				html.push('</select>');
				var $select = $(html.join(""));
				$this.after($select);
				$this.remove();
				$select.change(function(){
					_player.get_player(this.value);
				});
			}
		
		});
	},	
	get_player : function(group_id){
		var $this = $(this);
		var url = '/restapi/groups/'+group_id+'[jsessionid]';
		url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
		$.get(url, function(json){
			format_resault(json);
			
			if(json.ok === true){
				
				var players = json.data.items,
				tmp = ['<option value="0">Select a player</option>'];
				$.each(players, function(i, v){
					tmp.push('<option value="'+v.id+'">('+v.id+') '+v.name+'</option>');
				});
				_player.$.playerid.html(tmp.join(''));
				var $select = $(_player.$.playerid);
				$select.change(function(){			
					_player.get_list(true);		
				});
			}
		});
	},
	clear_error : function(){
		_player.$.wrapper.find('.error').removeClass('error');
	},
	control : function(act, target){
		var $target = _player.$[target],
		data = _player.get_timeout(),
		$controlzone = $target.find('[name="controlzone"]'),
		controlzone = trim($controlzone.val()),
		success = true;
		if(data === false)success = false;
		if(controlzone == ''){
			$controlzone.addClass('error');
			success = false;
		}
		if(success == false){
			return;
		}else{
			_player.clear_error();
		}
		data.type = 1;
		data.act = act;
		data.params = [{zonename : controlzone}];
		_player.query(data);
	},
	set : function(target){
		var params = [],
		$target = _player.$[target],
		data = _player.get_timeout(),
		success = true;
		if(data === false)success = false;
		if(target == 'multiple'){
			//update array
			_player.playlist_ary=[];
			
			var $playlist = _player.$.playlist;
			var $list = $playlist.find('.item');
			$.each($list, function(i, v){
				var item = $(v);
				var zonename = item.find('.zone').text();
				var path = item.find('.path').text();
				var paths = item.find('.path').text().split('|');
				var duration = item.find('.duration').text();
							
				var data = {}
				data.zonename = zonename;
				data.duration = parseInt(duration);
				data[paths[0].trim().toLowerCase()] = paths[1].trim();
				_player.playlist_ary.push(data);
			});
			
			params = _player.playlist_ary;
			if(params.length == 0){
				_player.$.playlist.addClass('error');
				success = false;
			}
		}else{
			var _params = _player.get_playlist(target);
			if(_params){
				params = [_params];
			}else{
				success = false;
			}
		}

		if(success == false){
			return;
		}else{
			_player.clear_error();
		}
		data.type = 1;
		data.act = 'set'
		data.params = params;
		_player.query(data);
	},
	get_playlist : function(target){
		var $target = _player.$[target],
		zonename = trim($target.find('[name="zonename"]').val()),
		path_type = $target.find('[name="path_type"]').val(),
		path = trim($target.find('[name="path"]').val()),
		duration = parseInt(trim($target.find('[name="duration"]').val())),
		success = true;
		if(zonename == ''){
			$target.find('[name="zonename"]').addClass('error');
			success = false;
		}
		if(path == ''){
			$target.find('[name="path"]').addClass('error');
			success = false;
		}
		if(!isNum(duration)){
			$target.find('[name="duration"]').addClass('error');
			success = false;
		}
		if(success){
			_player.clear_error();
		}else{
			return false;
		}
		$target.find('[name="controlzone"]').val(zonename);
		var data = {}
		data.zonename = zonename;
		data.duration = duration;
		data[path_type] = path;
		return data;
	},
	set_playlist : function(){
		var $playlist = _player.$.playlist;
		$playlist.empty();
		$.each(_player.playlist_ary, function(i, v){
			var path, $new = _player.playlist_tmp.clone();
			$new.find('.zone').html(v.zonename);
			if(isStr(v.id)){
				path = 'ID | ' + v.id;
			}else if(isStr(v.name)){
				path = 'Name | ' + v.name;
			}else if(isStr(v.url)){
				path = 'URL | ' + v.url;
			}
			$new.find('.path').html(path);
			$new.find('.duration').html(v.duration);
			$new.find('.delete').attr('index', i);
			$playlist.append($new);
		});
	},
	delete_playlist : function(){
		var i = $(this).attr('index');
		_player.playlist_ary.splice(i, 1);
		_player.set_playlist();
	},
	player_insert : function(){
		var action = this.value,
		data = _player.get_timeout(),
		type = parseInt(_player.$.insert.find('[name="item"]:checked').val()),
		id = trim(_player.$.insert.find('[name="id"]').val()),
		duration = parseInt(trim(_player.$.insert.find('[name="duration"]').val())),
		success = true;
		if(data === false)success = false;
		if(id == ''){
			_player.$.insert.find('[name="id"]').addClass('error');
			success = false;
		}
		if(!isNum(duration)){
			_player.$.insert.find('[name="duration"]').addClass('error');
			success = false;
		}
		if(success == false){
			return;
		}else{
			_player.clear_error();
		}
		data.type = type;
		data.act = action;
		data.params = [{ "id":id, "duration":duration}];
		_player.query(data);
	},
	
	get_list : function(update){
		var playerid = trim(_player.$.playerid.val());
		if(playerid == ''){
			_player.$.playerid.addClass('error');
			return;
		}
		var url = url_set(_player.get_list_url, {playerid:playerid})[0];
		var set_html = function(json){
			format_resault(json);
			if(json.ok != true)return;
			if(!(isObj(json.data) && isObj(json.data.infos)))return;
			var html = [];
			if (update == true){
				html.push('<option value="">Select a Media</option>');
				$.each(json.data.infos, function(i, v){
				//	var value = v.mediaid.toString(16).toUpperCase(),
					var value = v.mediaid,
					show = "("+v.mediaid+") " + v.name;
					html.push('<option value="'+value+'">'+show+'</option>');
				});
				var select_media = _player.$.wrapper.find('[name="select_media"]');
				select_media.html(html.join(''));
			}else{
				html.push('<select name="select_media">');
				html.push('<option value="">Select a Media</option>');
				$.each(json.data.infos, function(i, v){
					console.log(v);
				//	var value = v.mediaid.toString(16).toUpperCase(),
					var value = v.mediaid,
					show = "("+v.mediaid+") " + v.name;
					html.push('<option value="'+value+'">'+show+'</option>');
				});
				html.push('</select>');
				var $select = $(html.join("")),
				$btn = _player.$.wrapper.find('[name="get_list"]');
				$btn.each(function(){
					$(this).after($select.clone());
					$(this).remove();
				});
				_player.$.wrapper.find('[name="select_media"]').change(function(){
					var $table = $(this).closest('table');
					$table.find('[name="path"]').val(this.value);
					$table.find('[name="path_type"]').val('id');
					_player.updateMediaThumbnail(this.value);
					
				//	this.value = '';
				});		
			}
		}
		$.get(url, set_html);
		//set_html({ok:true,data:{infos:[{mediaid:10050,name:'/Media/photo?2/IMG_2105.JPG'},{mediaid:10062,name:'/Media/photo?3/asdf.JPG'}]}})
	},
	query : function(data){
		$.ajax({
	        type : "post",
			url : _player. create_url(),
			data: JSON.stringify(data),
			contentType: 'application/json',
			error : _player.error,
			success : _player.success
		});
	},
	error : function(a){
		format_resault('ajax error');
		format_resault(a);
	},
	success : function(a){
		format_resault(a);
	}
};

function querySnapshot(playerid,data,callback){
	var _aself = this;
	var _playerid = playerid;
	
	_aself.snapTimeOut = 60;
	_aself.retrynum = 0;
	_aself.retx = "";
	_aself.data = data;
	_aself.cb = callback;
	
	_aself.getSnapShotPath = function() {
    	_aself.retrynum++;
    	var url = '/restapi/players/snapshot/'+_playerid+'[jsessionid]';
		url = url.replace(/\[jsessionid\]/, ';jsessionid='+_d.jsessionid);
		
		var Response = $.ajax({
	        type: "GET",
	        contentType: "application/json",
	        data:_aself.data,
	        url: url,
	        async: false,
	        success: function(json){
	        	format_resault(json);
	        	if (json.ok === true ){
	        		_aself.retx = json.data.imgSrc;
		    		if (_aself.retrynum >= (_aself.snapTimeOut/3)&& _aself.retx == "") {
	                    _aself.retx = "overtime";
	                }
	        	}else{
	        		_aself.retx = "Expired";
	        	}
	        }
	    });
 
    	if (_aself.retx == "") {
    		window.setTimeout(_aself.getSnapShotPath, 3000);
    	}else{
    		_aself.cb(_aself.retx);
    	}
    };
}

function setTime(start){
	if(start == true)
		return " 09:00:00";
	else
		return " 18:00:00";
}
$(function(){
	$response_area = $('#response_area textarea');
	$api = $('#api');
	$.ajaxSetup({
		beforeSend: function(){
            console.log("ajax before send - send the clean command. ajax_counter="+ajax_counter);
			format_resault((++ajax_counter)+". "+this.url, true);
			if(isSet(this.data)){
				format_resault(this.data);								
			}	
		}
	});
	
	api.init();
	_publish.init();
	_player.init();
	
	$('.topic').click(function(){
		$(this).next().slideToggle();
	});
	
	$('.resource').click(function(){
		$(this).next().slideToggle();
	});
	
	$( "input[name='starttime']" ).datepicker({ 
		dateFormat: 'yy-mm-dd',
		onSelect: function(datetext){
			var time = setTime(true);
			datetext += time;
			$("input[name='starttime']").val(datetext);
		}
	});
	$( "input[name='endtime']" ).datepicker({ 
		dateFormat: 'yy-mm-dd',
		onSelect: function(datetext){
			var time = setTime(false);
			datetext += time;
	        $("input[name='endtime']" ).val(datetext);
	    }
});
	
	
});


    
