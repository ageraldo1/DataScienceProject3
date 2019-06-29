//const APP_BASEURL='https://gt-hw15-belly-button.herokuapp.com/samples';
//const APP_BASEURL='https://randomuser.me/api/?results=10';
//const APP_BASEURL='https://cors-anywhere.herokuapp.com/';
//const APP_BASEURL='https://sample-ds-call.herokuapp.com/';
const APP_BASEURL='https://data-proj-3.herokuapp.com/timespan';


const loadData = async (endpoint) => {
  
    const response = await fetch(endpoint, {
      method: 'GET',
      mode: 'cors'/*,
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Allow-Credentials': true
      },
      crossdomain: true*/
    });

    //console.log(response);
    if ( response.status !== 200) {
        throw new Error('Error loading data');
      };
    
      return await response.json();
} 

function init() {
    loadData(APP_BASEURL)
        .then(data => {
          console.log(data);
        })
        .catch(err => console.log(err));    
}

init();
