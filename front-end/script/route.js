'use strict';

let htmlStartbtn;

const addEventListeners = function () {
  htmlStartbtn.addEventListener('click', StartRoute);
  console.log('blablabla')
  // listenToStartTijdSocket()
};

const StartRoute = function(){
    // window.location.href = "tracking.html"
    socket.emit('F2B_startroute');
    console.log("start route")
    listenToStartTijdSocket()
    // console.time("timer");   //start time with name = timer
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

function selectNum(){
    var strUser = document.getElementById("dropdownhorse").value;
    console.log('value' + strUser)
    // htmlStartbtn = document.querySelector('.js-startbtn')
    if (
      strUser != 0 
    ) {
      htmlStartbtn.disabled = false;
    } else {
      htmlStartbtn.disabled = true;
    }
  }


// const listenToStartTijdSocket = function () {
//   // Get start by connect
//   socket.on('B2F_connected', function (parameter) {
//     console.log(`Starttijd ${parameter.startdata}`);
//     // ShowTemp(parameter.temp)
//   });
//   // To get light by thread
//   socket.on('startdata', function (parameter) {
//     console.log(`Starttijd ${parameter.startdata}`);
//     // ShowTemp(parameter.temp)
//   });
// }

const init3 = function () {
  console.info('DOM geladen');
  //ik mag mijn variabele pas een waarde geven al de DOMcontentloaded gebeurd is
  htmlStartbtn = document.querySelector('.js-startbtn');
  const htmlhome = document.querySelector('.js-light')
//   htmlStopbtn = document.querySelector('.js-stopbtn')
  //plaats de knop inactief
//   htmlStartbtn.disabled = true;
  //luisteren naar mijn eventListeners
  if (htmlhome)
    addEventListeners();
};

document.addEventListener('DOMContentLoaded', init3);