// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json
"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

//sets up the original map 

$(document).ready(function() {
   var mapElem = document.getElementById('map');
   var center = {
      lat: 47.6,
      lng: -122.3
   };

   var map = new google.maps.Map(mapElem, {
      center: center,
      zoom: 12
   });

   //create new info winder
   var infoWindow = new google.maps.InfoWindow();

   var stations;
   var markers = [];

   //gets the traffic data from seattle
   $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
      .done(function(data, itemIndex) {
         stations = data;
         data.forEach(function(station) {
            var marker = new google.maps.Marker({
               position: {
                  lat: Number(station.location.latitude),
                  lng: Number(station.location.longitude)
               },
               map: map
            });
            markers.push(marker);

            //shows a popup window when you click on a marker
            google.maps.event.addListener(marker, 'click', function() {
               map.panTo(this.getPosition());
               var html = '<h2>' + station.cameralabel + '</h2>' + '<img src= ' + station.imageurl.url + '>';

               infoWindow.setContent(html);
               infoWindow.open(map, this);
            });

            //filters the search results
            $("#search").bind('search keyup', function() {
               var cameraLabel = station.cameralabel;
               cameraLabel = cameraLabel.toLowerCase();

               var searchLabel = this.value;
               searchLabel = searchLabel.toLowerCase();

               if (cameraLabel.indexOf(searchLabel) < 0) {
                  marker.setMap(null);
               } else {
                  marker.setMap(map);
               }
            });

         });
      })
      .fail(function(error) {
         console.log(error);
      })
      .always(function() {
         $('#ajax-loader').fadeOut();
      })
});