const lanIP = `http://${window.location.hostname}:5000`;
console.log(lanIP)
const socketio = io(`${lanIP}`);


const gethorses = function () {
  const url = lanIP + '/api/v1/horses/';
  console.log("horses get")
  console.log(url)
  handleData(url, fill_table_horses,error_get);
};
const error_get=function(){
  let htmlString=`  <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>
                    <td class="c-cell_second">Error</td>`;   
  document.querySelector('.js-table').innerHTML=htmlString
}

const listenToSocket = function () {
  socketio.on('connect', function () {
    console.log('verbonden met socket webserver');
  });
}
const init = function () {
    gethorses()    
    listenToSocket();
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM content loaded');
  init();
});