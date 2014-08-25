////Global Variables////
var chart;
var chartHeight;
var fullscreen = false;
var timeArr = [];

////Prototype-Functions////
Array.prototype.getTimeArr = function(){
    var newArr = [];
    for(var i=0;i<this.length;i++){
        if(this[i] != 0 && this[i] != "DNF" && !/(\d{1,2}:)?\d{1,2}(.\d{1,2})?\+2?/.test(this[i])){
            newArr.push(this[i]);
        }
        else if(/\d{1,}.\d{1,}\+2?/.test(this[i])){
            newArr.push(parseFloat(this[i].replace(/\+2?/,""),10)+2);
        }
    }
    return newArr;      
}

/*-------------------------*/
/////////////////////////////
///////DOCUMENT START////////
/////////////////////////////
/*-------------------------*/
$(document).ready(function(){
    //Load chosen Theme from localstorage if any ; else select default theme
    var defaultTheme = "soulless";
    var storedTheme = localStorage.getItem("chosenTheme");
    if(storedTheme==null){
        changeTheme(defaultTheme);
        $("#themeSelection").val(defaultTheme);
    }
    else{
        changeTheme(storedTheme);
        $("#themeSelection").val(storedTheme);
    }
    
    getTimeArr();
    updateStats();
    
    //Initialize Tooltips
    $("[data-toggle='tooltip']").tooltip({
        placement: "left",
        delay: {
            show: 400,
            hide: 50
        }
    });
    
    //Load Default Chart Options
    setDefaultOptions();
    
    //Render Triggers
    $("#graphBtn").click(displayGraph);
    $("#sampleDataBtn").click(sampleData);
    $("#chartContainer").dblclick(toggleFullscreen);
    $("#statTabLink").click(function(){
        getTimeArr();
        updateStats();
    });
    $("#timeInput").on("change keydown paste mouseup",function(){
        setTimeout(function(){
            getTimeArr();
            updateStats();
        },5);
    });
    
    //Attach fancySelect Function to Select-Items
    $("#themeSelection").fancySelect();
    $("#chartSelection").fancySelect();
    $("#rangeSelection").fancySelect();
});


/*-------------------------*/
/////////////////////////////
/////ESSENTIAL FUNCTIONS/////
/////////////////////////////
/*-------------------------*/
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
    for(var i=0;i<150;i++){
        var randNum = ((Math.random()*20)+10).toFixed(2);
        sampleData += randNum.toString() + ", ";
    }
    sampleData = sampleData.substring(0, sampleData.length - 2);
    document.getElementById("timeInput").value = sampleData;
}

////Get Times from Input Area////
function getTimeArr(){
    //Get Times and put them in an Array
    timeArr = $("#timeInput").val().replace(/\s+/g, '').split(",").map(function(el){
        
        if(/dnf/ig.test(el)) return "DNF";
        
        else if(/(\d{1,2}:)?\d{1,2}(.\d{1,2})?\+2?/.test(el)){
            if(/\d{1,2}:\d{1,2}.\d{1,2}/.test(el)){
                var tempStr = el.replace(/\+2?/,"");
                return minToSec(el)+"+2";
            }
            else{
                return el;
            }
        }
        
        else if(/\d{1,2}:\d{1,2}.\d{1,2}/.test(el))return parseFloat(minToSec(el));
        
        else {return parseFloat(el)}
        
    });
    
    //Delete Comma at the end if there is one
    if(isNaN(timeArr[timeArr.length-1]) && typeof timeArr[timeArr.length-1]!="string")timeArr.pop();
}

////Convert minutes to seconds////
function minToSec(minInput){
    if(/(\d{1,2}:){2}(\d{1,2}.)(\d{1,2})/.test(minInput)){
        var parts = minInput.split(':'),
        hours = +parts[0],
        minutes = +parts[1],
        seconds = +parts[2];
        return (hours * 3600 + minutes * 60 + seconds).toFixed(2);
    }
    else{
        var parts = minInput.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
        return (minutes * 60 + seconds).toFixed(2);
    }
}

////Format inputted seconds to a nice time display////
function formatTime(seconds){
    var hours = Math.floor(seconds/3600);
    var minutes = Math.floor((seconds-hours*3600)/60);
    var seconds = (seconds - hours*3600 - minutes*60).toFixed(2);
    var res = "";
    
    if(hours > 0)res += hours.toString() + "h, ";
    
    if(minutes > 0)res += minutes.toString() + "m ";
    
    if(minutes>0)res+="and ";
    res += seconds.toString() + "s";
    
    return res;
}

