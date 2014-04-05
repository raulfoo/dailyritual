buildTimeSeries = function(data){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 80 - margin.top - margin.bottom;
  
  var parseDate = d3.time.format("%Y").parse;
  
  var x = d3.time.scale()
      .range([0, width]);
  
  var y = d3.scale.linear()
      .range([height, 0])
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(2)
      .orient("left");
  
  var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });
  
  sampleSeries = data.filter(function(d){
    return d.close>0
  })
  
  //graphLevel = $("#categorySelect").val()


  sampleSerie = sampleSeries[Math.floor(Math.random()*sampleSeries.length)]
  var yLabelDescObj = {
    timeZone: -99,
    close: "",
    name: "Relative Abundance",
    people: "The percent of time that "+$("#categorySelect option:selected").text()+" spent "+$("#activitySelect option:selected").text()+" relative to other activities."+
    "For example, in "+sampleSerie.date+", "+ $("#categorySelect option:selected").text() +" spent "+Math.round(sampleSerie.close*100)+"% of their time "+$("#activitySelect option:selected").text()
   /* people: "The relative abundance of "+   graphLevel.toLowerCase()+ (type == "Activity" ? "":"s")+" compared to other "+
    (type == "Activity" ? "activities":"professions")+" in that year. For example, in "+sampleSerie.date+
    ", " + (type == "Activity" ?   graphLevel.toLowerCase() +" accounted for "+Math.round(sampleSerie.close*100)+"% of the recorded schedule for all person in database": Math.round(sampleSerie.close*100)+"% of people in database considered themselves to be a " +   graphLevel.toLowerCase())
    */
  }
  
  
  var svg = d3.select("#timeSeries").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    data.forEach(function(d) {
      d.year = d.date
      d.date = parseDate(String(d.date));
      d.close = +d.close;
    });
  
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));
  
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
    temp = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("g")
        //.attr("transform", "translate(10,-20) rotate(0)")
        //
        .attr("class", "yLab")
        .on("mouseover", function(){
          mover(yLabelDescObj)
        })
        .on("mouseout", function(){
          mout(yLabelDescObj)
        })
        .append("text").attr("transform", "translate(10,-10) rotate(0)")
        .style("text-anchor", "start")
        .attr("y", 0)
        .attr("dy", ".71em")
        .attr("class","yAxisLabel")
        .text("Relative Abundance: "+ $("#categorySelect option:selected").text()+", "+$("#activitySelect option:selected").text())
       
       
  
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)

  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { 
        focus.style("display", "none")
        $("#timeSeriesNames").text("")
        mout(yLabelDescObj)
      })
      .on("mousemove", mousemove)
      .on("click", mouseclick)
      
  
  function mouseclick(){
    bisectDate = d3.bisector(function(d) { return d.date; }).left
    
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;  
        $("#holdDropType").val("Category")
        searchMultipleName(d.people)
        

        $("#dateSlider").slider("value",d.year)

  }

  function mousemove() {

    bisectDate = d3.bisector(function(d) { return d.date; }).left

    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
   
    temp = $.extend({},yLabelDescObj)
    temp["name"] = d.year
    d.people = d.people.sort(compareLastWord)

    temp["people"] = d.people.join(", ")
    mover(temp)
  }
  
}

updateTimeSeries = function(data){


  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 80 - margin.top - margin.bottom;
  
  var parseDate = d3.time.format("%Y").parse;
  
  var x = d3.time.scale()
      .range([0, width]);
  
  var y = d3.scale.linear()
      .range([height, 0]);
  
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  
  var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(2)
      .orient("left");
      
  sampleSeries = data.filter(function(d){
    return d.close>0
  })
  
  if(sampleSeries.length>0){
    //graphLevel = $("#categorySelect").val()
    sampleSerie = sampleSeries[Math.floor(Math.random()*sampleSeries.length)]
    
    var yLabelDescObj = {
      timeZone: -99,
      close: "",
      name: "Relative Abundance",
      people: "The percent of time that "+$("#categorySelect option:selected").text()+" spent "+$("#activitySelect option:selected").text()+" relative to other activities."+
      "For example, in "+sampleSerie.date+", "+ $("#categorySelect option:selected").text() +" spent "+Math.round(sampleSerie.close*100)+"% of their time "+$("#activitySelect option:selected").text()
      /*people: "The relative abundance of "+  graphLevel.toLowerCase()+ (type == "Activity" ? "":"s")+" compared to other "+
      (type == "Activity" ? "activities":"professions")+" in that year. For example, in "+sampleSerie.date+
      ", " + (type == "Activity" ?   graphLevel.toLowerCase() +" accounted for "+Math.round(sampleSerie.close*100)+"% of the recorded schedule for all persons in database": Math.round(sampleSerie.close*100)+"% of people in database considered themselves to be a " +   graphLevel.toLowerCase())
      */
    }
  }else{
  
    var yLabelDescObj = {
      timeZone: -99,
      close: "",
      name: "Relative Abundance",
      people: "No Data for this occupation/activity combination during any period"
    }
  
  
  }
     
   var line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });
      
      
    data.forEach(function(d) {
      d.year = d.date
      d.date = parseDate(String(d.date));
      d.close = +d.close;
    });
    
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.close; }));

  d3.select("#timeSeries").selectAll(".y")
        .attr("class", "y axis")
        .call(yAxis)
          .selectAll(".yLab")
          .on("mouseover", function(){
            mover(yLabelDescObj)
          })
          .on("mouseout", function(){
            mout(yLabelDescObj)
          })
          
      
  svg = d3.select("#timeSeries g")
  
  svg.selectAll("path.line")
        .data([data]).transition()
        .attr("class", "line")
        .attr("d", line);
        
  svg.selectAll(".yAxisLabel").text("Relative Abundance: "+  $("#categorySelect option:selected").text()+", "+$("#activitySelect option:selected").text())
        
  d3.select(".focus").remove()   
        
  var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { 
        focus.style("display", "none")
        $("#timeSeriesNames").text("")
        mout(yLabelDescObj)
      })
      .on("mousemove", mousemove)
      .on("click", mouseclick)
      
  
  function mouseclick(){
    bisectDate = d3.bisector(function(d) { return d.date; }).left

    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;  
        $("#holdDropType").val("Category")
        searchMultipleName(d.people)
        $("#dateSlider").slider("value",d.year)

  }

  function mousemove() {

    bisectDate = d3.bisector(function(d) { return d.date; }).left
    //$("#slideVal").text(d.year)

    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
   
    temp = $.extend({},yLabelDescObj)
    temp["name"] = d.year
    d.people = d.people.sort(compareLastWord)

    temp["people"] = d.people.join(", ")
    mover(temp)
  }
      
}
