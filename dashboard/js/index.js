let spinner = document.querySelector('#spinner');
let curve_chart = document.querySelector('#curve_chart');

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function toggleSpinner(time) {

    sleep(time).then(() => {
        if ( spinner.style.display === 'none') {
            spinner.style.display = 'block';        
        } else {
            spinner.style.display = 'none'; 
        }
    });
}

curve_chart.addEventListener('dblclick', (e) => {
    console.log(e.target);

    var chart = new google.visualization.BubbleChart(document.getElementById('curve_chart'))

    //curve_chart.style.height='100px';
    //e.target.style.height='500px';
});