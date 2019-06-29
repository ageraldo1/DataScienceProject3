let spinner = document.querySelector('#spinner');
let curve_chart = document.querySelector('#curve_chart');

const modalDimensions = {
    height: 500,
    width: 1000
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};

function toggleSpinner(time) {

    sleep(time).then(() => {
        if ( spinner.style.display === 'none') {
            spinner.style.display = 'block';                    
            
        } else {
            spinner.style.display = 'none';
        }
    });
};


document.querySelector('#selectIndustry').addEventListener('change', (e) => {
    plotView2(sliderYear, e.target.selectedIndex, 'view2_plot', defaultDimensions);
    plotView4(sliderYear, 'view4_left', 'view4_right', {height: 350, width: 350}, e.target.selectedIndex);
    industrySelection =  e.target[e.target.selectedIndex].value;
});

document.querySelector('#view1_plot').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');

    modalTitle.textContent = `Correlation between employment, income and age accross industries (${sliderYear})`;

    $('#generic_plot_area_left').empty();
    $('#generic_plot_area_right').empty();
    plotView1(sliderYear, 'generic_plot_area', modalDimensions);
    $("#plotmodal").modal('show');    
});


document.querySelector('#view2_plot').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');

    modalTitle.textContent = `Employment Ratio across the US - ${document.querySelector('#selectIndustry').options[document.querySelector('#selectIndustry').selectedIndex].text} (${sliderYear})`;

    $('#generic_plot_area_left').empty();
    $('#generic_plot_area_right').empty();

    plotView2(sliderYear, document.querySelector('#selectIndustry').selectedIndex, 'generic_plot_area', modalDimensions);
    $("#plotmodal").modal('show');    
});

document.querySelector('#view3_plot').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');

    modalTitle.textContent = `Education Level accross industries (${sliderYear})`;

    $('#generic_plot_area_left').empty();
    $('#generic_plot_area_right').empty();

    plotView3(sliderYear, 'generic_plot_area', modalDimensions);
    $("#plotmodal").modal('show');    
});

document.querySelector('#view4_left').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');

    modalTitle.textContent = `Gender Jobs Distribution (${sliderYear})`;

    $('#generic_plot_area').empty();
    plotView4(sliderYear, 'generic_plot_area_left', 'generic_plot_area_right', {height: 500, width: 500});
    $("#plotmodal").modal('show');    
});

document.querySelector('#view4_right').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');

    modalTitle.textContent = `Gender Jobs Distribution (${sliderYear})`;

    $('#generic_plot_area').empty();
    plotView4(sliderYear, 'generic_plot_area_left', 'generic_plot_area_right', {height: 500, width: 500});
    $("#plotmodal").modal('show');    
});

