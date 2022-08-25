'use strict';
const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);
let backend = `//${lanIP}/api/v1`;

const provider = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const copyright =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>';

let map, layergroup;
let htmlhome 


const gethorses = function () {
  const url = backend + `/horses/`
  handleData(url, fill_table_horses, error_get);
};

const gethistory = function () {
  const url = backend + `/latestroutes/`
  handleData(url, fill_table_history, error_get_history);
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
        <td><button  onclick="deleteRow(${data.HorseId}, '${data.naam}')"> <svg version="1.1" width="18.75"
        height="26.25" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 330 330" style="enable-background:new 0 0 330 330;" xml:space="preserve">
     <g>
       <path d="M240,121.076V90h15c8.284,0,15-6.716,15-15s-6.716-15-15-15h-30h-15V15c0-8.284-6.716-15-15-15H75c-8.284,0-15,6.716-15,15
         v45H45H15C6.716,60,0,66.716,0,75s6.716,15,15,15h15v185c0,8.284,6.716,15,15,15h60h37.596c19.246,24.347,49.031,40,82.404,40
         c57.897,0,105-47.103,105-105C330,172.195,290.817,128.377,240,121.076z M90,30h90v30h-15h-60H90V30z M105,260H60V90h15h30h60h30
         h15v31.076c-50.817,7.301-90,51.119-90,103.924c0,12.268,2.122,24.047,6.006,35H105z M225,300c-41.355,0-75-33.645-75-75
         s33.645-75,75-75s75,33.645,75,75S266.355,300,225,300z"/>
       <path d="M256.819,193.181c-5.857-5.857-15.355-5.857-21.213,0L225,203.787l-10.606-10.606c-5.857-5.857-15.355-5.857-21.213,0
         c-5.858,5.857-5.858,15.355,0,21.213L203.787,225l-10.606,10.606c-5.858,5.857-5.858,15.355,0,21.213
         c2.929,2.929,6.768,4.394,10.606,4.394s7.678-1.465,10.606-4.394L225,246.213l10.606,10.606c2.929,2.929,6.768,4.394,10.606,4.394
         s7.678-1.465,10.606-4.394c5.858-5.857,5.858-15.355,0-21.213L246.213,225l10.606-10.606
         C262.678,208.536,262.678,199.038,256.819,193.181z"/>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     <g>
     </g>
     </svg> </button>
</td>
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

const deleteRow = function(paard, naam){
  // console.log("deleteknop")
  // console.log(paard)
  // socket.emit('F2B_deletehorse', paard)
  console.log(paard)
  console.log(naam)
  let text = "Are you sure you want to delete " + naam +"?";
  if (confirm(text) == true) {
    console.log('delete' + {paard})
    socket.emit('F2B_deletehorse', paard);
    const url = backend + `/horses/`
    handleData(url, fill_table_horses, error_get)
  } else {
    console.log("cancel" )
    const url = backend + `/horses/`
    handleData(url, fill_table_horses, error_get)
  }
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

const listenToIngesteldeTemp = function (){
  // Get waarde by connect
  socket.on('B2F_status_licht', function (parameter) {
    console.log(parameter)
    console.log(`Het is ${parameter.light} ingesteld`);
    // ShowTemp(parameter.temp)
    document.querySelector('.js-ingesteld').innerHTML = `<h4>The backlights will turn on when the light percentage is below: ${parameter.light}%</h4>`
  });
  // To get light by thread
  socket.on('lightdata', function (parameter) {
    console.log(`Het is ${parameter.light} ingesteld`);
    // ShowTemp(parameter.temp)
    document.querySelector('.js-ingesteld').innerHTML = `<h4>The backlights will turn on when the light percentage is below: ${parameter.light}%</h4>`
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
    text = "";
    socket.emit('F2B_shutdown');
  } else {
    console.log("cancel")
    text = "";
  }
  document.getElementById("shutdown").innerHTML = text;
}

const ShowLat = function(latitude, longitude){
  const htmlhome = document.querySelector('.js-light')
  console.log("in showlat")
  const arr_latlong = (latitude +","+ longitude)
  const arr_coords = arr_latlong.split(',');
  console.log(arr_latlong)
  console.log(latitude )
  console.log(longitude)
  if (htmlhome){
    layergroup.clearLayers();
  }
    
  let marker = L.marker( arr_coords).addTo(layergroup);
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


const listenToStartTijdSocket = function () {
  // Get start by connect
socket.on('startdata', function (parameter) {
  console.log("hoi")
  console.log(parameter)
  console.log(`Starttijd ${parameter.start}`);
  // // ShowTemp(parameter.temp)
});
}


const init = function () {
  
  const htmlhome = document.querySelector('.js-light')
  const htmlhistory = document.querySelector('.js-table-history')
  const htmlhorse = document.querySelector('.js-table-horses')
  // const htmltracking = document.querySelector('.js-tracking')
  const htmlsettings = document.querySelector('.js-settings')


  if (htmlhorse) {
    socket.emit('F2B_dropdownhistoriek', "0")
    console.log('horses')
    gethorses()
    listenToSocket();
  }
  if (htmlhistory) {
    console.log('history')
    gethistory();
    listenToSocket()
    gethorsenamehistoriek()
    
  }
  if (htmlhome) {
    socket.emit('F2B_dropdownhistoriek', "0")
    console.log('licht')
    map = L.map('map').setView([50.84, 3.30], 15);
    L.tileLayer(provider, { attribution: copyright }).addTo(map);
    listenToSocket()
    listenToLightSocket()
    listenToTempSocket()
    gethorsename()  
    listenToLatSocket()
    layergroup = L.layerGroup().addTo(map);
    
  }
  // if (htmltracking) {
  //   console.log("in tracking")
  //   socket.emit('F2B_dropdownhistoriek', "0")
  //   console.log("tracking")
  //   map = L.map('map').setView([50.84, 3.30], 15);
  //   L.tileLayer(provider, { attribution: copyright }).addTo(map);
  //   listenToSocket()
  //   listenToLatSocket()
  //   // listenToStartTijdSocket()
  //   layergroup = L.layerGroup().addTo(map);
    
  // }
  if (htmlsettings){
    socket.emit('F2B_dropdownhistoriek', "0")
    console.log("settings")
    
    listenToSocket()
    listenToIngesteldeTemp()
  }
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  init();
});