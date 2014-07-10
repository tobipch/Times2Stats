$(document).ready(function(){
    //Trigge on "Go Graph"-Button-Click
    $("#graphBtn").click(function(){
        
        var timeArr = $("#timeInput").val().replace(/\s+/g, '').split(",").map(function(el){return parseFloat(el)});
        console.log(timeArr);
        
        switch($("#chartSelection")[0].value){
            case "linechart":
                createLineGraph(timeArr);
        }
    });
    
    //Attach fancySelect Function to Select-Items
    $("#chartSelection").fancySelect();
    $("#themeSelection").fancySelect();
    
    //Create a Line Graph
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
});


function changeTheme(){
    var filename = $("#themeSelection")[0].value;
    var fileref = document.createElement("link");
    fileref.setAttribute("rel","stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", "css/themes/"+filename+"/"+filename+".css");
    document.getElementsByTagName("head")[0].appendChild(fileref);
}