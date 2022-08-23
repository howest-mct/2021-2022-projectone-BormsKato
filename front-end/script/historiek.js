'use strict';

let htmlStartbtn;

const addEventListeners = function () {
  htmlStartbtn.addEventListener('click', StartRoute);
  console.log('blablabla')
};

const gethorsenamehistoriek = function () {
    // const url = lanIP + '/api/v1/horses/';
    const url = backend + `/index/`
    // console.log(url)
    handleData(url, fill_dropdown_historiek, error_get_horsename);
  };
  

const fill_dropdown_historiek = function (jsonObject) {
    console.log(jsonObject)
    let htmlString = ''
    let access = ''
    htmlString += `<option value="0">All</option>`
    for (let data of jsonObject) {
      if (data.Toegang == 1) {
        access = 'Yes'
      } else {
        access = 'No'
      }
      htmlString += `<option value="${data.HorseId}">${data.naam}</option>`
    }
    document.querySelector('.js-dropdownhistoriek').innerHTML = htmlString;
  
  }

const error_get_horsename = function () {
    let htmlString = `<option> Error</option>`;
    document.querySelector('.js-dropdownhistoriek').innerHTML = htmlString
  
  }

function selectNum(){
    var strUser = document.getElementById("dropdownhistoriek").value;
    console.log('value' + strUser)
    if (
      strUser >= 0 
    ) {
      console.log('in loop' + strUser)
      socket.emit('F2B_dropdownhistoriek', strUser)
      gethistory()
      
    } else {
      console.log('in loop ongeldig')
    }
  }

 const init3 = function () {
   console.info('DOM geladen');
//   //ik mag mijn variabele pas een waarde geven al de DOMcontentloaded gebeurd is
//   addEventListeners()
 };

document.addEventListener('DOMContentLoaded', init3);