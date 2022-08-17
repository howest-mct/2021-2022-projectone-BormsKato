'use strict';
const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
let backend = `//${lanIP}/api/v1`;

const provider = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';

let map, layergroup;

// const maakMarker = function (coords, adres, campusnaam) {
//   //console.log(coords);
//   const arr_coords = coords.split(',');
//   layergroup.clearLayers();
//   let marker = L.marker(arr_coords).addTo(layergroup);
//   marker.bindPopup(`<h3>${campusnaam}</h3><em>${adres}</em>`);
// };

// const printData = function(data){
//   console.log(data)
// }


// const init = function () {
//   console.log('init initiated!');

  // map = L.map('map').setView([51.041028, 3.398512], 10);
  // L.tileLayer(provider, { attribution: copyright }).addTo(map);


// };

const gethorses = function () {
  // const url = lanIP + '/api/v1/horses/';
  const url = backend + `/horses/`
  // console.log(url)
  handleData(url, fill_table_horses, error_get);
};

const gethistory = function () {
  // const url = lanIP + '/api/v1/horses/';
  const url = backend + `/latestroutes/`
  // console.log(url)
  handleData(url, fill_table_history, error_get_history);
};

const getldr = function () {
  // const url = lanIP + '/api/v1/horses/';
  const url = backend + `/index/`
  // console.log(url)
  handleData(url, fill_light, error_get_ldr);
};

const fill_table_horses = function (jsonObject) {
  console.log(jsonObject)
  let htmlString = ''
  let access = ''
  for (let data of jsonObject) {
    if (data.Toegang == 1) {
      access = 'Yes'
    } else {
      access = 'No'
    }
    htmlString += ` <tr class="c-row u-table o-layout__item o-layout--gutter-lg">
        <td class="c-cell_second">${data.horseID}</td>
        <td class="c-cell_second">${data.name}</td>
        <td class="c-cell_second">${data.age}</td>
      </tr>`
  }
  document.querySelector('.js-table-horses').innerHTML = htmlString;

}

const fill_table_history = function (jsonObject) {
  console.log(jsonObject)
  let htmlString = ''
  let access = ''
  for (let data of jsonObject) {
    if (data.Toegang == 1) {
      access = 'Yes'
    } else {
      access = 'No'
    }
    htmlString += ` <tr class="c-row u-table o-layout__item o-layout--gutter-lg">

        <td class="c-cell_second">${data.date}</td>
        <td class="c-cell_second">${data.distance}</td>
        <td class="c-cell_second">${data.horses_horseID}</td>
      </tr>`
  }
  document.querySelector('.js-table-history').innerHTML = htmlString;

}

const fill_light = function (jsonObject) {
  console.log(jsonObject)
  let htmlString = ''
  let access = ''
  for (let data of jsonObject) {
    if (data.Toegang == 1) {
      access = 'Yes'
    } else {
      access = 'No'
    }
    htmlString += ` <div class="js-light c-light">
                  ${data.waarde}%
                  </div>`
  }
  document.querySelector('.js-light').innerHTML = htmlString;

}


const error_get = function () {
  let htmlString = `  <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>`;
  document.querySelector('.js-table-horses').innerHTML = htmlString
  document.querySelector('.js-table-history').innerHTML = htmlString

}
const error_get_history = function () {
  let htmlString = `  <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>`;
  document.querySelector('.js-table-history').innerHTML = htmlString

}

const error_get_ldr = function () {
  let htmlString = ` <div class="js-light c-light">
                      error %
                      </div>`;
  document.querySelector('.js-light').innerHTML = htmlString

}
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// show
// const ShowLight = function (light) {
//   console.log('het lichht' + light)
//   document.querySelector('.js-light').innerHTML = `<p class="c-light js-light">${light}%</p>`
// }

//Socketio Javascript
const listenToSocket = function () {
  socket.on('connect', function () {
    console.log('verbonden met socket webserver');
  });

};

const init = function () {
  map = L.map('map').setView([51.041028, 3.398512], 10);
  L.tileLayer(provider, { attribution: copyright }).addTo(map);
  const htmlhome = document.querySelector('.js-light')
  const htmlhistory = document.querySelector('.js-table-history')
  const htmlhorse = document.querySelector('.js-table-horses')
  const htmlalc = document.querySelector('.js-table-alc')


  if (htmlhorse) {
    console.log('horses')
    gethorses()
    // listenToShutdown()
    listenToSocket();
  }
  if (htmlhistory) {
    console.log('history')
    gethistory();
    // listenToShutdown()
    listenToSocket()
    
  }
  if (htmlhome) {
    console.log('licht')
    listenToSocket()
    getldr()
    // ShowLight()
    // listenToLockbuttons()
    // listenToTempSocket();
    // listenToShutdown()
    // showChart()
    
  }
  if (htmlalc) {
    getAlcHistory()
    listenToShutdown()
    listenToSocket()
  }
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  init();
});