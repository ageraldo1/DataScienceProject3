let firstLoad = true;
var sliderYear;
var industrySelection = 1;

const defaultAnimation = {
    'startup': true,
    duration: 500,
    easing: 'out'    
}

const defaultDimensions = {
    height: 400,
    width: 800
}

const loadData = async (endpoint) => {
  let headers = new Headers();
  
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      redirect: 'follow'
    }
  });

  if ( response.status !== 200) {
    throw new Error('Error loading data');
  };

  return await response.json();
}

function refresh() {

    toggleSpinner(1500, true);

        if (firstLoad) {
          loadData(APP_BASEURL.concat('/timespan'))
            .then(data => {
              createMainFilters(data);
              sliderYear = Math.min(...data);           
  
              for (i = 1; i < 4; i++) {
                  let row = document.querySelector(`#row${i}`);
                  row.classList.remove('d-none');
              }

              plotView1(sliderYear, 'view1_plot', defaultDimensions);     
              plotView2(sliderYear, document.querySelector('#selectIndustry').selectedIndex, 'view2_plot', defaultDimensions);
              plotView3(sliderYear, 'view3_plot', defaultDimensions);     
              plotView4(sliderYear, 'view4_left', 'view4_right', {height: 350, width: 350});      
  
              firstLoad = false;
  
            })
            .catch(err => console.log(err));    

        } else {
          plotView1(sliderYear, 'view1_plot', defaultDimensions);     
          plotView2(sliderYear, document.querySelector('#selectIndustry').selectedIndex, 'view2_plot', defaultDimensions);
          plotView3(sliderYear, 'view3_plot', defaultDimensions);     
          plotView4(sliderYear, 'view4_left', 'view4_right', {height: 350, width: 350});  

        }


    toggleSpinner(0, true);
}

function createMainFilters(period) {
    let gauge_income = new JustGage({
      id: "gauge_income",
      value: 0,
      min: 0,
      max: 100,
      title: "Income",
      levelColorsGradient: true,
      counter: true,
      gaugeWidthScale: 0.7,
      hideInnerShadow: true,
      formatNumber: true,
      levelColors: ["#6F6EA0"]
    });
  
    let gauge_employment = new JustGage({
      id: "gauge_employment",
      value: 0,
      min: 0,
      max: 100,
      title: "Employment",
      levelColorsGradient: true,
      counter: true,
      gaugeWidthScale: 0.7,
      hideInnerShadow: true,
      formatNumber: true,
      levelColors: ["#6F6EA0"]
    });  
  
    let gauge_unemployment = new JustGage({
      id: "gauge_unemployment",
      value: 0,
      min: 0,
      max: 100,
      title: "Unemployment",
      levelColorsGradient: true,
      counter: true,
      gaugeWidthScale: 0.7,
      hideInnerShadow: true,
      formatNumber: true,
      levelColors: ["#6F6EA0"]
    });  
    
    $(".js-range-slider").ionRangeSlider({
      skin: 'round',
      type: 'single',
      values: period,
      grid: true,
      grid_snap: true,
      prettify_enabled: false,
      keyboard: true,
      hide_min_max: true,
      onFinish: function (data) {

        sliderYear = data.from_value;

        loadData(APP_BASEURL.concat(`/income_pct_kpi/${sliderYear}`))
          .then(data => {
            gauge_income.refresh(data);;

          })
          .catch(err => console.log(err));

        loadData(APP_BASEURL.concat(`/employment_kpi/${sliderYear}`))
          .then(data => {
            gauge_employment.refresh(data.employed);
            gauge_unemployment.refresh(data.unemployed);
          })
          .catch(err => console.log(err));

          refresh();        
      }
    }); 
    
    loadData(APP_BASEURL.concat('/industry_key'))
      .then(data => {
        let selectIndustry = document.querySelector('#selectIndustry');

        Object.keys(data).forEach(item => {
          let industry = document.createElement('option')
          industry.value = item;
          industry.textContent = data[item];

          selectIndustry.appendChild(industry);
          
        });  
        
        industrySelection = selectIndustry[selectIndustry.selectedIndex].value;
      })
      .catch(err => console.log(err));

      

    
  }

