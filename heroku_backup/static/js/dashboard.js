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
      value: 21217.5,
      min: 0,
      max: 100000,
      title: "Income",
      levelColorsGradient: true,
      counter: true,
      gaugeWidthScale: 0.7,
      hideInnerShadow: true,
      formatNumber: true,
      levelColors: ["#6F6EA0"],
      humanFriendly: true,
      titleFontColor: 'black',
      valueFontColor: 'black'
    });
  
    let gauge_employment = new JustGage({
      id: "gauge_employment",
      value: 96,
      min: 0,
      max: 100,
      title: "Employment Rate",
      levelColorsGradient: true,
      counter: true,
      gaugeWidthScale: 0.7,
      hideInnerShadow: true,
      formatNumber: true,
      levelColors: ["#6F6EA0"],
      symbol: '%',
      titleFontColor: 'black',
      valueFontColor: 'black'
    });  
  
    let gauge_unemployment = new JustGage({
      id: "gauge_unemployment",
      value: 4,
      min: 0,
      max: 100,
      title: "Unemployment Rate",
      levelColorsGradient: true,
      counter: true,
      gaugeWidthScale: 0.7,
      hideInnerShadow: true,
      formatNumber: true,
      levelColors: ["#6F6EA0"],
      symbol: '%',
      titleFontColor: 'black',
      valueFontColor: 'black'
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

        loadData(APP_BASEURL.concat(`/income_kpi/${sliderYear}`))
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
              title: '# of People Employed', 
              bold: true,
              format: 'decimal',
              textStyle: {
                fontSize: 12
              },
              textPosition : 'out'
            },
            vAxis: {
              title: 'Median Income',
              textStyle : {
                fontSize: 12
              },
              textPosition : 'out',
              format : 'short'

            },
            backgroundColor: { 
              fill:'transparent' 
            },            
            colorAxis: {colors: ['#6F6EA0']},
            bubble: {
              textStyle: {
                auraColor: 'none',
                bold: true,
                color: 'black'
              },
              opacity: 0.5,        
            },
            animation: defaultAnimation,
            chartArea : {
              width:'80%',
              height:'70%'
            },
            height:dimensions.height,
            width:dimensions.width,
            title : 'Median Age',
            titleTextStyle : {
              fontSize: 12,
              bold: false
            }
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
        dataTable.addColumn('number', '# people employ');
        
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

          if (industrySelection === '1') {
            options.colorAxis = { colors : ['green']};
            
          } else if (industrySelection === '3') {
            options.colorAxis = { colors : ['blue']};

          } else if (industrySelection === '4') {
            options.colorAxis = { colors : ['orange']};

          } else if (industrySelection === '5') {
            options.colorAxis = { colors : ['red']};
          }
    
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

            values.push(industry.industry);

            industry.education.forEach(item => {
              values.push(Number(item.number_employed));
            }); 

            dataTable.addRow(values);
          });

          let options = {
            isStacked: true,
            fontSize:12,
            backgroundColor: { fill:'transparent' },
            hAxis: {
              title: '# of Highest Level of Education Attained',
              minValue: 0, 
              maxValue: 2000000
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
              position : 'right'
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

          let industries = new Set(data.map(item => item.Industry));
          let yearsRange = new Set(data.map(item => item.year)); 
          let avg_change = [];         

          dataTable.addColumn('string', 'Year');          
          industries.forEach(industry => dataTable.addColumn('number', industry));

          yearsRange.forEach(year => {
            let values = [];           
            values.push(year);

            industries.forEach(industry => {              
              values.push(data.find(item => item.year === year && item.Industry === industry).employment_rate);
            });

            dataTable.addRow(values);
          });

          for (let i = 0; i < dataTable.getNumberOfRows(); i++) {
            for (let y = 1; y < dataTable.getNumberOfColumns(); y++) {

              let percent_change = avg_change.find(item => item.industry === dataTable.getColumnLabel(y))

              if (percent_change) {
                percent_change.difference.push(dataTable.getValue(i, y) - percent_change.previous);
                percent_change.previous = dataTable.getValue(i, y);

              } else {
                avg_change.push({
                  'industry':  dataTable.getColumnLabel(y),
                  'previous': dataTable.getValue(i, y),
                  'difference': []
                });
              }
            }
          }


          let options = {
              title: 'Employment rates over time',
              vAxis: {
                title: 'Employment rate (%)',
                textStyle : {
                  fontSize:12,
                  bold: true                    
                },
                format: 'percent',
                textPosition: 'out',
                titleTextStyle : {
                  fontSize: 12,
                  bold: true
                },
                minValue:0                  
              },
              backgroundColor: { fill: 'transparent' },
              legend : {
                position:'right',
                textStyle: {
                  fontSize:12,
                  bold: false
                }

              },
              hAxis: {
                textStyle : {
                  fontSize:10
                }
              },
              animation: defaultAnimation,
              height: 500,
              width: 1050,
              isStacked: true,
              connectSteps: true,
              colors: ['#353052', '#6e679e', '#dbd8ed', 'gray']               
          };
      
          var chart = new google.visualization.SteppedAreaChart(document.getElementById('summary_plot'));
              
          chart.draw(dataTable, options);
          
          let industryIndex = 1;

          console.log(avg_change);

          avg_change.forEach(item => {
            let industry = document.querySelector(`#industry_name_${industryIndex}`);
            let change = document.querySelector(`#industry_value_${industryIndex}`);

            industry.textContent = item.industry;
            change.textContent = `${(item.difference.reduce((a,b) => a+b,0) / item.difference.length).toFixed(2)} %`;

            industryIndex++;

          })
        })
        .catch(err => console.log(err));

    });


    $("#summarymodal").modal('show'); 
}

$( document ).ready(() => {
  refresh();
})