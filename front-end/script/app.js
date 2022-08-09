'use strict';
// const lanIP = `${window.location.hostname}:5000`;
// const socket = io(`http://${lanIP}`);


const provider = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';

let map, layergroup;

const maakMarker = function (coords, adres, campusnaam) {
  //console.log(coords);
  const arr_coords = coords.split(',');
  layergroup.clearLayers();
  let marker = L.marker(arr_coords).addTo(layergroup);
  marker.bindPopup(`<h3>${campusnaam}</h3><em>${adres}</em>`);
};


const init = function () {
  console.log('init initiated!');

  map = L.map('map').setView([51.041028, 3.398512], 10);
  L.tileLayer(provider, { attribution: copyright }).addTo(map);

  if (document.querySelector('.c-campus')) {
    console.log('oefening2');
    layergroup = L.layerGroup().addTo(map);
    addEventsToCampus();
  }
};

document.addEventListener('DOMContentLoaded', init);