/*-------------------------*/
/////////////////////////////
/////STATISTIC-FUNCTIONS/////
/////////////////////////////
/*-------------------------*/
////Update all Statistics////
function updateStats(){
    $("#stats_numSolves").text(getNumSolves().toString());
    $("#stats_bestTime").text(getBestTime().toString());
    $("#stats_worstTime").text(getWorstTime().toString());
    $("#stats_numDNF").text(getNumDNF().toString());
    $("#stats_numPlusTwo").text(getNumberPlusTwo().toString());
    
    $("#stats_avgTotal").text(getTotalAverage().toString());
    $("#stats_meanTotal").text(getTotalMean().toString());
    $("#stats_medianTotal").text(getTotalMedian().toString());
    $("#stats_varianceTotal").text(getTotalVariance().toString());
    $("#stats_standardDeviation").text(getTotalStandardDeviation().toString());    
    $("#stats_totalTime").text(getTotalTime());
    
    $("#stats_avg3Best").text(getAverage(3,true));
    $("#stats_avg3Worst").text(getAverage(3,false));
    $("#stats_avg5Best").text(getAverage(5,true));
    $("#stats_avg5Worst").text(getAverage(5,false));
    $("#stats_avg12Best").text(getAverage(12,true));
    $("#stats_avg12Worst").text(getAverage(12,false));
    $("#stats_avg100Best").text(getAverage(100,true));
    $("#stats_avg100Worst").text(getAverage(100,false));
}

////Get Total Number of Solves////
function getNumSolves(){
    return timeArr.length;
}

////Get Lowest Time of All////
function getBestTime(raw){
    var newTimeArr = timeArr.getTimeArr(true);
    if(newTimeArr.length==0)return formatTime(0);
    var res = Math.min.apply(null, newTimeArr);
    return raw?res:formatTime(res);
}

////Get Highest Time of All////
function getWorstTime(){
    var newTimeArr = timeArr.getTimeArr(true);
    if(newTimeArr.length==0)return formatTime(0);
    return formatTime(Math.max.apply(null, newTimeArr));
}

////Get Total Number of DNF's////
function getNumDNF(){
    var DNFcounter = 0;
    timeArr.map(function(time){
        if(time=="DNF")DNFcounter++;
    });
    return DNFcounter;
}

////Get Total Number of +2's////
function getNumberPlusTwo(){
    var plusTwoCounter = 0;
    timeArr.map(function(time){
        if(/(\d{1,2}:)?\d{1,2}(.\d{1,2})?\+2?/.test(time))plusTwoCounter++;
    });
    return plusTwoCounter;
}

////Get Total Time////
function getTotalTime(){
    var newTimeArr = timeArr.getTimeArr();
    if(newTimeArr.length==0)return formatTime(0);
    var sum = newTimeArr.reduce(function(a,b){return a+b;});
    return formatTime(sum);
}

////Get Total Mean////
function getTotalMean(){
    var newTimeArr = timeArr.getTimeArr();
    if(newTimeArr.length==0 || isNaN(newTimeArr[0]))return formatTime(0);
    var sum = newTimeArr.reduce(function(a,b){return a+b;});
    return formatTime((sum / newTimeArr.length).toFixed(2));
}

////Get Total Average////
function getTotalAverage(){
    var newTimeArr = timeArr.getTimeArr();
    var cutOffNr = newTimeArr.length/100*5;
    
    if(newTimeArr.length<=2)return formatTime(0);
    
    for(var k=0;k<cutOffNr;k++){
        var maxTime = Math.max.apply(null, newTimeArr);
        var ioMax = newTimeArr.indexOf(maxTime);
        newTimeArr.splice(ioMax,1);

        var minTime = Math.min.apply(null, newTimeArr);
        var ioMin = newTimeArr.indexOf(minTime);
        newTimeArr.splice(ioMin,1);
    }
    
    var sum = newTimeArr.reduce(function(a,b){return a+b});
    var res = (sum/newTimeArr.length).toFixed(2);
    return formatTime(res);
}

