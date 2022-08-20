'use strict';

let htmlNaam, htmlLeeftijd, htmlbtnNewHorse;

const addEventListeners = function () {
  htmlNaam.addEventListener('input', function () {
    checkValues();
  });
  htmlLeeftijd.addEventListener('input', function () {
    checkValues();
  });
  htmlbtnNewHorse.addEventListener('click', ShowNewHorse);
};

const checkValues = function () {
  console.log('checking...');
  if (
    htmlLeeftijd.value >= 0 &&
    htmlLeeftijd.value <= 45
  ) {
    htmlbtnNewHorse.disabled = false;
  } else {
    htmlbtnNewHorse.disabled = true;
  }
};

const ShowNewHorse = function () {
  const naam = htmlNaam.value;
  const leeftijd = htmlLeeftijd.value;
  console.log(`Het nieuw toegevoegde paard: ${naam} ${leeftijd}`);
  socket.emit('F2B_newhorse', naam, leeftijd)
};


const init2 = function () {
  console.info('DOM geladen');
  //ik mag mijn variabele pas een waarde geven al de DOMcontentloaded gebeurd is
  htmlNaam = document.querySelector('.js-naam');
  htmlLeeftijd = document.querySelector('.js-leeftijd');
  htmlbtnNewHorse = document.querySelector('.js-btnnewhorse');
  //plaats de knop inactief
  htmlbtnNewHorse.disabled = true;
  //luisteren naar mijn eventListeners
  addEventListeners();
};

document.addEventListener('DOMContentLoaded', init2);