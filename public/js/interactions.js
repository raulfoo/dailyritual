$(document).ready(function(){

  $("#searchPerson").keyup(function(e){
    search = $(this).val()
    regSearch=RegExp(search,"i")
    if($(this).val().length>2) {
      searchNames = _.uniq(testingDat1.filter(function(e) { return e.Name.match(regSearch)}).map(function(d) {return d.Name}))
    
      if(searchNames.length==0){
        searchNames = ["No matches in database"]
      }
      
      dropTable = ""
      searchNames.forEach(function(d){
        dropTable = dropTable+"<tr><td><a>"+d+"</a></td></tr>"
      })
      $("#searchTableDropDown").html(dropTable)
    }else{
      $("#searchTableDropDown").html("")
    }
    
    if(e.keyCode == 13){
      searchName = $("#searchTableDropDown").find("a").eq(0).text() 
      searchMultipleName(searchName)
    }
      
  })
  
  $("#searchTableDropDown").on("click","a", function(){
    searchName = $(this).text() 
    searchMultipleName(searchName)
  })

  $(".changeGraph").change(function(){
  
   subLevel = $(this).val()
   if(subLevel=="-Activity-" || subLevel=="-Occupation-") return
  
   if($(this).attr("id")=="categorySelect"){
    type = "Category"
    }else{
    type = "Activity"
    }
    
    settings = retrieveOptions(type)
    if(type == "Category"){
      options = settings["options"]
      otherOptions = settings["otherOptions"]
    }else{
      otherOptions = settings["options"]
      options = settings["otherOptions"]
    }
    
    $("#chosen").html(subLevel)
    $("#holdDropValue").val(subLevel)
    $("#holdDropType").val(type)

    updateGraphs(testingDat1,type,subLevel,options,otherOptions,metric)

  })

  changeGraphType = function(d){
    //metric = $(this).val()
    type = $("#holdDropType").val()
    subLevel = $("#holdDropValue").val()
    
    settings = retrieveOptions(type)
    if(type == "Category"){
      options = settings["options"]
      otherOptions = settings["otherOptions"]
    }else{
      otherOptions = settings["options"]
      options = settings["otherOptions"]
    }
  
    metric ="absolute"
    //if($(this).val()==1){
    if(d==0){
     donutChart = true
    }else{
     donutChart = false   
    }
    
    updateGraphs(testingDat1,type,subLevel,options,otherOptions,metric)
  
  }

  $("#resetButton").click(function(){
  
    $("#resetButton").css("visibility","hidden")
    $("#slideVal").html("")
  
    
    type = $("#holdDropType").val()
    subLevel = $("#holdDropValue").val()
    
    
    settings = retrieveOptions(type)
    if(type == "Category"){
      options = settings["options"]
      otherOptions = settings["otherOptions"]
    }else{
      otherOptions = settings["options"]
      options = settings["otherOptions"]
    }
  
    metric ="absolute"
    
    updateGraphs(testingDat1,type,subLevel,options,otherOptions,metric)
  
  })
})

function buildSelects(data){
  //build by category
  categories = data.map(function(d) {return d.Category})
  categories = _.uniq(categories)
  
  activities = data.map(function(d) {return d.Activity})
  activities = _.uniq(activities)
  
  builds = [categories,activities]
  index = 0
  topOptions=["-Occupation-","-Activity-"]
  
  console.log(top)

  builds.forEach(function(dat){
  output = "<option value='"+topOptions[index]+"'>"+topOptions[index]+"</option>"
    dat.forEach(function(out){
      output = output+"<option value='"+out+"'>"+out+"</option>"
    })
    elementID = ["#categorySelect","#activitySelect"][index]
    index +=1
    
    $(elementID).html(output)

  })
}

function buildGraphData(data,pickType,subLevel,options,otherOptions,color){
 
  activities= options
  output = []
  
  secondLevel = "Activity"
  if(subLevel == "Activity"){
    secondLevel = "Category"
  }

  for(j=1;j<=24;j++){

    newObj = {}
  
    tempDat = data.filter(function(d){
      return d[subLevel] == pickType //generalize this
    })
    newObj["TimeZone"] = j
    activities.forEach(function(cat){
      peoples = []
      tempDat.filter(function(d){
        if(d[secondLevel] == cat && ((d.StartGMT <=j && d.StopGMT>j) || ((parseInt(d.StopGMT) < parseInt(d.StartGMT)) && (j > d.StartGMT || j <= d.StopGMT)))){
          peoples.push(d.Name)
          //pointArray.filter(function(e) { return e.Name==d.Name}).map(function(e) {return e.color = color(cat)})
        }
      })
      newObj[cat] = peoples
    })
    
    otherOptions.forEach(function(d){
      newObj[d] = []
    
    })
    
    output.push(newObj)
  }
  //return a second array of names, lat lng activity for the map points
  allOut = output  
  return allOut

}

function filterByDate(activityData,lifeData,date){

  selection = lifeData.filter(function(e){ 
    if(parseInt(e.Start) <= date && parseInt(e.Stop) >= date){
      return e
    }
  }).map(function(e){ return e.Name})
  
  
  output = activityData.filter(function(e){
    if(selection.indexOf(e.Name)>=0){
      return e
    }
  })
  
  return output

}

