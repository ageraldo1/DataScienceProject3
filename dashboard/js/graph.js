function plotTS() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    // education
    // Incoming
    // Age ranges
    // Gender
    // Race

    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['Year', 'Jobs Created', 'Jobs Lost'],
        ['1970',  1000,      400],
        ['1980',  1170,      460],
        ['1990',  660,       1120],
        ['2000',  1030,      540],        
        ['2004',  1000,      400],
        ['2005',  1170,      460],
        ['2006',  660,       1120],
        ['2007',  1030,      540]
      ]);

      var options = {
        title: 'Jobs Numbers overtime',
        subtitle: 'From 1950 - 2016',
        width: 600,
        height: 400,
        
        curveType: 'function',
        legend: { position: 'bottom' },
        backgroundColor: { fill:'transparent' }
      };


      let chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

      chart.draw(data, options);
    }    
}

function plotGeoMap(year) {
  google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': GOOGLE_API
  });

  google.charts.setOnLoadCallback(() => {    
    let dataTable = new google.visualization.DataTable();
        
    dataTable.addColumn('string', 'State');
    dataTable.addColumn('number', 'Employment');
    //dataTable.addColumn('number', 'UnEmployment');
    
    let states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois", "Virginia"];
    states.forEach(item => {
      dataTable.addRow([item, getRandomInt(1, 100)]);          
    });     

    var options = {
      colorAxis: {colors: ['blue']},
       // width: 600,
       // height: 400,
        backgroundColor: { fill: 'transparent' },
        region: "US",        
        resolution: "provinces",
        animation: {
          "startup": true,
          duration: 2000,
          easing: 'out'
        }
        //displayMode: 'markers'   
  
      };


    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(dataTable, options);

  });

}

function plotPie(year) {
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(() => {

      let dataTable = new google.visualization.DataTable();

      dataTable.addColumn('string', 'Gender');
      dataTable.addColumn('number', 'Employment');

      dataTable.addRow(['Male', getRandomInt(0, 1000)]);
      dataTable.addRow(['Female', getRandomInt(0, 1000)]);

      let options = {
        title: 'Employment',
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
        animation: {
          "startup": true,
          duration: 2000,
          easing: 'out'
        }  
      };      
  
      let chart = new google.visualization.PieChart(document.getElementById('view4_left'));
      chart.draw(dataTable, options);
    });


    google.charts.setOnLoadCallback(() => {

      let dataTable = new google.visualization.DataTable();

      dataTable.addColumn('string', 'Gender');
      dataTable.addColumn('number', 'Unemployment');

      dataTable.addRow(['Male', getRandomInt(0, 1000)]);
      dataTable.addRow(['Female', getRandomInt(0, 1000)]);

      let options = {
        title: 'UnEmployment',
        legend: 'none',
        pieSliceText: 'label',
        slices: {
          0: {
            offset: 0.1,
            color: '#6e679e'
          },
          1: {
            color: '#353052'
          }
        },
        pieStartAngle: 100,
        backgroundColor: { fill: 'transparent' },
        animation: {
          "startup": true,
          duration: 2000,
          easing: 'out'
        }
      };      
  
      let chart = new google.visualization.PieChart(document.getElementById('view4_right'));
      chart.draw(dataTable, options);
    });    
}


function plotBars(year) {
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(() => {

      let dataTable = new google.visualization.DataTable();
      
      dataTable.addColumn('string', 'City');
      dataTable.addColumn('number', '2010 Population');
      dataTable.addColumn('number', '2000 Population');

      dataTable.addRow(['New York City, NY', getRandomInt(0, 100), getRandomInt(0, 1000)]);
      dataTable.addRow(['Los Angeles, CA', getRandomInt(0, 100), getRandomInt(0, 1000)]);
      dataTable.addRow(['Chicago, IL', getRandomInt(0, 100), getRandomInt(0, 1000)]);
      dataTable.addRow(['Houston, TX', getRandomInt(0, 100), getRandomInt(0, 1000)]);
      dataTable.addRow(['Philadelphia, PA', getRandomInt(0, 100), getRandomInt(0, 1000)]);

    
      let options = {
        title: 'Population of Largest U.S. Cities',
        //chartArea: {width: '50%'},
        isStacked: true,
        backgroundColor: { fill:'transparent' },
        hAxis: {
          title: 'Total Population',
          minValue: 0,
        },
        vAxis: {
          title: 'City'
        },
        animation: {
          "startup": true,
          duration: 2000,
          easing: 'out'
        },        
      };
      var chart = new google.visualization.BarChart(document.getElementById('bars_chart'));
      chart.draw(dataTable, options);


    });
    
}

