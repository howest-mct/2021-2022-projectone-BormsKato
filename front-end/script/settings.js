'use strict';

let htmlLight, htmlMijnButton;

const addEventListeners = function () {
  htmlLight.addEventListener('input', function () {
    checkValues();
  });
  htmlMijnButton.addEventListener('click', ShowLightPercentage);
};

const checkValues = function () {
  console.log('checking...');
  if (
    htmlLight.value >= 0 &&
    htmlLight.value <= 100
  ) {
    htmlMijnButton.disabled = false;
  } else {
    htmlMijnButton.disabled = true;
  }
};

const ShowLightPercentage = function () {
  const light = htmlLight.value;
  console.log(`Het ingestelde licht: ${light}`);
  socket.emit('F2B_light', light)
};


const init1 = function () {
  console.info('DOM geladen');
  //ik mag mijn variabele pas een waarde geven al de DOMcontentloaded gebeurd is
  htmlLight = document.querySelector('.js-lightuser');
  htmlMijnButton = document.querySelector('.js-btnlight');
  //plaats de knop inactief
  htmlMijnButton.disabled = true;
  //luisteren naar mijn eventListeners
  addEventListeners();
};

document.addEventListener('DOMContentLoaded', init1);