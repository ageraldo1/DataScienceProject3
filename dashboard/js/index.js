let spinner = document.querySelector('#spinner');

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