////Get Total Median////
function getTotalMedian(){
    var newTimeArr = timeArr.getTimeArr();
    var arrLen = newTimeArr.length;
    
    newTimeArr.sort(function(a,b){return a-b});
    medianArr = [];
    
    if(arrLen%2==0 && arrLen>0){
        medianArr = newTimeArr.slice(Math.floor(arrLen/2)-1,Math.ceil(arrLen/2)+1);
    }
    else{
        medianArr.push(newTimeArr[Math.ceil(arrLen/2)-1]);
    }
    
    var res = medianArr.length==2?medianArr.reduce(function(a,b){return a+b})/2:medianArr[0];
    return formatTime(res);
}

////Get Total Variance////
function getTotalVariance(){
    var newTimeArr = timeArr.getTimeArr();
    if(newTimeArr.length==0 || isNaN(newTimeArr[0]))return formatTime(0);
    var mean = (newTimeArr.reduce(function(a,b){return a+b;}))/newTimeArr.length;
    var varSum = 0;
    
    for(var i=0;i<=newTimeArr.length-1;i++){
        varSum += Math.pow(newTimeArr[i]-mean,2);
    }
    
    var res = varSum/newTimeArr.length;
    
    return formatTime(res);
}

////Get Total Standard Deviation////
function getTotalStandardDeviation(){
    var newTimeArr = timeArr.getTimeArr();
    if(newTimeArr.length==0 || isNaN(newTimeArr[0]))return formatTime(0);
    var mean = (newTimeArr.reduce(function(a,b){return a+b;}))/newTimeArr.length;
    var varSum = 0;
    
    for(var i=0;i<=newTimeArr.length-1;i++){
        varSum += Math.pow(newTimeArr[i]-mean,2);
    }
    
    var variance = varSum/newTimeArr.length;
    
    var res = Math.sqrt(variance);
    
    return formatTime(res);
}

////Get Total Mean and cut off best and worst 5%////
function getAverage(getAvgNum, best){
    getTimeArr();
    var l_timeArr = timeArr.getTimeArr();
    var worstTime = 0.00;
    var bestTime;
    
    //Parse every item in array to float
    l_timeArr = l_timeArr.map(function(a){return parseFloat(a)});
    
    for(var i_getAvg=0; i_getAvg<(l_timeArr.length-getAvgNum+1);i_getAvg++){
        var getAvg_avgArr = new Array();
        var getAvg_cutOffNr = Math.ceil(getAvgNum/100*5);
        
        for(var l_getAvg=0;l_getAvg<getAvgNum;l_getAvg++){
            getAvg_avgArr.push(l_timeArr[i_getAvg+l_getAvg]);
        }
        
        //Cut Off Best/Worst 5%
        for(var k_getAvg=0;k_getAvg<getAvg_cutOffNr;k_getAvg++){
            var getAvg_maxTime = Math.max.apply(null, getAvg_avgArr);
            var gioMax = getAvg_avgArr.indexOf(getAvg_maxTime);
            getAvg_avgArr.splice(gioMax,1);

            var getAvg_minTime = Math.min.apply(null, getAvg_avgArr);
            var gioMin = getAvg_avgArr.indexOf(getAvg_minTime);
            getAvg_avgArr.splice(gioMin,1);
        }
        
        
        var actualAvg = (getAvg_avgArr.reduce(function(a,b){return a+b}) / getAvg_avgArr.length);
        
        if(i_getAvg==0 || actualAvg<bestTime)bestTime=parseFloat(actualAvg.toFixed(2));
        if(actualAvg>worstTime)worstTime=parseFloat(actualAvg.toFixed(2));
        
    }
    return formatTime(best?bestTime:worstTime);
}

/*-------------------------*/
/////////////////////////////
///////GRAPH-FUNCTIONS///////
/////////////////////////////
/*-------------------------*/

////Display Graph////
function displayGraph(e){
    getTimeArr();    
    updateStats();
    
    if(e){e.preventDefault()};    
    //Process Range Selection (Single/Avg5/Avg12...)
    rangeSelection(timeArr, function(str_timeArr){
        timeArr = str_timeArr.split(",");
        generateGraph(timeArr);
    });
}