function relativeAbundance(data,type,subLevel){

    optionTimes = {}
    otherOptions.forEach(function(e){
      optionTimes[e]=0
    })
  
  total = 0

  if(type=="Activity"){
    data.forEach(function(e){
      if(parseInt(e.StartGMT)<parseInt(e.StopGMT)){
        time = parseInt(e.StopGMT)-parseInt(e.StartGMT)
      }else{
        time = parseInt(24-e.StartGMT)+parseInt(e.StopGMT)
      }
      
      optionTimes[e.Activity] += time
      total += time
    })
  
  }else{
     nameArray = []
     data.forEach(function(e){
      if(nameArray.indexOf(e.Name)<0){
        nameArray.push(e.name)
        optionTimes[e.Category] += 1
        total += 1
      }
      
    })
  }
  
  subLevelTime = optionTimes[subLevel]
  percent = subLevelTime/total

  return percent

}


buildLineGraphDat = function(data){
  
  lineDat = []
  for(i=minSlide;i<=maxSlide;i++){
    yearDat = filterByDate(testingDat1,tempDates,i)
    if(yearDat.length==0){
      percent = 0
    }else{
      percent = relativeAbundance(yearDat,type,subLevel)
    }
    lineDat.push({date: i, close: percent})
  }
  
  buildTimeSeries(lineDat)
}


updateLineGraph = function(data){
  
  lineDat = []
  for(i=minSlide;i<=maxSlide;i++){
    yearDat = filterByDate(testingDat1,tempDates,i)
    if(yearDat.length==0){
      percent = 0
    }else{
      percent = relativeAbundance(yearDat,type,subLevel)
    }
    lineDat.push({date: i, close: percent})
  }
  
  updateTimeSeries(lineDat)

}


clickLegend = function(d){

//turn the below into seperate function
  type = $("#holdDropType").val()
  if(type == "Category"){
    type = "Activity"
    $("#holdDropType").val(type)
  }else{
    type = "Category"
    $("#holdDropType").val(type)
  }
  subLevel = d
  $("#holdDropValue").val(subLevel)
  
  settings = retrieveOptions(type)
  if(type == "Category"){
    options = settings["options"]
    otherOptions = settings["otherOptions"]
  }else{
    otherOptions = settings["options"]
    options = settings["otherOptions"]
  }
  
  
  metric ="absolute"
  $("#chosen").html(subLevel)

  updateGraphs(testingDat1,type,subLevel,options,otherOptions,metric)

}

searchNamesFunc = function(d){  
  searchMultipleName(d.people)
}

searchMultipleName = function(searchName){

    allNames = []
   
    tempDat = testingDat1.filter(function(e) {
     if(searchName.indexOf(e.Name)>-1){
        allNames.push(e.Name)
        return e.Name
     }
    })
    
    subLevel=tempDat[0].Category
    
    type = "Category"
    $("#holdDropType").val(type)
    
    settings = retrieveOptions(type)
    if(type == "Category"){
      options = settings["options"]
      otherOptions = settings["otherOptions"]
    }else{
      otherOptions = settings["options"]
      options = settings["otherOptions"]
    }
    
    allNames = _.uniq(allNames).join(", <br>")
   
    metric ="absolute"
    //put a dynamic font changer here to fit all input in box
    $("#chosen").html(allNames)


    temp = tempDates.filter(function(e){
      return searchName.indexOf(e.Name)>-1
    })
    
    temp = temp[0]
    newVal = parseInt(temp.Stop)-((parseInt(temp.Stop)-parseInt(temp.Start))/2)
    //alert(newVal)
    $("#dateSlider").slider("value",newVal)
    $("#searchTableDropDown").html("")
    updateGraphs(tempDat,type,subLevel,options,otherOptions,metric)
  

}


retrieveOptions = function(type){
    
    options = $.map($("#activitySelect option") ,function(option) {
      if(option.value!="-Activity-" && option.value!="-Occupation-" ){
        return option.value;
      }
    });
    
    otherOptions = $.map($("#categorySelect option") ,function(option) {
      if(option.value!="-Activity-" && option.value!="-Occupation-" ){
        return option.value;
      }
    });
   
    return {"options": options, "otherOptions": otherOptions}

}



