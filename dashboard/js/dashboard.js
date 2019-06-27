let firstLoad = true;
var sliderYear;

const defaultAnimation = {
    'startup': true,
    duration: 2000,
    easing: 'out'    
}

const defaultDimensions = {
    height: 350,
    width: 700
}

function refresh() {
    let yearsRange = [1970, 1980, 1990, 2000, 2005, 2010, 2015, 2017];

    toggleSpinner(1500, true);

        if (firstLoad) {
            createMainFilters(yearsRange);
            sliderYear = Math.min(...yearsRange);           

            for (i = 1; i < 4; i++) {
                let row = document.querySelector(`#row${i}`);
                row.classList.remove('d-none');
            }

            firstLoad = false;
        }

        plotView1(sliderYear, 'view1_plot', defaultDimensions);     
        plotView2(sliderYear, document.querySelector('#selectIndustry').selectedIndex, 'view2_plot', defaultDimensions);
        plotView3(sliderYear, 'view3_plot', defaultDimensions);     
        plotView4(sliderYear, 'view4_left', 'view4_right', {height: 350, width: 350});

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
  
          gauge_income.refresh(getRandomInt(0, 100));
          gauge_employment.refresh(getRandomInt(0, 100));
          gauge_unemployment.refresh(getRandomInt(0, 100));

          sliderYear = data.from_value;          
          refresh();        
      }
    });  
  }

function plotView1(year, container, dimensions) {
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
        animation: defaultAnimation,
        chartArea : {
          width:'85%',
          height:'70%'
        },
        height:dimensions.height,
        width:dimensions.width
      };
  
      console.log(document.getElementById(container));

      var chart = new google.visualization.BubbleChart(document.getElementById(container));  
      chart.draw(dataTable, options);      
    });
  
  
  }

function plotView2(year, industry, container, dimensions) {
    google.charts.load('current', {
        'packages':['geochart'],
        'mapsApiKey': GOOGLE_API
  });

  google.charts.setOnLoadCallback(() => {    
    let dataTable = new google.visualization.DataTable();
        
    dataTable.addColumn('string', 'State');
    dataTable.addColumn('number', 'Employment');
    
    let states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois", "Virginia"];
    states.forEach(item => {
      dataTable.addRow([item, getRandomInt(1, 100)]);          
    });     

    var options = {
      colorAxis: {colors: ['blue']},
        backgroundColor: { fill: 'transparent' },
        region: "US",        
        resolution: "provinces",
        animation: defaultAnimation,
        height:dimensions.height,
        width:dimensions.width        
      };


    var chart = new google.visualization.GeoChart(document.getElementById(container));

    chart.draw(dataTable, options);

  });    
}

function plotView3(year, container, dimensions) {

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
    });   
}

function plotView4(year, container_left, container_right, dimensions) {
    
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
        animation: defaultAnimation,
        height:dimensions.height,
        width:dimensions.width
      };      
  
      let chart = new google.visualization.PieChart(document.getElementById(container_left));
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
        animation: defaultAnimation,
        height:dimensions.height,
        width:dimensions.width
    };      
  
      let chart = new google.visualization.PieChart(document.getElementById(container_right));
      chart.draw(dataTable, options);
    });    


}

function plotSummary() {

    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(() => {
  
      let dataTable = new google.visualization.DataTable();

      let yearsRange = [1970, 1980, 1990, 2000, 2005, 2010, 2015, 2017];
      
      dataTable.addColumn('string', 'Year');    
      dataTable.addColumn('number', 'Agriculture');    
      dataTable.addColumn('number', 'Manufacturing');    
      dataTable.addColumn('number', 'Business');    
      dataTable.addColumn('number', 'Professional');    
      dataTable.addColumn('number', 'Public');    
  
      yearsRange.forEach(item => dataTable.addRow([String(item), getRandomInt(0, 1000), getRandomInt(0, 5000),getRandomInt(0, 5000), getRandomInt(0, 5000), getRandomInt(0, 5000) ]));
  
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
    });   

    $("#summarymodal").modal('show'); 
}