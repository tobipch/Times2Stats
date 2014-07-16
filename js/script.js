/*-------------------------*/
/////////////////////////////
///////DOCUMENT START////////
/////////////////////////////
/*-------------------------*/
$(document).ready(function(){
    //Load chosen Theme from localstorage
    var storedTheme = localStorage.getItem("chosenTheme");
    changeTheme(storedTheme);
    $("#themeSelection").val(storedTheme);
    
    //Load Default Chart Options
    setDefaultOptions();
    
    //Trigger on "Go Graph"-Button-Click
    $("#graphBtn").click(displayGraph);
    $("#sampleDataBtn").click(sampleData);
    $("#chartContainer").dblclick(toggleFullscreen);
    
    //Attach fancySelect Function to Select-Items
    $("#chartSelection").fancySelect();
    $("#themeSelection").fancySelect();
});

////Change Theme Function////
function changeTheme(themeName){
    var filename = themeName || $("#themeSelection")[0].value;
    var fileref = document.createElement("link");
    fileref.setAttribute("rel","stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", "css/themes/"+filename+"/"+filename+".css");
    document.getElementsByTagName("head")[0].appendChild(fileref);
    localStorage.setItem("chosenTheme",filename);
}

////Input Sample Data////
function sampleData(){
    document.getElementById("timeInput").value = "";
    var sampleData = "";
    for(var i=0;i<=100;i++){
        var randNum = ((Math.random()*20)+1).toFixed(2);
        sampleData += randNum.toString() + ", ";
    }
    sampleData = sampleData.substring(0, sampleData.length - 2);
    document.getElementById("timeInput").value = sampleData;
}

/*-------------------------*/
/////////////////////////////
///////GRAPH-FUNCTIONS///////
/////////////////////////////
/*-------------------------*/

////Global Variables////
var chart;
var chartHeight;
var fullscreen = false;


////Display Graph////
function displayGraph(event){
    event.preventDefault();
    
    var timeArr = $("#timeInput").val().replace(/\s+/g, '').split(",").map(function(el){return parseFloat(el)});
    
    switch($("#chartSelection")[0].value){
        case "linechart":
            createLineGraph(timeArr);
            break;
        case "scatterplot":
            createScatterPlot(timeArr);
            break;
        case "barchart":
            createBarChart(timeArr);
            break;
        default:
            createLineGraph(timeArr);
            break;
    }
    
    chart = $('#chartContainer').highcharts();
}

////Fullscreen the Graph////
function toggleFullscreen(){
    if(!fullscreen){
        chartHeight = chart.chartHeight;
        chart.setSize(
           $(document).width(), 
           $(document).height(),
           false
        );
        $("#chartContainer").css("position", "absolute").css("top","0px").css("margin","0%");
        $(".highcharts-container").css("margin","0%");
        $(".highcharts-container svg").css("margin","0%");
        
        fullscreen = true;
    }
    else if(fullscreen){
        chart.setSize(
           $(document).width()/100*60, 
           chartHeight,
           false
        );
        $("#chartContainer").css("position", "").css("top","").css("margin","");
        $(".highcharts-container").css("margin","0% auto");
        $(".highcharts-container svg").css("margin","");
        
        fullscreen = false;
    }
}


////The DEFAULT-Chart////
function setDefaultOptions(){
    Highcharts.setOptions({
        chart: {
            renderTo: "chartContainer",
            style: {
                fontFamily: "OpenSans_Regular",
                margin: "1.5% auto",
                overflow: "auto !important",
            },
            width: ($(document).width()/100*60),
            backgroundColor: "#1A222F",
            spacing: [30,20,20,20]
        },

        colors: ["#00CF99", "#B2E097"],

        title: {text: ""},

        subtitle: {text: "Double-Click for Fullscreen"},

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        }
    });
}

function createLineGraph(timeArr){
    $("#chartContainer").highcharts({
        chart: {
            type: "line"
        },

        yAxis: {
            title:{
                text: "Times"
            }
        },

        xAxis: {
            title:{
                text: "Solve (Nr.)"
            }
        },

        series:[{
            data: timeArr
        }]
    });
}

////Create a SCATTERCHART////
function createScatterPlot(timeArr){
    $("#chartContainer").highcharts({
        chart: {
            type: "scatter",
        },
        
        xAxis: {
            title:{
                text: "SolveNr"
            }
        },
        
        yAxis: {
            title:{
                text: "Time"
            }
        },

        series:[{
            data: timeArr
        }]
    });
}


////Create a BARCHART////
function createBarChart(timeArr){
    var maxNum = Math.max.apply(null, timeArr);
    var minNum = Math.min.apply(null, timeArr);
    var diff = Math.round(maxNum-minNum);
    var divisor = Math.pow(10,(diff).toString().length-1);
    var roundedDiff = Math.ceil(diff / divisor) * divisor;
    var roundedMin = Math.floor(minNum / divisor) * divisor;
    var roundedMax = Math.ceil(maxNum / divisor) * divisor;
    var numSolves = timeArr.length;
    var stepNums = [];
    var steps = [];
    
    for(var i=0;i<=5;i++){
        var step = roundedMin+(roundedDiff / 5 * i);
        if(step%1!=0)step = step.toFixed(2);
        stepNums.push(step);
    }
    
    for(var i=0;i<5;i++){
        var key = stepNums[i].toString() + " - " + stepNums[i+1].toString();
        steps[i] = key;
    }
    
    timeData = [];
    for(var i=0;i<5;i++){
        var name = steps[i];
        var numTimes = 0;
        for(index in timeArr){
            var el = timeArr[index];
            if(el>=stepNums[i]&&el<stepNums[i+1] || el==stepNums[i])numTimes++;
        }
        timeData.push([name, numTimes]);
        numTimes = 0;
    }
    
    
    $("#chartContainer").highcharts({
        chart: {
            type: "column",
        },

        xAxis: {
            title:{
                text: "Time Range"
            },
            type: "category"
        },
        
        yAxis: {
            title:{
                text: "Number of solves in range"
            }
        },
                
        series:[{
            data: timeData
        }]
    });  
}