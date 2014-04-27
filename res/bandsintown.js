// This module requires jQuery. In Node.JS, jsdom and xmlhttprequest are also required.

/*try {
	// Enable module to work with jQuery in Node.JS
	var jsdom = require('jsdom');
	var window = jsdom.jsdom().createWindow();
	var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

	var $ = require('jquery')(window);
	$.support.cors = true;
	$.ajaxSettings.xhr = function() {
		return new XMLHttpRequest;
	}
}
catch(e) {
	console.log(e);
}
*/
var bandsintown = {};


bandsintown.SearchArtist = function (artist, callback) {
	var type = 'GET';

	var headers = {
		"Accept-Language": "en-US,en;q=0.8,fr;q=0.6",
		"X-Requested-With": "XMLHttpRequest",
		"Host": "www.bandsintown.com",
		"Referer": "http://www.bandsintown.com/home",
		"Accept-Encoding": "gzip,deflate,sdch",
		"DNT": "1",
		"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36",
		"Connection": "keep-alive",
		"Accept": "application/json, text/javascript, */*; q=0.01",
		"Content-Type": "application/json",
		"Cache-Control": "no-cache",
		"Pragma": "no-cache",
	};

	var queryString = "?" + "name" + "=" + encodeURIComponent(artist) + "&";

	var data = "";

	var url = "http://www.bandsintown.com/artist/search" + queryString;

	$.ajax({
		type: type,
		url: url,
		headers: headers,
		data: data,
		beforeSend: function(xmlHttpRequest) {
			// Requires node-XMLHttpRequest version 1.5.1 or later to set some headers in Node.js
			if(xmlHttpRequest.setDisableHeaderCheck) xmlHttpRequest.setDisableHeaderCheck(true);
			return true;
		}
	})
	.done(function (data) {
		console.log(data);
	});
	/*.always(
		function (response, error) {
			response = response || '';

			if (!response.responseText) {
				try {
					var $html = $(toStaticHTML(response));
				}
				catch(e) {
					var $html = $(response);
				}
			}
			else response = response.responseText;

			var fullResponse = {
				response: response,
			};

			callback(null, fullResponse);

		}
	);*/
};

bandsintown.SearchArtist('paul', function (err, response) {
	// console.log(err, response);
});