document.addEventListener('DOMContentLoaded', function() {
  var maps = {};

  $('[data-map-options]').each(function(i, o) {
    var options = $(o).data('map-options');
    var initialLat = 55.94528820000001;
    var initialLng = -3.200755699999945;
    var initialZoom = 9;
    if (options.center) {
      var initialLat = options.center.lat;
      var initialLng = options.center.lng;
      var initialZoom = options.zoom;
    }
    var map = L.map(o, {
      fullscreenControl: true,
      scrollWheelZoom: false,
      trackResize: false
    }).setView([initialLat, initialLng], initialZoom);
    var osmAttrib = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
    L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
      attribution: osmAttrib,
      minZoom: 6,
      maxZoom: 18,
      opacity: 0.8
    }).addTo(map);
    L.control.scale().addTo(map);
    var mapName = $(o).data('map-name');

    // console.log(options.circle);
    var searchArea;
    var searchAreaShown = false;
    if (options.circle) {
      if (options.circle.radius > 0) {
        searchArea = L.circle(
          [options.circle.lat, options.circle.lng],
          {
            radius: options.circle.radius*1000,
            color: '#0081BB',
            fillColor: '#0081BB',
            fillOpacity: 0.1
          }
        ).addTo(map);
        searchAreaShown = true;
      }
    }

    var $vacancies = $('marker[data-map="' + mapName + '"]');
    var vacancyMarkers = {};

    $vacancies.each(function(i, o) {
      var $o = $(o);
      var key = $o.data('lat') + ',' + $o.data('lng');
      if (!vacancyMarkers.hasOwnProperty(key)) {
        vacancyMarkers[key] = {
          position: {
            lat: $o.data('lat'),
            lng: $o.data('lng')
          },
          type: $o.data('type'),
          shortlisted: $o.data('shortlisted'),
          homebased: $o.data('homebased'),
          contents: []
        };
      }
      vacancyMarkers[key].contents.push($o.html());
    });

    var markers = new L.featureGroup();
    var vacancyPositions = Object.keys(vacancyMarkers);

    for (var p = 0; p < vacancyPositions.length; p++) {
      var vacancyPosition = vacancyPositions[p];
      var vacancyMarker = vacancyMarkers[vacancyPosition];
      var type = vacancyMarker.type;
      var iconType = '';
      if (vacancyMarker.homebased) {
        iconType = ' homebased';
      }
      if (vacancyMarker.shortlisted) {
        iconType = ' shortlisted';
      }
      var icon = L.divIcon({
        html: '<i class="marker-icon-'+type+iconType+' fas fa-map-marker"></i><span class="map-marker-overlay map-marker-overlay-'+type+'">' + vacancyMarker.contents.length  + '</span>',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -42],
        className: 'vacancy_icon'
      });
      var marker = L.marker([vacancyMarker.position.lat, vacancyMarker.position.lng], {icon: icon}).addTo(map);
      var html;
      if (vacancyMarker.contents.length > 1) {
        var id = 'popup-pager-' + p;
        var content = $('<div>');
        var pager = $('<div>')
        .attr('id', id)
        .addClass('popup-pager')
        .append(vacancyMarker.contents.join('\n'))
        .appendTo(content);
        var back = $('<a>')
        .attr('href', 'javascript:popupPagerPage("#' + id + '", "back")')
        .addClass('scroll-button pager pager-left')
        .append('<span class="fas fa-fw fa-angle-left fa-2x"></span>')
        .appendTo(content);
        var next = $('<a>')
        .attr('href', 'javascript:popupPagerPage("#' + id + '", "next")')
        .addClass('scroll-button pager pager-right')
        .append('<span class="fas fa-fw fa-angle-right fa-2x"></span>')
        .appendTo(content);
        back.on('click', function(evt) {
          var pager = $(evt.currentTarget).parent();
          popupPage(pager, 'back');
        });
        next.on('click', function(evt) {
          var pager = $(evt.currentTarget).parent();
          popupPage(pager, 'next');
        });
        html = content.html();
      } else {
        html = vacancyMarker.contents[0];
      }
      marker.bindPopup(html);
      markers.addLayer(marker);
    }

    if (!options.center) {
      if (searchAreaShown) {
        map.fitBounds(searchArea.getBounds());
      } else {
        map.fitBounds(markers.getBounds());
      }
    }

    maps[mapName] = map;
  });

  window.popupPagerPage = function (pager, direction) {
    var currentPage = $(pager).find('.map-content:visible');
    var nextPage = currentPage;
    if (direction === 'next') {
      var nextElement = currentPage.next();
      if (!nextElement || nextElement.length === 0) {
        nextPage = $(pager).children().first();
      } else {
        nextPage = nextElement;
      }
    } else if (direction === 'back') {
      var prevElement = currentPage.prev();
      if (!prevElement || prevElement.length === 0) {
        nextPage = $(pager).children().last();
      } else {
        nextPage = prevElement;
      }
    }
    currentPage.hide();
    nextPage.show();
  }

});