function plotView1(year, container, dimensions) {
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(() => {

      loadData(APP_BASEURL.concat(`/bubble_graph/${sliderYear}`))
        .then(data => {          
          let dataTable = new google.visualization.DataTable();
      
          dataTable.addColumn('string', 'Industry');    
          dataTable.addColumn('number', 'Total Employment');
          dataTable.addColumn('number', 'Median Income');
          dataTable.addColumn('number', 'Median Age');

          data.forEach(item => {
            dataTable.addRow([item.industry, Number(item.jobs_number), Number(item.median_income), Number(item.median_age)]);
            
          });

          let options = {
            fontSize:12,
            hAxis: {
              title: 'Employment', 
              bold: true,
              format: 'decimal',
              textStyle: {
                fontSize: 10
              },
              textPosition : 'out'
            },
            vAxis: {
              title: 'Average Incoming',
              textStyle : {
                fontSize: 10
              },
              textPosition : 'out'
            },
            backgroundColor: { fill:'transparent' },
            colorAxis: {colors: ['#6F6EA0']},
            bubble: {
              textStyle: {
                auraColor: 'none'
              },
              opacity: 0.5,        
            },
            animation: defaultAnimation,
            chartArea : {
              width:'80%',
              height:'70%'
            },
            height:dimensions.height,
            width:dimensions.width
          };
      
          var chart = new google.visualization.BubbleChart(document.getElementById(container));  
          chart.draw(dataTable, options); 

        })
        .catch(err => console.log(err));
    }); 
  
  }

function plotView2(year, industry, container, dimensions) {
  google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': GOOGLE_API
  });

  google.charts.setOnLoadCallback(() => {    
    let dataTable = new google.visualization.DataTable();

    loadData(APP_BASEURL.concat(`/states_chlorpleth/${sliderYear}/${industrySelection}`))
      .then(data => {
        dataTable.addColumn('string', 'State');
        dataTable.addColumn('number', 'Employment');
        
        data.forEach(item => {
          dataTable.addRow([item.state, Number(item.jobs)]);
        });
    
        var options = {
          colorAxis: {colors: ['#6e679e']},
            backgroundColor: { fill: 'transparent' },
            region: "US",        
            resolution: "provinces",
            animation: defaultAnimation,
            height:dimensions.height,
            width:dimensions.width        
          };
    
    
        var chart = new google.visualization.GeoChart(document.getElementById(container));
    
        chart.draw(dataTable, options);
    

      })
      .catch(err => console.log(err));



  });    
}

function plotView3(year, container, dimensions) {

    google.charts.load("current", {packages:["corechart", "bar"]});
    google.charts.setOnLoadCallback(() => {

      loadData(APP_BASEURL.concat(`/bar_graph/${sliderYear}`))
        .then(data => {
          let dataTable = new google.visualization.DataTable();

          dataTable.addColumn('string', 'Industry');    
          
          data[0].education.forEach(item => dataTable.addColumn('number', item.education_level));
          data.forEach(industry => {
            let values = [];

            industry.education.forEach(item => {
              values.push(Number(item.number_employed));
            }); 
            
            //dataTable.addRow([industry.industry, values[0], values[1], values[2], values[3]]);
            dataTable.addRow([industry.industry, values[0], values[1], values[2]]);
          });

          let options = {
            isStacked: true,
            fontSize:12,
            backgroundColor: { fill:'transparent' },
            hAxis: {
              title: 'Education Level',
              minValue: 0
            },
            vAxis: {
              title: 'Industry'
            },            
            animation: defaultAnimation,
            height:dimensions.height,
            width:dimensions.width,  
            series: {
              0:{color:'#353052'},
              1:{color:'#6e679e'},
              2:{color:'#dbd8ed'},
              3:{color:'gray'}
            }
          };
      
          var chart = new google.visualization.BarChart(document.getElementById(container));
    
          chart.draw(dataTable, options);     

        })
        .catch(err => console.log(err));
  
    });   
}

