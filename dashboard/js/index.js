let spinner = document.querySelector('#spinner');
let curve_chart = document.querySelector('#curve_chart');

const modalDimensions = {
    height: 500,
    width: 1100
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
    let modalMessage = document.querySelector('#graph_message');

    modalTitle.textContent = `Relationship between Employment, Income and Age across Industries (${sliderYear})`;
    modalMessage.textContent = "Median age and median income (adjusted for inflation), on average, increase over time, regardless of the industry.";
    
    $('#generic_plot_area_left').empty();
    $('#generic_plot_area_right').empty();

    $("#plotmodal").modal('show');    
    setTimeout(() => plotView1(sliderYear, 'generic_plot_area', modalDimensions),500);    
});


document.querySelector('#view2_plot').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');
    let modalMessage = document.querySelector('#graph_message');

    modalTitle.textContent = `Employment Level across the US by Industry - ${document.querySelector('#selectIndustry').options[document.querySelector('#selectIndustry').selectedIndex].text} (${sliderYear})`;
    modalMessage.textContent = "The number of workers DECREASE, on average, moving from the eastern to western US, over time - regardless of the industry.";

    $('#generic_plot_area_left').empty();
    $('#generic_plot_area_right').empty();

    plotView2(sliderYear, document.querySelector('#selectIndustry').selectedIndex, 'generic_plot_area', modalDimensions);
    $("#plotmodal").modal('show');    
});

document.querySelector('#view3_plot').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');
    let modalMessage = document.querySelector('#graph_message');

    modalTitle.textContent = `Education Level across Industries (${sliderYear})`;
    modalMessage.textContent = "Regardless of the year, Agriculture & Professional Services have the largest % of those with a high school & grad school degree, respectively.  ";

    $('#generic_plot_area_left').empty();
    $('#generic_plot_area_right').empty();

    $("#plotmodal").modal('show');
    setTimeout(() => plotView3(sliderYear, 'generic_plot_area', modalDimensions),500);        
});

document.querySelector('#view4_left').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');
    let modalMessage = document.querySelector('#graph_message');

    modalTitle.textContent = `Demographics (${sliderYear})`;
    modalMessage.textContent = "On average, Caucasian males dominate in the industries over time, except in the Professional Services industry.";

    $('#generic_plot_area').empty();
    plotView4(sliderYear, 'generic_plot_area_left', 'generic_plot_area_right', {height: 500, width: 500});
    $("#plotmodal").modal('show');    
});

document.querySelector('#view4_right').addEventListener('dblclick', () => {
    let modalTitle = document.querySelector('#generic_plot_header');

    modalTitle.textContent = `Demographics (${sliderYear})`;

    $('#generic_plot_area').empty();
    plotView4(sliderYear, 'generic_plot_area_left', 'generic_plot_area_right', {height: 500, width: 500});
    $("#plotmodal").modal('show');    
});

