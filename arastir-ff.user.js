// ==UserScript==
// @name        arastir++
// @namespace   https://github.com/fellay/arastirpp
// @author      fellay @github
// @description arastir linkleri geri dondu!
// @include     https://eksisozluk.com/*
// @include     https://*.eksisozluk.com/*
// @version     0.1
// @grant       none
// ==/UserScript==

var localStorageName = 'arastirppdata';

window.arastirConfig = function(){
	$('li.active').removeClass('active');
	$('#settings-tabs>li:last').addClass('active');
	$('#settings-tabs').after('<div id="arastirppdiv"><fieldset><legend>araştır++ sitelerim</legend></fieldset></div>');
	$('#arastirppdiv').nextAll().remove();

	$.each(getStoredSites(), function(k, v){
		$('#arastirppdiv>fieldset').append( '<div data-arastirpp="' + k + '"><label class="siteFormNo"> ' + (k+1) + '</label> <input style="width:80px;" type="text" value="' + v.siteName + '"/> <input style="width:220px;" type="text" value="' + v.url + '"/> <input style="width:220px;" type="text" value="' + v.icon + '" placeholder="icon url" />  <span class="delSite"><a href="#arastir" onclick="delSite(' + k + ');">temizle</a></span></div>' );
	});

	addNewSiteForm();
	$('#arastirppdiv>fieldset').after(' <button class="primary" onclick="gogogo();">kaydet!</button>');
}

window.delSite = function(k){
	$('#arastirppdiv>fieldset>div:eq(' + k + ')>input').val('');
}

window.gogogo = function(){
	var thisIsWhatToSave = [];
	$.each($('#arastirppdiv>fieldset>div'), function(k, v){
		var siteName = $(this).find('input').eq(0).val().trim();
		var url = $(this).find('input').eq(1).val().trim();
		var icon = $(this).find('input').eq(2).val().trim();
		if(siteName.length && url.length){
			thisIsWhatToSave.push({siteName: siteName, url: url, icon: icon});
		}
	});

	localStorage.setItem(localStorageName, JSON.stringify(thisIsWhatToSave));
	$('#settings-tabs').after('<span id="itsdone" style="background-color: #dff2bf; color: #4f8a10;" class="showall more-data" title="senin is tamam!">arastir linkleri basariyla guncellendi!</span>');
	setTimeout(function(){
		if ($('#itsdone').length) {
			$('#itsdone').fadeOut(500, function() { $(this).remove(); });
		}
	}, 3500);
}

window.addNewSiteForm = function(){
	var s = parseInt($('.siteFormNo:last').text())+1;
	$('#arastirppdiv>fieldset').append('<div data-arastirpp="' + (s-1) + '"><label class="siteFormNo">' + s + '</label> <input style="width:80px;" type="text" value="" placeholder="site adı" /> <input style="width:220px;" type="text" value="" placeholder="site url\'i" /> <input style="width:220px;" type="text" value="" placeholder="icon url\'i" /></div>');
	$('button#dahaSiteEkleButton').remove();
	$('#arastirppdiv>fieldset>div:last').append(' <button id="dahaSiteEkleButton" onclick="addNewSiteForm();">daha</button>');
}

window.getDefaultArastirSites = function(){
	return [
				{siteName: 'vikipedi', url: 'http://tr.wikipedia.org/w/index.php?title=%C3%96zel:Ara&fulltext=Ara&search=', icon : 'http://tr.wikipedia.org/favicon.ico' },
				{siteName: 'wikipedia', url: 'http://en.wikipedia.org/wiki/Special:Search?fulltext=Search&search=', icon : 'http://en.wikipedia.org/favicon.ico' },
				{siteName: 'imdb', url: 'http://us.imdb.com/find?q=', icon : 'http://www.imdb.com/favicon.ico' },
				{siteName: 'youtube', url: 'http://www.youtube.com/results?search_query=', icon : 'http://www.youtube.com/favicon.ico' }
		];
}

window.getStoredSites = function(){
	return JSON.parse(localStorage.getItem(localStorageName));
}

window.firstTime = function(){
	if(localStorage.getItem(localStorageName) == null)
		localStorage.setItem(localStorageName, JSON.stringify(getDefaultArastirSites()));
}

/* pisssssmi */
$( document ).ready(function() {

	if($('#settings-tabs').length){
		$('#settings-tabs').append('<li><a href="#arastir" onclick="arastirConfig();">araştır++</a></li>');
	}

	if($('#topic-research-menu').length){
		firstTime();
		$.each(getStoredSites(), function(k, v){
			var baslik = $('h1#title span[itemprop="name"]').text();
			var itemStyle;
			if(v.icon.length)
				itemStyle = 'background: url(\'' + v.icon + '\') no-repeat scroll left top rgba(0, 0, 0, 0); background-size: 16px 16px; display: inline-block; min-height: 16px; min-width: 16px; vertical-align: middle; margin-right: 8px;';
			$('.sub-title-menu .dropdown-menu.toggles-menu').append('<li><a href="' + v.url + encodeURIComponent(baslik) + '" target="_blank"><span style="' + itemStyle + '"></span>' + v.siteName + '</a></li>');
		});
	}

});
