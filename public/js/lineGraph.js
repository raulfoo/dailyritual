var width = 960,
      height = 465,
      scale,
      trans=[0,0],
      centered;

arrowValue = 0
var allOutDat 
var donutChart = false
var tempDates,minSlide,maxSlide
var path
      
var projection = d3.geo.equirectangular()
  .scale(153)
  .translate([width / 2, height / 2]);

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

color1 = d3.scale.ordinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  
  
d3.json("json/activityDat.json", function(error, data) {
  
    testingDat3 = data
    testingDat1 = data
    builds = buildSelects(data)

     d3.json("json/lifeDates.json", function(error, dates) {
    
    
      tempDates = dates
      minSlide = Math.min.apply(Math,tempDates.map(function(e){ return parseInt(e.Start)}))
      maxSlide = Math.max.apply(Math,tempDates.map(function(e){ return parseInt(e.Stop)}))
      $("#dateSlider").slider("option","min",minSlide)
      $("#dateSlider").slider("option","max",maxSlide)
    
      randomChoose = Math.floor(Math.random()*2)
      
      if(randomChoose==0){
          type="Activity"
        }else{
          type = "Category"
        }
        
      settings = retrieveOptions(type)
      if(type == "Category"){
        options = settings["options"]
        otherOptions = settings["otherOptions"]
      }else{
        otherOptions = settings["options"]
        options = settings["otherOptions"]
      }
    

     subLevel = otherOptions[Math.floor(Math.random()*otherOptions.length)]
     $("#chosen").html(subLevel)
    
     $("#holdDropType").val(type)
     $("#holdDropValue").val(subLevel)

     graphingDat = buildGraphData(data,subLevel,type,options,otherOptions,color1)

    elementChoose = ["#barGraphActivity","#barGraphCategory"]
    //graphChoose = ["activityGraph","categoryGraph"]
    
    for(i= 0; i <1; i++){
    
      data = $.extend([],graphingDat)
      var svg = d3.select(elementChoose[i]).append("svg")
        .attr("width", width)
        .attr("height", 700)
      .append("g")
      
     margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = 960 - margin.left - margin.right,
        height = 960 - margin.top - margin.bottom;
    
      x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    
      y = d3.scale.linear()
        .rangeRound([height, 0]);
        
      yTan = d3.scale.linear()
        .rangeRound([0, height]);
    
      color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    
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
       // d.ages = color.domain().map(function(name) { return {name: name, people: d[name], y0: y0, y1: y0 += +(d[name].length), rotateAngle: (index*15) }});
       d.ages = color.domain().map(function(name) { return {name: name, people: d[name], y0: y0, y1: (options.indexOf(name)>-1 ? y0 += 3:  y0), rotateAngle: (index*15)}});

       d.total = d.ages[d.ages.length - 1].y1;
        index = index+1
      });
      
     // alert(d3.max(data, function(d) { return d.total; }))
      x.domain(data.map(function(d) { return d.TimeZone; }));
     // y.domain([0, d3.max(data, function(d) { return d.total; })]);
      if(metric == "absolute"){
        domTot = d3.max(data, function(d) { return d.total; })*1.5
        y.domain([0, domTot]);
        radianAngle = (7.5/domTot)/(360/(2*Math.PI))

        //y.domain([0, 6]);
        }else{
        y.domain([0, 3]);
        radianAngle = 2.45/(360/(2*Math.PI))

        }
        
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
       /* var max = Math.max.apply(null, d.ages.map(function(e){
           return e.people.length;
        }));
        */
        
        if(metric == "absolute"){
        d.path = d.ages.map(function(e){ return {name: e.name, people: e.people, y0: e.y0, y1: e.y1, path: buildPath(y(e.y0),y(e.y1),yTan(e.y0),yTan(e.y1), e.rotateAngle, radianAngle), rotateAngle: e.rotateAngle, timeZone: d.TimeZone}});

        }else{

        d.path = d.ages.map(function(e){ return {name: e.name, people: e.people, y0: e.y0, y1: e.y1, path: buildPath(y(e.y0/d.total),y(e.y1/d.total),yTan(e.y0/d.total),yTan(e.y1/d.total), e.rotateAngle, radianAngle), rotateAngle: e.rotateAngle, timeZone: d.TimeZone}});
        }
      })
      
      //test stop
      
      testingDat2 = data

      state = svg.selectAll(".state")
          .data(data)
        .enter().append("g")
          .attr("class", "state")
          .attr("transform", function(d, i) { return "translate(" + "480" + ",-580)";})// rotate("+((15*i)+7.5)+" 0,960)"; })
        
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
          .attr("transform", function(d, i) { return "translate(-100," + ((i * 20) + 310) +")"; });
    
      legend.append("rect")
          .attr("class","legendRect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color)
          .on("click", function(d){ clickLegend(d) })
    
      legend.append("text")
          .attr("x", width+15)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d; });
      
    }
    
    buildLineGraphDat(testingDat1)
    $("#content").fadeIn(0)
       
    }); 
    
});
  

  
function updateGraphs(data,type,subLevel,options,otherOptions,metric){

    $("#searchPerson").val("")
    color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
    
    filterDat = data
    graphingDat = buildGraphData(data,subLevel,type,options,otherOptions,color)
    
    elementChoose = ["#barGraphActivity","#barGraphCategory"]
    graphChoose = ["activityGraph","categoryGraph"]
    
  
    
    for(i= 0; i<1; i++){
     
  
      
      data = $.extend([],graphingDat)
    
  
      x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    
      y = d3.scale.linear()
        .rangeRound([height, 0]);
        
      yTan = d3.scale.linear()
        .rangeRound([0, height]);
    
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "TimeZone"; }));
      
      index=0
      //if want donut chart showing total time breakdowns for a period, change the data here
      if(donutChart == true){

        datArray = []
        timeObj = {}
        totalTime = 0
        
        options.forEach(function(e){
          time = 0
          uniques = []
          data.filter(function(d){
            time +=  parseInt(d[e].length)
             if(type=="Activity"){
              uniques.push(d[e])
             }
          })
         
          if(type=="Activity"){
            uniques= _.flatten(uniques)
             uniques= _.uniq(uniques)
       
             totalTime += time/(Math.max(uniques.length ,1) )
              timeObj[e] = time/(Math.max(uniques.length ,1)) 
           }else{
             totalTime += time
             timeObj[e] = time
           } 
        })
        
        otherOptions.forEach(function(e){
          timeObj[e] =0
        })
        
        index = 0
        rotateAngle = 0
        data.forEach(function(d) {
        var y0 = 0; 

          d.ages = color.domain().map(function(name) { return {width: (options[index]==name ? (((Math.max(timeObj[name],0)/totalTime)*360))/(360/(2*Math.PI)) : 0), name: name, people: [name], y0: y0, y1: (options[index]==name ? y0 += 3:  y0),  rotateAngle: rotateAngle, percentage: timeObj[name]/totalTime  }});  //(options[index]==name ? y0 += 3:  y0)  (options[index]==name ? rotateAngle+= ((Math.max(timeObj[name],0)/totalTime)*24*15):  
          d.total = d.ages[d.ages.length - 1].y1;
          
         rotateAngle += ((Math.max(timeObj[options[index]],0)/totalTime)*24*15)
         index = index+1
        
        })
        
      }else{
          
        data.forEach(function(d) {
          var y0 = 0; 
         // d.ages = color.domain().map(function(name) { return {name: name, people: d[name], y0: y0, y1: y0 += +(d[name].length), rotateAngle: (index*15) }});
          d.ages = color.domain().map(function(name) { return {width: (Math.PI*2)/24, name: name, people: d[name], y0: y0, y1: (options.indexOf(name)>-1 ? y0 += 3:  y0), rotateAngle: (index*15), percentage:0 }});
  
          d.total = d.ages[d.ages.length - 1].y1;
          index = index+1
        });

      }
      
      x.domain(data.map(function(d) { return d.TimeZone; }));

     
     // alert(d3.max(data, function(d) { return d.total; }))
     // y.domain([0, d3.max(data, function(d) { return d.total; })]);
      /*if(metric == "absolute"){
        domTot = d3.max(data, function(d) { return d.total; })*1.5
        y.domain([0, domTot]);
        radianAngle = (7.5/domTot)/(360/(2*Math.PI))

        //y.domain([0, 6]);
        }else{
        y.domain([0, 3]);
        radianAngle = 2.45/(360/(2*Math.PI))

        }
        */
        //domTot = d3.max(data, function(d) { return d.total; })
        y.domain([0,1.5]);
      
        
        //radianAngle = (Math.PI*2)/24

        
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
            if(donutChart==true){
              maxObj[opt] = 1
            }
          
          })
         /* var max = Math.max.apply(null, d.ages.map(function(e){
             return e.people.length;
          }));
          */
          
          if(metric == "absolute"){
            d.path = d.ages.map(function(e){ return {name: e.name, people: e.people, y0: e.y0, y1: e.y1, path: buildPath(y(e.y0/d.total),y(e.y1/d.total),yTan(e.y0),yTan(e.y1), e.rotateAngle,e.width), rotateAngle: e.rotateAngle, timeZone: d.TimeZone, percentage: e.percentage}});
  
          }else{
  
            d.path = d.ages.map(function(e){ return {name: e.name, people: e.people, y0: e.y0, y1: e.y1, path: buildPath(y(e.y0/d.total),y(e.y1/d.total),yTan(e.y0/d.total),yTan(e.y1/d.total), e.rotateAngle,e.width), rotateAngle: e.rotateAngle, timeZone: d.TimeZone, percentage: e.percentage}});
          }
        })
      
      
               

      testingDat2 = data
      divideTotal = 3
      state =  d3.select(elementChoose[i]).selectAll(".state")
        .data(data).selectAll("path")
        .data(function(d){ return d.path}).transition(500).delay(250)  //attr("transform", function(d, i) { return "translate(" + "480" + ",-580) rotate("+((d.ages[d.ages.length-1].rotateAngle)+7.5)+" 0,960)"; })
          .attr("d",function(d){ return d.path})
          .style("fill", function(d) { return convertColor(color(d.name),d.people.length,d3.max(data, function(d) { return d.total; })); })
          .style("fill-opacity", function(d) {return (d.people.length/Math.max(maxObj[d.name],1)) })
          .style("stroke", "black" )
       
      d3.select(elementChoose[i]).selectAll(".legend").remove()    
      
      var legend = d3.select(elementChoose[i]).select("svg g").selectAll(".legend")
          .data(options.slice().reverse())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(-100," + ((i * 20) + 310) +")"; });
    
      legend.append("rect")
          .attr("class","legendRect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color)
          .on("click", function(d){ clickLegend(d) })

      legend.append("text")
          .attr("x", width+15)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "start")
          .text(function(d) { return d; });
    }

    updateLineGraph(testingDat1)

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

