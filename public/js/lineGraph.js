var width = 960,
      height = 465,
      scale,
      trans=[0,0],
      centered;

var singleName = false;

var allOutDat 
var donutChart = false
var tempDates,minSlide,maxSlide
var path

var testingDat1
var graphingDat
var svg
var state
var checkDat

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    
var metric="absolute"

  
d3.json("json/activityDat.json", function(error, data) {
  
    filterDat = data
    testingDat1 = data
    builds = buildSelects(data)

    d3.json("json/lifeDates.json", function(error, dates) {
    
  
    tempDates = dates
    minSlide = Math.min.apply(Math,tempDates.map(function(e){ return parseInt(e.Start)}))
    maxSlide = Math.max.apply(Math,tempDates.map(function(e){ return parseInt(e.Stop)}))
    $("#dateSlider").slider("option","min",minSlide)
    $("#dateSlider").slider("option","max",maxSlide)

    graphingDat = buildGraphData(data)//,subLevel,type,options,otherOptions,color1)

    elementChoose = ["#clockActivity","#barGraphCategory"]
    i=0
    
    data = $.extend([],graphingDat)
    var svg = d3.select(elementChoose[i]).append("svg")
        .attr("width", width)
        .attr("height", 700)
      .append("g")
        .attr("transform", "translate(230,-190)")// rotate("+((15*i)+7.5)+" 0,960)"; })
        .attr("class","stateWrapper")
        
    svg.selectAll("image").data(["/images/dayNightCycleSmall.png"]).enter().append("svg:image")
     .attr("transform", "translate(-71,571)")// rotate("+((15*i)+7.5)+" 0,960)"; })
     .attr('width', 140)
     .attr('height', 140)
     .attr("xlink:href","/images/dayNightCycleSmall.png")
      
     margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 640 - margin.left - margin.right,
        height = 640 - margin.top - margin.bottom;
    
      x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    
      y = d3.scale.linear()
        .rangeRound([height, 0]);
        
      yTan = d3.scale.linear()
        .rangeRound([0, height]);
    
      color = d3.scale.ordinal()
      .range(["#66c2a55", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"])//,"#e5c494"]);
  
    
      xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(d3.format(".2s"));
   
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TimeZone"; }));

      index=0
      
      data.forEach(function(d) {
        var y0 = 0;
        d.ages = color.domain().map(function(name) { return {name: name, people: d[name], y0: y0, y1: (options.indexOf(name)>-1 ? y0 += 3:  y0), rotateAngle: (index*15)}});
        d.total = d.ages[d.ages.length - 1].y1;
        index = index+1
      });
      
      x.domain(data.map(function(d) { return d.TimeZone; }));

      domTot = d3.max(data, function(d) { return d.total; })*1.5
      y.domain([0, domTot]);
      radianAngle = (7.5/domTot)/(360/(2*Math.PI))
  
      radianAngle = (Math.PI*2)/24
       
      maxObj = {}
      options.forEach(function(opt){
        maxObj[opt] = 0  
      })
      
      data.forEach(function(d){
        options.forEach(function(opt){
          if(maxObj[opt] < d[opt].length){
            maxObj[opt] = d[opt].length
          }
        })
        d.path = d.ages.map(function(e){ return {name: e.name, people: e.people, y0: e.y0, y1: e.y1, path: buildPath(y(e.y0),y(e.y1),yTan(e.y0),yTan(e.y1), e.rotateAngle, radianAngle), rotateAngle: e.rotateAngle, timeZone: d.TimeZone}});   
      })
      
    state = svg.selectAll(".state")
          .data(data)
        .enter().append("g")
          .attr("class", "state")
        
     state.selectAll("path")
          .data(function(d) { return d.path; })
        .enter().append("path")
          .attr("d",function(d){ return d.path})
          .style("fill", function(d) { return convertColor(color(d.name),d.people.length,d3.max(data, function(d) { return d.total; })); })
          .style("fill-opacity", function(d) {return (d.people.length/Math.max(maxObj[d.name],1)) })
          .style("stroke", "black" )
          .on("mouseover", function(d){ mover(d)})
          .on("mouseout", function(d){ mout(d)})
          .on("click", function(d){  searchNamesFunc(d)})
               
      var legend = svg.selectAll(".legend")
          .data(options.slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(-410," + ((i * 20) + 410) +")"; });
    
      legend.append("rect")
          .attr("class","legendRect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill",  function(d){ return convertColor(color(d),1,1)})
    
      legend.append("text")
          .attr("x", width+15)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d; });
          
    buildLineGraphDat(testingDat1,$("#activitySelect").val())
    
    plotBar([{letter: "A", score: 0}],"topBar")
    plotBar([{letter: "A", score: 0}],"botBar")
    $("#content").fadeIn(0)
       
    }); 
});
  

  
function updateGraphs(data,backButtonPressed){
    backButtonPressed = backButtonPressed || false
    occupation = $("categorySelect").val()
    activity = $("activitySelect").val()
    
    subLevel = occupation
    $("#searchPerson").val("")
    
    color= d3.scale.ordinal()
      .range(["#66c2a55", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);
  
    filterDat = data
    graphingDat = buildGraphData(data)//,subLevel,type,options,otherOptions,color)
    
    elementChoose = ["#clockActivity","#barGraphCategory"]
    graphChoose = ["activityGraph","categoryGraph"]
    
    i=0
   
    data = $.extend([],graphingDat)
  
    x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
  
    y = d3.scale.linear()
      .rangeRound([height, 0]);
      
    yTan = d3.scale.linear()
      .rangeRound([0, height]);
  
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TimeZone"; }));
    
    index=0
 
    data.forEach(function(d) {
      var y0 = 0; 
      d.ages = color.domain().map(function(name) { return {width: (Math.PI*2)/24, name: name, people: d[name], y0: y0, y1: (((occupation == "-Occupation-" && options.indexOf(name)>-1) || (name==activity && singleName==false && occupation != "-Occupation-") || (singleName==true && d[name].length>0)) ? y0 += 3:  y0), rotateAngle: (index*15), percentage:0 }}); //(options.indexOf(name)>-1 ? y0 += 3:  y0)  options.indexOf(name)>-1

      d.total = d.ages[d.ages.length - 1].y1;
      index = index+1
    });


    x.domain(data.map(function(d) { return d.TimeZone; }));

    y.domain([0,1.5]);
    
   maxObj = {}
   options.forEach(function(opt){
     maxObj[opt] = 0
   })
    
    checkDat = data
    data.forEach(function(d){
      options.forEach(function(opt){
        if(maxObj[opt] < d[opt].length){
          maxObj[opt] = d[opt].length
        }
      })
      d.path = d.ages.map(function(e){ return {name: e.name, people: e.people, y0: e.y0, y1: e.y1, path: buildPath(y(e.y0/d.total),y(e.y1/d.total),yTan(e.y0),yTan(e.y1), e.rotateAngle,e.width), rotateAngle: e.rotateAngle, timeZone: d.TimeZone, percentage: e.percentage}});
    })
  
    if(backButtonPressed){
     d3.select(elementChoose[i]).selectAll(".stateWrapper").transition().duration(400).delay(0)
      .attr("transform","translate(-450,-190)")
      }
             
    //get selected activities(to restrict the legend)
    
    didActivities = []
    data.forEach(function(d){
      options.forEach(function(e){
        if(d[e].length>0){
          didActivities.push(e)
        }
      })
    })
    
    didActivities = _.uniq(didActivities)
    
    divideTotal = 3
    state =  d3.select(elementChoose[i]).selectAll(".state")
      .data(data).selectAll("path")
      .data(function(d){ return d.path}).transition().delay(200)  //attr("transform", function(d, i) { return "translate(" + "480" + ",-580) rotate("+((d.ages[d.ages.length-1].rotateAngle)+7.5)+" 0,960)"; })
        .attr("d",function(d){ return d.path})
        .style("fill", function(d) { return convertColor(color(d.name),d.people.length,d3.max(data, function(d) { return d.total; })); })
        .style("fill-opacity", function(d) {return (d.people.length/Math.max(maxObj[d.name],1)) })
        .style("stroke", "black" )
     
     
    if(backButtonPressed){      
     d3.select(elementChoose[i]).selectAll(".stateWrapper").transition().duration(200).delay(400)
      .attr("transform","translate(230,-190)")// rotate("+((15*i)+7.5)+" 0,960)"; })
    }
    
    d3.select(elementChoose[i]).selectAll(".legend").remove()    
    
    if(singleName==true || occupation == "-Occupation-"){
      var legend = d3.select(elementChoose[i]).select("svg g").selectAll(".legend")
          .data(didActivities.slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(-410," + ((i * 20) + 410) +")"; });
    
      legend.append("rect")
          .attr("class","legendRect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
        .style("fill",  function(d){ return convertColor(color(d),1,1)})
         // .on("click", function(d){ clickLegend(d) })

      legend.append("text")
          .attr("x", width+15)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d; });
    }
  

    updateLineGraph(testingDat1,occupation)
    
    $(".barGraphWrapper").css("visibility","visible")
    createBarGraphs(testingDat1,filterDat,options,otherOptions,activity,occupation)
  
}

function convertY(input){
    return (input/3)+width
  }

function buildPath(y0,y1,tany0,tany1,rotateAngle,inputAngle){
  
  if(isNaN(y0) || isNaN(y1)){
    return "M 0 0"
    }
  
  largeArc = 0

  rotateAngle = rotateAngle/(360/(Math.PI*2))+(3*Math.PI/2)
  
    if(inputAngle> Math.PI) largeArc = 1

  path = "M"+(y1*Math.cos(rotateAngle))/3+" "+(convertY(y1*(Math.sin(rotateAngle))))
  path = path+" L"+(y0*Math.cos(rotateAngle))/3+" "+(convertY(y0*(Math.sin(rotateAngle))))
  //draw arc here
  path = path+"A "+y0/3+" "+y0/3+" 0 "+largeArc+" 1 "+ (y0*Math.cos(rotateAngle+inputAngle))/3+" "+(convertY(y0*(Math.sin(rotateAngle+inputAngle))))
  //replace arc with below line if want to remove
  //path = path+" L"+(y0*Math.cos(rotateAngle+inputAngle))/3+" "+(convertY(y0*(Math.sin(rotateAngle+inputAngle))))
  path = path +"L"+(y1*Math.cos(rotateAngle+inputAngle))/3+" "+(convertY(y1*(Math.sin(rotateAngle+inputAngle))))
  path = path+"A "+y1/3+" "+y1/3+" 0 "+largeArc+" 0 "+ (y1*Math.cos(rotateAngle))/3+" "+(convertY(y1*(Math.sin(rotateAngle))))+" Z"  
  
  return path

}

function convertColor(color,level,biggest){
  var r = parseInt(color.substr(1,2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  var g = parseInt(color.substr(3,2), 16);
  var b = parseInt(color.substr(5,2), 16);

  output = "rgb("+r+","+g+","+b+")"
  return output


}