function plotBubbleChart(year) {  
  google.charts.load("current", {packages:["corechart"]});
  google.charts.setOnLoadCallback(() => {

    let dataTable = new google.visualization.DataTable();
    
    dataTable.addColumn('string', 'Industry');    
    dataTable.addColumn('number', 'Total Employment');
    dataTable.addColumn('number', 'Average Income');
    dataTable.addColumn('number', 'Average Age');

    dataTable.addRow(['Agriculture', getRandomInt(0, 100), getRandomInt(0, 1000), getRandomInt(18, 70)]);
    dataTable.addRow(['Manufacturing', getRandomInt(0, 100), getRandomInt(0, 1000), getRandomInt(18, 70)]);
    dataTable.addRow(['Business', getRandomInt(0, 100), getRandomInt(0, 1000), getRandomInt(18, 70)]);
    dataTable.addRow(['Professional', getRandomInt(0, 100), getRandomInt(0, 1000), getRandomInt(18, 70)]);
    dataTable.addRow(['Public', getRandomInt(0, 100), getRandomInt(0, 1000), getRandomInt(18, 70)]); 


    let options = {
      //title: 'Correlation between employment, income and age accross industries',
      //titleTextStyle: {
      //  fontSize : 16,
      //  bold: true
      //},
      hAxis: {title: 'Employment', bold: true},
      vAxis: {title: 'Average Incoming'},
      backgroundColor: { fill:'transparent' },
      colorAxis: {colors: ['#6F6EA0']},
      bubble: {
        textStyle: {
          auraColor: 'none'
        },
        opacity: 0.5,        
      },
      animation: {
        "startup": true,
        duration: 2000,
        easing: 'out'
      },
      chartArea : {
        width:'85%',
        height:'70%'
      }      
    };

    var chart = new google.visualization.BubbleChart(document.getElementById('curve_chart'));

    chart.draw(dataTable, options);    


  });



}


function plotComboChart(year) {

  google.charts.load("current", {packages:["corechart", "bar"]});
  google.charts.setOnLoadCallback(() => {

    let dataTable = new google.visualization.DataTable();
    
    dataTable.addColumn('string', 'Industry');    
    dataTable.addColumn('number', 'None');    
    dataTable.addColumn('number', 'Minimum');    
    dataTable.addColumn('number', 'College');    
    dataTable.addColumn('number', 'Higher'); 


    dataTable.addRow(['Agriculture', getRandomInt(0, 500), getRandomInt(0, 1000), getRandomInt(0, 2000),  getRandomInt(0, 100)]);
    dataTable.addRow(['Manufacturing', getRandomInt(0, 500), getRandomInt(0, 1000), getRandomInt(0, 2000),  getRandomInt(0, 100)]);
    dataTable.addRow(['Business', getRandomInt(0, 500), getRandomInt(0, 1000), getRandomInt(0, 2000),  getRandomInt(0, 100)]);
    dataTable.addRow(['Professional', getRandomInt(0, 500), getRandomInt(0, 1000), getRandomInt(0, 2000),  getRandomInt(0, 100)]);
    dataTable.addRow(['Public', getRandomInt(0, 500), getRandomInt(0, 1000), getRandomInt(0, 2000),  getRandomInt(0, 100)]);


    let options = {
      isStacked: true,
      backgroundColor: { fill:'transparent' },
      hAxis: {
        title: 'Education Level',
        minValue: 0,
      },
      vAxis: {
        title: 'Industry'
      },            
      animation: {
        "startup": true,
        duration: 2000,
        easing: 'out'
      },
      height: 400,
      series: {
        0:{color:'#353052'},
        1:{color:'#6e679e'},
        2:{color:'#dbd8ed'},
        3:{color:'gray'}
      }
    };

    var chart = new google.visualization.BarChart(document.getElementById('piechart_3d'));

    chart.draw(dataTable, options);   
  });  

}



function plotVerticalBars(year) {

  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(() => {

    let dataTable = new google.visualization.DataTable();
    
    dataTable.addColumn('string', 'Industry');
    dataTable.addColumn('number', 'Employment');
    dataTable.addColumn('number', 'Un');

    dataTable.addRow(['New York City, NY', getRandomInt(0, 100), getRandomInt(0, 1000)]);
    dataTable.addRow(['Los Angeles, CA', getRandomInt(0, 100), getRandomInt(0, 1000)]);
    dataTable.addRow(['Chicago, IL', getRandomInt(0, 100), getRandomInt(0, 1000)]);
    dataTable.addRow(['Houston, TX', getRandomInt(0, 100), getRandomInt(0, 1000)]);
    dataTable.addRow(['Philadelphia, PA', getRandomInt(0, 100), getRandomInt(0, 1000)]);

  
    let options = {
      title: 'Population of Largest U.S. Cities',
      //chartArea: {width: '50%'},
      isStacked: true,
      backgroundColor: { fill:'transparent' },
      hAxis: {
        title: 'Total Population',
        minValue: 0,
      },
      vAxis: {
        title: 'City'
      },
      animation: {
        "startup": true,
        duration: 2000,
        easing: 'out'
      },        
    };
    var chart = new google.visualization.BarChart(document.getElementById('bars_chart'));
    chart.draw(dataTable, options);


  });

}


function createFilters(period) {
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

  let gauge_education = new JustGage({
    id: "gauge_education",
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

      toggleSpinner(500);
        gauge_income.refresh(getRandomInt(0, 100));
        gauge_employment.refresh(getRandomInt(0, 100));
        gauge_education.refresh(getRandomInt(0, 100));
      
        plotGeoMap(data.from_value);
        plotBubbleChart(data.from_value);
        plotPie(data.from_value);
        plotBars(data.from_value);
      toggleSpinner(0);        
    }
  });  
}

function refresh() {
    // loadData

    toggleSpinner(1500);
        createFilters([1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2005, 2010, 2015, 2017]);      


        plotGeoMap();
        plotBubbleChart();        
        plotComboChart();
        plotPie();
    
    toggleSpinner(0);        

}