function plotView4(year, container_left, container_right, dimensions, industry) {
    
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(() => {

      loadData(APP_BASEURL.concat(`/gender_pie/${sliderYear}/${industrySelection}`))
        .then(data => {
          let dataTable = new google.visualization.DataTable();

          dataTable.addColumn('string', 'Gender');
          dataTable.addColumn('number', 'Employment');

          Object.keys(data).forEach(item => {
            dataTable.addRow([item, Number(data[item])]);
          });
            
          let options = {
            title: 'Gender',
            legend: 'none',
            pieSliceText: 'label',
            pieStartAngle: 100,
            slices : { 0: { 
                            offset: 0.1,
                            color: '#6e679e'
                          },
                       1: {
                         color: '#353052'
                       }
                     },
            backgroundColor: { fill:'transparent' },
            animation: defaultAnimation,
            height:dimensions.height,
            width:dimensions.width
          };      
      
          let chart = new google.visualization.PieChart(document.getElementById(container_left));
          chart.draw(dataTable, options);

        })
        .catch(err => console.log(err));
    });


    google.charts.setOnLoadCallback(() => {

      loadData(APP_BASEURL.concat(`/race_pie/${sliderYear}/${industrySelection}`))
        .then(data => {
          let dataTable = new google.visualization.DataTable();

          dataTable.addColumn('string', 'Race');
          dataTable.addColumn('number', 'Employment');

          Object.keys(data).forEach(item => {
            dataTable.addRow([item, Number(data[item])]);
          });          
    
          let options = {
            title: 'Race',
            legend: {
              position: 'right'
            },
            pieSliceText: 'label',
            slices: {
              0: {           
                color: '#6e679e'
              },
              1: {
                color: '#353052'
              }, 
              2: {
                color: '#dbd8ed'
              }, 
              3: {
                color: 'gray'
              }
            },
            pieStartAngle: 100,
            backgroundColor: { fill: 'transparent' },
            animation: defaultAnimation,
            height:dimensions.height,
            width:dimensions.width
        };      
      
          let chart = new google.visualization.PieChart(document.getElementById(container_right));
          chart.draw(dataTable, options);
        })
        .catch(err => console.log(err));
    });    


}

function plotSummary() {

    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(() => {

      loadData(APP_BASEURL.concat(`/summary`))
        .then(data => {
          let dataTable = new google.visualization.DataTable();
          let yearsRange = new Set(data.map(item => item.year));
          let industries = new Set(data.map(item => item.Industry));

          dataTable.addColumn('string', 'Year');          
          industries.forEach(industry => dataTable.addColumn('number', industry));

          
          
          
          //yearsRange.forEach(item => dataTable.addRow([String(item), getRandomInt(0, 1000), getRandomInt(0, 5000),getRandomInt(0, 5000), getRandomInt(0, 5000), getRandomInt(0, 5000) ]));
      
            let options = {
                title: 'Employment ratio changes over time',
                vAxis: {title: 'Employment Ratio'},
                backgroundColor: { fill: 'transparent' },
                animation: defaultAnimation,
                height: 500,
                width: 1000,
                isStacked: true,
                connectSteps: false,
                colors: ['#353052', '#6e679e', '#dbd8ed', 'gray']
            };
      
          var chart = new google.visualization.SteppedAreaChart(document.getElementById('summary_plot'));
    
          chart.draw(dataTable, options);  
        })
        .catch(err => console.log(err));

    });


    $("#summarymodal").modal('show'); 
}

$( document ).ready(() => {
  refresh();
})