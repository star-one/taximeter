function startPrice()
{
startPrice = document.getElementById("startFare").value;
// document.getElementById("destination").value = startPrice;
return startPrice;
}
function perMile()
{
perMile = document.getElementById("perMile").value;
return perMile;
}

function getLocation()
{
if (navigator.geolocation)
   {
   navigator.geolocation.getCurrentPosition(showPosition);
   var startLat = position.coords.latitude;
   var startLong = position.coords.longitude;
   }
   else
   {
   theStart.innerHTML="Geolocation is not supported by this browser.";
   }
}

function showPosition(position)
  {
   var latlon=position.coords.latitude.toFixed(4)+", "+position.coords.longitude.toFixed(4);
   document.getElementById("theStart").innerHTML="Located!";
   document.getElementById("startPoint").value=latlon;
  }

function initialize() {
  var opts = {
    center: new google.maps.LatLng(53.4,-1.9),
    zoom: 10
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), opts);
  geocoder = new google.maps.Geocoder();
}

function calculateDistances(startPoint, destination) {
  var origin1 = startPoint;
  var destinationA = destination;

  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin1],
      destinations: [destinationA],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidHighways: false,
      avoidTolls: false
    }, callback);
}

function callback(response, status) {
  if (status != google.maps.DistanceMatrixStatus.OK) {
    alert('Error was: ' + status);
  } else {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    var outputDiv = document.getElementById('outputDiv');
    outputDiv.innerHTML = '';
    deleteOverlays();
    startPrice = startPrice();
    perMile = perMile();

    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      addMarker(origins[i], false);
      for (var j = 0; j < results.length; j++) {
        addMarker(destinations[j], true);
        theResult = '<strong>Start:</strong> <em>' + origins[i] + '</em><br />'
            + '<strong>Destination:</strong> <em>' + destinations[j] + '</em><br />'
            + '<strong>Distance:</strong> <em>' + results[j].distance.text + '</em><br />'
            + '<strong>Journey time:</strong> <em>' + results[j].duration.text + '</em><br />'
            + '<strong>Estimated fare:</strong> <em>&pound;' + (results[j].distance.value * 0.000621371192 * perMile + startPrice).toFixed(2) + '<br />';
        outputDiv.innerHTML += theResult;
      }
    }
  }
}

function addMarker(location, isDestination) {
  var icon;
  if (isDestination) {
    icon = destinationIcon;
  } else {
    icon = originIcon;
  }
  geocoder.geocode({'address': location}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      bounds.extend(results[0].geometry.location);
      map.fitBounds(bounds);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        icon: icon
      });
      markersArray.push(marker);
    } else {
      alert('Geocode was not successful for the following reason: '
        + status);
    }
  });
}

function deleteOverlays() {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}