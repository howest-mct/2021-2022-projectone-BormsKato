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

const gethorsename = function () {
  // const url = lanIP + '/api/v1/horses/';
  const url = backend + `/index/`
  // console.log(url)
  handleData(url, fill_dropdown_horses, error_get_horsename);
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
        <td class="c-cell_second">${data.HorseId}</td>
        <td class="c-cell_second">${data.naam}</td>
        <td class="c-cell_second">${data.leeftijd}</td>
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
        <td class="c-cell_second">${data.naam}</td>
        <td class="c-cell_second">${data.Datum}</td>
        <td class="c-cell_second">${data.Afstand} km</td>
        
      </tr>`
  }
  document.querySelector('.js-table-history').innerHTML = htmlString;

}


const fill_dropdown_horses = function (jsonObject) {
  console.log(jsonObject)
  let htmlString = ''
  let access = ''
  for (let data of jsonObject) {
    if (data.Toegang == 1) {
      access = 'Yes'
    } else {
      access = 'No'
    }
    htmlString += `<option>${data.naam}</option>`
  }
  document.querySelector('.js-dropdownhorse').innerHTML = htmlString;

}

const error_get = function () {
  let htmlString = `  <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>`;
  document.querySelector('.js-table-horses').innerHTML = htmlString
}

const error_get_history = function () {
  let htmlString = `  <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>`;
  document.querySelector('.js-table-history').innerHTML = htmlString

}

const error_get_horsename = function () {
  let htmlString = `<option> Error</option>`;
  document.querySelector('.js-dropdownhorse').innerHTML = htmlString

}


function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// // show
const ShowLight = function (light) {
  console.log('het lichht' + light)
  document.querySelector('.js-light').innerHTML = `<p class="c-light js-light">${light}%</p>`
}

const ShowTemp = function (temp) {
  console.log('De temperatuur' + temp)
  document.querySelector('.js-temp').innerHTML = `<p class="c-light js-temp">${temp}°C</p>`
}

// const ShowLat = function(latitudeWaarde, longitudeWaarde){
//   console.log("in showlat")
//   map = L.map('map').setView([latitudeWaarde, longitudeWaarde], 10);
//   L.tileLayer(provider, { attribution: copyright }).addTo(map);
// }

//Socketio Javascript
const listenToSocket = function () {
  socket.on('connect', function () {
    console.log('verbonden met socket webserver');
  });

};

// Listen to the socketio
const listenToLightSocket = function () {
  // Get light by connect
  socket.on('B2F_connected', function (parameter) {
    console.log(`Het is ${parameter.light} %`);
    ShowLight(parameter.light)
  });
  // To get light by thread
  socket.on('LightData', function (parameter) {
    console.log(`Het is ${parameter.light} %`);
    ShowLight(parameter.light)
  });
}

const listenToTempSocket = function () {
  // Get temp by connect
  socket.on('B2F_connected', function (parameter) {
    console.log(`Het is ${parameter.temp} °C`);
    ShowTemp(parameter.temp)
  });
  // To get light by thread
  socket.on('TempData', function (parameter) {
    console.log(`Het is ${parameter.temp} °C`);
    ShowTemp(parameter.temp)
  });
}

// const listenToLatSocket = function () {
//   // Get lat by connect
//   socket.on('B2F_connected', function (parameter) {
//     console.log(`lat ${parameter.latitudeWaarde} `);
//     ShowLat(parameter.latitudeWaarde)
//   });
//   // To get latitude by thread
//   socket.on('Latdata', function (parameter) {
//     console.log(`lat ${parameter.latitudeWaarde}`);
//     ShowLat(parameter.latitudeWaarde)
//   });
//   // Get long by connect
//   socket.on('B2F_connected', function (parameter) {
//     console.log(`long ${parameter.longitudeWaarde} `);
//     ShowLat(parameter.longitudeWaarde)
//   });
//   // To get long by thread
//   socket.on('Longdata', function (parameter) {
//     console.log(`long ${parameter.longitudeWaarde}`);
//     ShowLat(parameter.longitudeWaarde)
//   });
// }


function toggleNav() {
  let toggleTrigger = document.querySelectorAll(".js-toggle-nav");
  for (let i = 0; i < toggleTrigger.length; i++) {
      toggleTrigger[i].addEventListener("click", function () {
          document.querySelector("body").classList.toggle("has-mobile-nav");
      })
  }
}



function shutdown() {
  let text = "Are you sure you want to shutdown the device?";
  if (confirm(text) == true) {
    console.log('Shutdown 😒')
    socket.emit('F2B_shutdown');
  } else {
    console.log("cancel")
    text = "";
  }
  document.getElementById("shutdown").innerHTML = text;
}

const ShowLat = function(latitude, longitude){
  console.log("in showlat")
  const arr_latlong = (latitude +' '+ longitude)
  console.log(arr_latlong)
  console.log(latitude )
  console.log(longitude)
  let marker = L.marker( arr_latlong).addTo(layergroup);
  // layergroup = L.layerGroup().addTo(map);
  marker.bindPopup(`ok`);
  
  
}
const listenToLatSocket = function () {
// Get gps by connect
socket.on('B2F_connected', function (parameter) {
  console.log(`lat ${parameter.latitudeWaarde}, long ${parameter.longitudeWaarde}`);
  latitude = parameter.latitudeWaarde
  longitude = parameter.longitudeWaarde
  ShowLat(parameter.latitudeWaarde,parameter.longitudeWaarde)
});
// To get gps by thread
socket.on('gpsdata', function (parameter) {
  console.log(`lat ${parameter.latitudeWaarde}, long ${parameter.longitudeWaarde}`);
  ShowLat(parameter.latitudeWaarde,parameter.longitudeWaarde)
});
}



const init = function () {
  
  const htmlhome = document.querySelector('.js-light')
  const htmlhistory = document.querySelector('.js-table-history')
  const htmlhorse = document.querySelector('.js-table-horses')
  const htmltracking = document.querySelector('.js-tracking')
  const htmlsettings = document.querySelector('.js-settings')


  if (htmlhorse) {
    console.log('horses')
    gethorses()
    listenToSocket();
  }
  if (htmlhistory) {
    console.log('history')
    gethistory();
    listenToSocket()
    
  }
  if (htmlhome) {
    console.log('licht')
    map = L.map('map').setView([51.041028, 3.398512], 10);
    L.tileLayer(provider, { attribution: copyright }).addTo(map);
    listenToSocket()
    listenToLightSocket()
    listenToTempSocket()
    gethorsename()  
  }
  if (htmltracking) {
    console.log("tracking")
    map = L.map('map').setView([50.84, 3.30], 15);
    L.tileLayer(provider, { attribution: copyright }).addTo(map);
    listenToSocket()
    listenToLatSocket()
    layergroup = L.layerGroup().addTo(map);
  }
  if (htmlsettings){
    console.log("settings")
    listenToSocket()
  }
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  init();
});