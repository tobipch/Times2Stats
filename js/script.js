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
    
    //Trigger on "Go Graph"-Button-Click
    $("#graphBtn").click(displayGraph);
    
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

/*-------------------------*/
/////////////////////////////
///////GRAPH-FUNCTIONS///////
/////////////////////////////
/*-------------------------*/

////Display Graph////
function displayGraph(event){
    event.preventDefault();
    
    var timeArr = $("#timeInput").val().replace(/\s+/g, '').split(",").map(function(el){return parseFloat(el)});
    
    console.log($("#chartSelection")[0].value);
    
    switch($("#chartSelection")[0].value){
        case "linechart":
            createLineGraph(timeArr);
            break;
        case "scatterplot":
            createScatterPlot(timeArr);
            break;
    }
}

////Create a LINEGRAPH////
function createLineGraph(timeArr){
    $("#chartContainer").highcharts({
        chart: {
            type: "line",
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

        colors: ["#00CF99", "B2E097"],

        title: {
            text: ""
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
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

        title: {
            text: ""
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
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