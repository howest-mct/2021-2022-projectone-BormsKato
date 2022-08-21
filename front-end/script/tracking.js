'use strict';
const ShowLat = function(latitude, longitude){
    console.log("in showlat")
    // let marker = L.marker( ).addTo(layergroup);
    const arr_latlong = (latitude +' '+ longitude)
    console.log(arr_latlong)
    console.log(latitude )
    console.log(longitude)
  }

const maakMarker = function (coords, adres, campusnaam) {
    //console.log(coords);
    const arr_coords = coords.split(',');
    layergroup.clearLayers();
    let marker = L.marker(arr_coords).addTo(layergroup);
    marker.bindPopup(`<h3>${campusnaam}</h3><em>${adres}</em>`);
};
const listenToLatSocket = function () {
// Get gps by connect
socket.on('B2F_connected', function (parameter) {
    console.log(`lat ${parameter.latitudeWaarde}, long ${parameter.longitudeWaarde}`);
    latitude = parameter.latitudeWaarde
    longitude = parameter.longitudeWaarde
    ShowLat(parameter.latitudeWaarde,parameter.longitudeWaarde)
});
// To get long by thread
socket.on('gpsdata', function (parameter) {
    console.log(`lat ${parameter.latitudeWaarde}, long ${parameter.longitudeWaarde}`);
    ShowLat(parameter.latitudeWaarde,parameter.longitudeWaarde)
});
}

  
