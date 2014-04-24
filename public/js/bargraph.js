function createBarGraphs(occupationDat,activityDat,activity,occupation){

  occDat = occupationDat.filter(function(d){
      return d["Activity"] == activity
    })
   
  newObj = {} 
  nameObj = {}
  occDat.forEach(function(d){
    if(d.StartGMT<d.StopGMT){
      time = d.StopGMT-d.StartGMT
    }else{
      time = (24-d.StartGMT)+d.StopGMT
    }
    newObj[d.Category] = newObj[d.Category]!=null ? newObj[d.Category]+time: time
    nameObj[d.Category]!=null ? (nameObj[d.Category].indexOf(d.Name)==-1 ? nameObj[d.Category].push(d.Name):  nameObj[d.Category]= nameObj[d.Category]): nameObj[d.Category] = [d.Name]
  })
  
  topGraphDat = []
  for(d in newObj){
    topGraphDat.push({letter: d, score:  (nameObj[d]==null ) ? newObj[d]:  newObj[d]/nameObj[d].length})
  }
  
  topGraphDat = topGraphDat.sort(compare)

  newObj = {} 
  nameObj = {}  
  if(occupation != "-Occupation-"){
     occDat = activityDat.filter(function(d){
      return d["Category"] == occupation && d["Activity"]==activity
    })
  }else{
    occDat = activityDat.filter(function(d){
    return d["Activity"]==activity
    })
  }
  
  newObj["Selection"] = 0
  occDat.forEach(function(d){
    if(d.StartGMT<d.StopGMT){
      time = d.StopGMT-d.StartGMT
    }else{
      time = (24-d.StartGMT)+d.StopGMT
    }
    newObj["Selection"] += time
    nameObj["Selection"]!=null ? (nameObj["Selection"].indexOf(d.Name)==-1 ? nameObj["Selection"].push(d.Name):  nameObj["Selection"]= nameObj["Selection"]): nameObj["Selection"] = [d.Name]
  })
  
  topGraphDat.unshift({letter: "Selection", score:  (nameObj["Selection"]==null ) ? newObj["Selection"]:  newObj["Selection"]/nameObj["Selection"].length})
   
  if(occupation != "-Occupation-"){
    occDat = activityDat.filter(function(d){
    return d["Category"] == occupation 
    })
  }else{
    occDat = activityDat
  }
    
  newObj = {} 
  nameObj = {}
  occDat.forEach(function(d){
    if(d.StartGMT<d.StopGMT){
      time = d.StopGMT-d.StartGMT
    }else{
      time = (24-d.StartGMT)+d.StopGMT
    }
    newObj[d.Activity] = newObj[d.Activity]!=null ? newObj[d.Activity]+time: time
    nameObj[d.Activity]!=null ? (nameObj[d.Activity].indexOf(d.Name)==-1 ? nameObj[d.Activity].push(d.Name):  nameObj[d.Activity]= nameObj[d.Activity]): nameObj[d.Activity] = [d.Name]
  })
  
  botGraphDat = []
  
  for(d in newObj){
    botGraphDat.push({letter: d, score: (nameObj[d]==null ) ? newObj[d]: newObj[d]/nameObj[d].length})
  }
  botGraphDat = botGraphDat.sort(compare)
  
  updateBar(botGraphDat,".botBar")
  updateBar(topGraphDat,".topBar")
}


plotBar = function(barData,svgName){

  var margin = {top: 20, right: 20, bottom: 80, left: 40},
      width = 0 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;
  
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
  
  var y = d3.scale.linear()
      .range([height, 0]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);
  
  //var svg = d3.select(".barGraphWrapper").append("svg")
  var svg = d3.select(".barGraphWrapper").append("svg")
      .attr("class",svgName)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class","wrapper")
    
  x.domain(barData.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(barData, function(d) { return d.score; })]);

  svg.selectAll(".bar")
      .data(barData, function(d){return d.letter})
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.score); })
      .attr("height", function(d) { return height - y(d.score); })
      .attr("fill", function(d) { return ((d.letter=="Selection") ? "green" : "steelblue")})
      
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ") ")
      .call(xAxis)

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "translate(-40,0) rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average hours/day")
      
  if(svgName=="topBar"){
    titleText = "Compare hours spent "+$("#activitySelect").val()+" across professions"
  }else{
    titleText = "How "+$("#categorySelect").val()+"s spend their time"
  }
  
  svg.append("g").attr("class","chartTitle").append("text")
    .attr("x", (width / 2))             
      .attr("y", -5)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text(titleText);
  
  function type(d) {
    d.score = +d.score;
    return d;
  }

}


function updateBar(barData,svgName){

  var margin = {top: 20, right: 20, bottom: 80, left: 40},
      width = 400 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;
  
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);
  
  var y = d3.scale.linear()
      .range([height, 0]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);
      
   x.domain(barData.map(function(d) { return d.letter; }));
   y.domain([0, d3.max(barData, function(d) { return d.score; })]);
  

  var svg = d3.selectAll(svgName).attr("width",400).selectAll(".wrapper")
 
  bars = svg.selectAll("rect")
    .data(barData, function(d){return d.letter})

  bars.enter().append("rect")
    .on("click",function(d){
      
      if(d.letter=="Selection") return
      if(svgName==".botBar"){
        $("#activitySelect")
          .val(d.letter)
          .trigger('change')
          }else{
           $("#categorySelect")
            .val(d.letter)
            .trigger('change')
          }
      })
      .on("mouseover", function(){ d3.select(this).style("stroke","#d3d3d3") })
      .on("mouseout", function(){ d3.select(this).style("stroke","black")  })
    .transition().duration(500)
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.letter); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.score); })
    .attr("height", function(d) { return height - y(d.score); })
    .attr("fill", function(d){ return ((d.letter=="Selection") ? "green" : "steelblue")})
 
    

  bars.attr("x", function(d) { return x(d.letter) }).transition().duration(500)
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.score); })
    .attr("height", function(d) { return height - y(d.score); })
    .attr("fill", function(d){ return ((d.letter=="Selection") ? "green" : "steelblue")})
    

  bars.exit().transition().remove();
  
  svg.selectAll(".y.axis")
        .attr("class", "y axis")
        .call(yAxis)
        
  svg.selectAll(".x.axis")
        .attr("class", "x axis")
        .call(xAxis).selectAll("text")
        .style("text-anchor","end")
        .attr("transform","rotate(-45)")
  
  if(svgName==".topBar"){
    titleText = "Hours spent "+$("#activitySelect option:selected").text()+", by profession"
  }else{
    titleText = "How your selection spends their time"
  }
    
  svg.selectAll(".chartTitle").selectAll("text")
    .attr("x", (width / 2))             
      .attr("y", -5)
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text(titleText);
   
  function type(d) {
    d.score = +d.score;
    return d;
  }

}

function compare(a,b){
   if (a.score < b.score) return 1
   if (a.score > b.score) return -1

}