/*
function setCurrentTime(arrowVal,baseMapWidth){

  dayMinute = (arrowVal/(baseMapWidth/1440)+720) % 1440
  
  printHour = Math.floor((dayMinute/1440)*24)
  printMinutes = Math.floor(dayMinute-(60*printHour))
  if(printMinutes<10){
    printMinutes = "0"+printMinutes
  }
  
  timeOutput = printHour+":"+printMinutes+" GMT"
  $("#currentTime").text(timeOutput)
  
  updateGraphs(testingDat1,printHour)
  
  }
  
  function spinGlobe(){
  
    console.log("spin globe")
     console.log(arrowValue)
      console.log(baseMapWidth)
    arrowValue +=5
    
    baseMapWidth = 960
    arrowValueOffset= arrowValue % baseMapWidth
      
    $("#chloropleth1").css("margin-left",arrowValueOffset % baseMapWidth)
    $("#chloropleth3").css("margin-left",arrowValueOffset % baseMapWidth)
    $("#locations1").css("margin-left",arrowValueOffset % baseMapWidth)
    
    if(arrowValueOffset != 0){
      $("#chloropleth2").css("display","")
      $("#chloropleth4").css("display","")
      $("#locations2").css("display","")
  
      $("#chloropleth2").css("margin-left", -(Math.abs((baseMapWidth-arrowValueOffset) % baseMapWidth)))
      $("#chloropleth4").css("margin-left", -(Math.abs((baseMapWidth-arrowValueOffset) % baseMapWidth)))
      $("#locations2").css("margin-left", -(Math.abs((baseMapWidth-arrowValueOffset) % baseMapWidth)))
  
   }else{
      $("#chloropleth2").css("display","none")
      $("#chloropleth4").css("display","none")
      $("#locations2").css("display","none")
  
      //$("#chloropleth2").css("margin-left", -(Math.abs((baseMapWidth-arrowValueOffset) % baseMapWidth)))
    }
  
  
    setCurrentTime(arrowValue,baseMapWidth)
    
  
  }
  


function slideSpeed(speed){

 keepSpin = true;
  //$("#chloropleth1").css("clip","rect(0px,"+$("#chloropleth1").css("width")+", "+$("#chloropleth1").css("height")+","+$("#chloropleth1").css("width")+arrowValue+"px)")
  //$("#chloropleth2").css("clip","rect(0px,"+arrowValue+"px, "+$("#chloropleth1").css("height")+","+0+"px)")
  //$("#chloropleth1").css("left",arrowValue+"px")
  //$("#chloropleth2").css("left",(parseInt($("#chloropleth2").css("width"))-arrowValue)+"px")

  //spinGlobe()
 
  
  if(keepSpin){ 

    keepSpin = setInterval(function() { spinGlobe()}, speed); 
  }
    
}



function slideChanged(val){

  baseLines = [0,12,12,0,0,0,12,12,0,0]
  mapWidth = 960
  
  clipPolygon = document.getElementById("poly")
  nodes = clipPolygon.getAttribute("points")
  nodeArray = nodes.split(",")
  
  newNodes = []
  $.each(nodeArray, function(index,value){
    xNode = value.split(" ")[0]
    yNode = value.split(" ")[1]
    if(index < 5){
      xNode = (val+baseLines[index])*(960/24)
    }

    if(val>12 & index>=5){
      
      if(index == 6 || index == 7){
        xNode = (val-baseLines[index])*(960/24)
      }else{
        xNode = 0 
      }
    }
    
    if(val<=12 & index>=5){
      xNode = 0
    }
    xNode = Math.min(xNode, 960)
    newNodes.push(xNode+" "+yNode)
    
  })
  
  newNodesOut = newNodes.join(",")
  
  document.getElementById("poly").setAttribute("points", newNodesOut)
  $("#mapContainerDay").css("margin-left",  $("#mapContainerDay").css("margin-left"))
 
  

}
*/
/*
function buildGraphData(data,currentHour,chooseActivity,color){
  chooseActivity == chooseActivity || "Sleeping"
//depending on speed, if slow only run after slider has stopped
//currentHour should be in GMT and the database start and stop shoudl refer to GMT (
  activities= ["Drinking","Working","Sleeping"]
  categories = ["Poet","Writer","Scientist","Composer"]
  output = []
  pointArray = data
  pointArray.forEach(function(d) {
    d.color = "white"
  })
  
  specificGraph = []
  for(i=13;i<=36;i++){
    j = (currentHour+i) % 24
    if(j==0) j = 24
    
    newObj = {}
    specificObj = {}
    tempDat = data.filter(function(d){
      return d.TimeZone == j
    })
    newObj["TimeZone"] = j
    specificObj["TimeZone"] = j
    activities.forEach(function(cat){
      peoples = []
      tempDat.filter(function(d){
        if(d.Activity == cat && d.StartGMT <=currentHour && d.StopGMT>=currentHour){
          peoples.push(d.Name)
          pointArray.filter(function(e) { return e.Name==d.Name}).map(function(e) {return e.color = color(cat)})
        }
      })
      newObj[cat] = peoples
    })
    
    
    output.push(newObj)
    workDat = tempDat.filter(function(d){
    
      return d.Activity== chooseActivity
    })
    
    categories.forEach(function(cat){
      peoples = []
      workDat.filter(function(d){
        if(d.Category == cat && d.StartGMT <=currentHour && d.StopGMT>=currentHour){
          peoples.push(d.Name)
        }
      })
      specificObj[cat] = peoples
    })
    
    specificGraph.push(specificObj)
  }
  //return a second array of names, lat lng activity for the map points
  allOut = { activityGraph: output, pointOutput: pointArray, categoryGraph: specificGraph}
  return allOut


}
*/



//should also have a graph where you can choose activity, and then shows how many/which people were doing that activity (sleep, awake, working, drinking) in each artist/scientist category for that timezone