////Function to generate the Graph////
function generateGraph(timeArr){
    var l_timeArr = timeArr.map(function(x){
        var x_str = x.toString();
        if(x_str=="DNF")return 0.00;
        else if(/(\d{1,2}:)?\d{1,2}(.\d{1,2})?\+2?/.test(x_str)){
            var rawTime = x_str.replace("+2","");
            if(/(\d{1,2}:){1,2}(\d{1,2}.)(\d{1,2})/.test(rawTime)) return parseFloat(minToSec(rawTime),10)+2;
            else {return parseFloat(rawTime,10)+2}
        }
        return parseFloat(x,10);
    });
    
    //Filter out the 0.00 (DNF) times
    l_timeArr = l_timeArr.filter(function(e){if(e!=0.00)return true});
    
    var extremes = {
        min: Math.min.apply(null,l_timeArr.getTimeArr()),
        max: Math.max.apply(null,l_timeArr.getTimeArr())
    };
    
    switch($("#chartSelection")[0].value){
        case "linechart":
            timeArr = markPoints(l_timeArr,extremes);
            createLineGraph(timeArr);
            break;
        case "scatterplot":
            timeArr = markPoints(l_timeArr,extremes);
            createScatterPlot(timeArr);
            break;
        case "barchart":
            createBarChart(l_timeArr);
            break;
        default:
            createLineGraph(l_timeArr,extremes);
            break;
    }
    
    chart = $('#chartContainer').highcharts();
}

////Mark Extreme Points////
function markPoints(timeArr,extremes){
    var min_marker = "";
    var max_marker = "";
    
    for(var i=0;i<timeArr.length;i++){
        if(timeArr[i] == extremes.min){
            timeArr[i] = {marker:{fillColor: '#2ecc71',lineWidth: 10,lineColor: '#27ae60'},y:timeArr[i]};
        }
        else if(timeArr[i] == extremes.max){
            timeArr[i] = {marker:{fillColor: '#e74c3c',lineWidth: 10,lineColor: '#c0392b'},y:timeArr[i]};
        }
    }
    
    return timeArr;
}

////Fullscreen the Graph////
function toggleFullscreen(){
    if(!fullscreen){
        chartHeight = chart.chartHeight;
        chart.setSize(
           $(window).width(), 
           $(window).height(),
           false
        );
        $("#chartContainer").css("position", "absolute").css("top","0px").css("margin","0").css("padding","0");
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
        $("#chartContainer").css("position", "").css("top","").css("margin","").css("padding","0px 15px");
        $(".highcharts-container").css("margin","1.5% auto");
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
        
        tooltip: {
            valueSuffix: " Seconds"
        },

        subtitle: {text: "Double-Click for Fullscreen"},

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        }
    });
}

////Process Range Selection////
function rangeSelection(timeArr,callback){
    var newTimeArr = [];
    var rangeSel = $("#rangeSelection")[0].value;
    var avgNum = parseInt(rangeSel.replace("avg",""),10);
    var cutOffNr = Math.ceil(avgNum/100*5);
    var counter = 0;
    
    if(rangeSel!="single"){rs_avg()}    
    else if(rangeSel=="single"){callback(timeArr.toString())}
    function rs_avg(){
        //Calculate Averages
        for(var i=0; i<(timeArr.length-avgNum+1);i++){
            var avgArr = new Array();
            for(var l=0;l<avgNum;l++){
                if(timeArr[i+l]!="DNF"){
                    if(/\d{1,}.\d{1,}\+2?/.test(timeArr[i+l])){
                        avgArr.push(parseFloat(timeArr[i+l])+2);
                    }
                    else{
                        avgArr.push(timeArr[i+l]);
                    }
                }
            }
            
            counter++;
            
            //Cut Off Best/Worst 5%
            for(var k=0;k<cutOffNr;k++){
                var maxTime = Math.max.apply(null, avgArr);
                var ioMax = avgArr.indexOf(maxTime);
                avgArr.splice(ioMax,1);
                
                var minTime = Math.min.apply(null, avgArr);
                var ioMin = avgArr.indexOf(minTime);
                avgArr.splice(ioMin,1);
            }
            
            newTimeArr.push((avgArr.reduce(function(a,b){return a+b}) / avgArr.length).toFixed(2));
        }
        callback(newTimeArr.toString());
    }
}

////Create a LINEGRAPH////
function createLineGraph(timeArr){
    new Highcharts.Chart({
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
            name: "Time",
            data: timeArr
        }]
    });
}

////Create a SCATTERCHART////
function createScatterPlot(timeArr){
    new Highcharts.Chart({
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
            name: "Time",
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
    
    
    new Highcharts.Chart({
        chart: {
            type: "column",
        },
        
        tooltip: {
            valueSuffix: ""
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
            name: "Number of times in range",
            data: timeData
        }]
    });  
}