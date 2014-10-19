'use strict';

var container = document.getElementById('container');
var globe = new DAT.Globe(container);
var dates = ['', '2000-04-29,' + new Date().toISOString().split('T')[0], 'upcoming', 'all'];
var past = 1; // 0-1
var upcoming = 2; // 0-2
var artistId = '';
var timer;

// inputs
$('#searchBtn').click(function () {
    search();
});

$('#artistName').keyup(function (e) {
    if (e.keyCode === 13) {
        search();
    } else {
        clearTimeout(timer);
        timer = setTimeout(search, 500);
    }
});

$('#artistName').keydown(function () {
    clearTimeout(timer);
});

$('a[href="#raw"]').click(function () {
    var name = $('artistName').val();
    fetchData(null, name, name);
});

$('#tray').click(function () {
    $('#title').toggle(200);
    $('#description').toggle(200);
});

$('#past').click(function () {
    past = this.checked ? 1 : 0;
    fetchData();
});

$('#upcoming').click(function () {
    upcoming = this.checked ? 2 : 0;
    fetchData();
});

function resetGlobe() {
    globe.reset();
    $('#artist').empty();
    $('#top10').empty().hide();
    $('#past').attr('disabled', true);
    $('#upcoming').attr('disabled', true);
}

function enableCbs() {
    $('#past').removeAttr('disabled');
    $('#upcoming').removeAttr('disabled');
}

function fetchData(mbid, name, rawName) {
    resetGlobe();

    if (mbid) artistId = mbid;
    var date = dates[past+upcoming];
    if ((!artistId && !rawName) || !date) {
        enableCbs();
        return;
    }

    $('#artists').fadeOut(200, function () {
        var url = 'http://api.bandsintown.com/artists/' + (rawName ? rawName : 'mbid_' + artistId) + '/events.json?api_version=2.0&app_id=MUSIC_GLOBE&date=' + date;
        $.get(url, {}, function (data) {
            if (!data || (data.errors && data.errors[0])) {
                $('#artists').fadeOut();
                $('#infos').fadeOut();
                $('#error').html('Bandsintown: ' + data.errors[0]);
                $('#error').fadeIn();
                return;
            }

            resetGlobe();
            enableCbs();

            var cities = {};
            // first pass
            data.forEach(function (d) {
                var city = d.venue.city;
                cities[city] = cities.hasOwnProperty(city) ? cities[city] + 1 : 1;
            });

            var top = Object.keys(cities).map(function(c) { return {city: c, n: cities[c]}; }).sort(function (a, b) {
                return b.n - a.n;
            });

            if (top.length === 0 || top[0].n === 0) return;
            var scale = 1 / top[0].n;

            var topHtml = top.slice(0, 100).reduce(function (prev, curr) {
                return prev + '<li class="list-group-item"> <span class="badge alert-success">' + curr.n + '</span> ' + curr.city + ' </li>';
            }, '');

            $('#artist').html(name);
            $('#top10').append(topHtml).show();

            var globeDataLL = data.reduce(function (prev, curr) {
                var venue = curr.venue;
                return prev.concat([parseFloat(venue.latitude), parseFloat(venue.longitude), cities[venue.city] * scale]);
            }, []);

            globe.addData(globeDataLL, {format: 'magnitude'});
            globe.createPoints();

            $('#infos').fadeIn();
            $('#artists').hide();

        }, 'jsonp');

    });

}

function fetchArtists(query) {
    query = query.trim();
    if (_.isEmpty(query)) return;

    resetGlobe();

    $('#infos').fadeOut();
    $('#artists').fadeOut();
    var url = 'http://musicbrainz.org/ws/2/artist/?query=artist:' + query + '*&fmt=json&limit=15';
    $.get(url, {}, function (data) {
        var suggest = data.artists.slice(0, 10).reduce(function (prev, curr) {
            return prev + '<a href="javascript:fetchData(\'' + curr.id + '\', \'' + curr.name + '\');" class="list-group-item">' + curr.name + '</a>';
        }, '');
        $('#infos').show();
        $('#artists').html(suggest).fadeIn();
    });
}

function search() {
    $('#error').hide();
    fetchArtists($('#artistName').val());
    globe.reset();
}

$(document).ready(function () {
    if(!Detector.webgl){
        Detector.addGetWebGLMessage();
    } else {
        resetGlobe();
        globe.animate();
    }
});