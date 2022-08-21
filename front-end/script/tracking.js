'use strict';
const ShowLat = function(parameter){
    console.log("in showlat")
    // map = L.map('map').setView([latitude, longitude], 10);
    // L.tileLayer(provider, { attribution: copyright }).addTo(map);
    console.log(parameter)
  }
const listenToLatSocket = function () {
// Get lat by connect
socket.on('B2F_connected', function (parameter) {
    console.log(`lat ${parameter.latitudeWaarde} `);
    latitude = parameter.latitudeWaarde
    ShowLat(parameter.latitudeWaarde)
});
// To get latitude by thread
socket.on('Latdata', function (parameter) {
    console.log(`lat ${parameter.latitudeWaarde}`);
    latitude = parameter.latitudeWaarde
    ShowLat(parameter.latitudeWaarde)
});
// Get long by connect
socket.on('B2F_connected', function (parameter) {
    console.log(`long ${parameter.longitudeWaarde} `);
    longitude = parameter.longitudeWaarde
    ShowLat(parameter.longitudeWaarde)
});
// To get long by thread
socket.on('Longdata', function (parameter) {
    console.log(`long ${parameter.longitudeWaarde}`);
    longitude = parameter.longitudeWaarde
    ShowLat(parameter.longitudeWaarde)
});
}

  
