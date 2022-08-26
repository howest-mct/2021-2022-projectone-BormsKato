'use strict';

let htmlStartbtn, htmlStopbtn;

const addEventListeners = function () {
  htmlStartbtn.addEventListener('click', StartRoute);
  htmlStopbtn.addEventListener('click', StopRoute);
  console.log('blablabla')
};

const StartRoute = function(){
    socket.emit('F2B_startroute', "hallo");
    console.log("start route")
    listenToStartTijdSocket()
    htmlStartbtn.disabled = true;
    htmlStopbtn.disabled = false
    checkhorse()
    document.getElementById('startbtn').setAttribute("class", "u-buttonnietactief");
    document.getElementById('stopbtn').setAttribute("class", "u-button");
}

const StopRoute = function(){
  socket.emit('F2B_stoproute', "hallo");
  console.log("stop route")
  // listenToStopTijdSocket()
  htmlStopbtn.disabled = true;
  htmlStartbtn.disabled = false
  
  routebezig = 0;
  document.getElementById('stopbtn').setAttribute("class", "u-buttonnietactief");
  document.getElementById('startbtn').setAttribute("class", "u-button");
}

const gethorsename = function () {
    // const url = lanIP + '/api/v1/horses/';
    const url = backend + `/index/`
    // console.log(url)
    handleData(url, fill_dropdown_horses, error_get_horsename);
  };
  

const fill_dropdown_horses = function (jsonObject) {
    console.log(jsonObject)
    // htmlStartbtn = document.querySelector('.js-startbtn')
    htmlStartbtn.disabled = true;
    let htmlString = ''
    let access = ''
    htmlString += `<option value="0">Choose your horse</option>`
    for (let data of jsonObject) {
      if (data.Toegang == 1) {
        access = 'Yes'
      } else {
        access = 'No'
      }
      htmlString += `<option value="${data.HorseId}">${data.naam}</option>`
    }
    document.querySelector('.js-dropdownhorse').innerHTML = htmlString;
  
  }

const error_get_horsename = function () {
    let htmlString = `<option> Error</option>`;
    document.querySelector('.js-dropdownhorse').innerHTML = htmlString
  
  }

function checkhorse(){
    var strUser = document.getElementById("dropdownhorse").value;
    console.log('value' + strUser)
    console.log({routebezig})
    // htmlStartbtn = document.querySelector('.js-startbtn')
    if (
      routebezig == 0 &&
      strUser != 0 
      
    ) {
      console.log({routebezig})
      htmlStartbtn.disabled = false;
    } else {
      htmlStartbtn.disabled = true;
    }
  }

// function checkIfRouteIsActive(){
//   console.log({routebezig})
//   // htmlStartbtn = document.querySelector('.js-startbtn')
//   if (
//     routebezig == 1
    
//   ) {
//     htmlStopbtn.disabled = false;
//   } else {
//     htmlStopbtn.disabled = true;
//   }
// }


const init3 = function () {
  console.info('DOM geladen');
  //ik mag mijn variabele pas een waarde geven al de DOMcontentloaded gebeurd is
  htmlStartbtn = document.querySelector('.js-startbtn');
  htmlStopbtn = document.querySelector('.js-stopbtn');
  const htmlhome = document.querySelector('.js-light');
  document.getElementById('stopbtn').setAttribute("class", "u-buttonnietactief");
  //plaats de knop inactief
  // htmlStartbtn.disabled = true;
  // htmlStopbtn.disabled = true;
  //luisteren naar mijn eventListeners
  if (htmlhome)
    addEventListeners();
};

document.addEventListener('DOMContentLoaded', init3);