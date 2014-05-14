$(document).ready(function(){
  
  $("#searchPerson").keyup(function(e){
    search = $(this).val()
    regSearch=RegExp(search,"i")
    if($(this).val().length>2) {
      searchNames = _.uniq(testingDat1.filter(function(e) { return e.Name.match(regSearch)}).map(function(d) {return d.Name}))
      searchNames = searchNames.slice(0,8)
      if(searchNames.length==0){
        searchNames = ["No matches in database"]
      }
      
      dropTable = ""
      searchNames.forEach(function(d){
        dropTable = dropTable+"<tr><td><a class='clickName'>"+d+"</a></td></tr>"
      })
      $("#searchTableDropDown").html(dropTable)
    }else{
      $("#searchTableDropDown").html("")
    }
    
    if(e.keyCode == 13){
      searchName = $("#searchTableDropDown").find("a").eq(0).text() 
      if(searchName=="No matches in database") return
      searchMultipleName(searchName)
    }
      
  })
  
  
  $("#content").on("click",".clickName", function(){
    searchName = $(this).text() 
    $("#holdDropType").val("Category")
    if(searchName=="No matches in database") return

    searchMultipleName(searchName)
  })

  $(".changeGraph").change(function(){
    changeGraphFunc($(this))
   // $("#backLevel").fadeOut()
    $("#backLevel").animate({"opacity": 0},"fast",function(){
      $("#backLevel").css("visibility","hidden")
    })
   
  })
 
  function changeGraphFunc(d,backButtonPressed){
    
    subLevel = $(d).val()
  
    if($(d).attr("id")=="categorySelect"){
      type = "Category"
    }
    
    if(subLevel=="-Occupation-") {
      type = "Activity"
      subLevel = $("#activitySelect").val()
    }
    
    $("#holdDropValue").val(subLevel)
    $("#holdDropType").val(type)
    
    $("#dateSlider").slider("value",0)
    singleName = false
    updateGraphs(testingDat1,backButtonPressed)
    $("#resetButton").css("visibility","hidden")


  }

  changeGraphType = function(d){
    type = $("#holdDropType").val()
    subLevel = $("#holdDropValue").val()
  
    //if($(this).val()==1){
    if(d==0){
     donutChart = true
    }else{
     donutChart = false   
    }
    
  
    $("#backLevel").animate({"opacity": 0},"fast",function(){
      $("#backLevel").css("visibility","hidden")
    })

    updateGraphs(filterDat)
  
  }

  $("#resetButton").click(function(){
  
    $("#resetButton").css("visibility","hidden")
    $("#slideVal").html("")
  
    type = $("#holdDropType").val()
    subLevel = $("#holdDropValue").val()
  
    $("#dateSlider").slider("value",0)
    updateGraphs(testingDat1)
    
    
    $("#backLevel").animate({"opacity": 0},"fast",function(){
      $("#backLevel").css("visibility","hidden")
    })

  
  })
  
  $("#backLevel").click(function(d){
     $("#backLevel").animate({"opacity": 0},"fast",function(){
      $("#backLevel").css("visibility","hidden")
    })
    changeGraphFunc($(".changeGraph"),true) 
  
  })
 
})

function buildSelects(data){

  topOptionsMapper = {
    Poet: "Poets",
    Writer: "Writers",
    Architect: "Architects",
    Filmaker: "Filmakers",
    Artist: "Artists",
    Philosopher: "Philosophers",
    Composer: "Composers",
    Scientist: "Scientists",
    Working: "working",
    Walking: "walking",
    Drinking: "drinking",
    Sleeping: "sleeping",
    Visiting: "visiting",
    Teaching: "teaching"
  }
  
  categories = data.map(function(d) {return d.Category})
  categories = _.uniq(categories)
  
  activities = data.map(function(d) {return d.Activity})
  activities = _.uniq(activities)
  
  builds = [categories,activities]
  index = 0
  topOptions=["-Occupation-","-Activity-"]
  
  
  builds.forEach(function(dat){
    if(index==0){
      output = "<option value='"+topOptions[index]+"'>"+"Thinkers (All)"+"</option>"
    }else{
      output = ""
    }
    
    dat.forEach(function(out){
      output = output+"<option name='"+out+"' value='"+out+"'>"+((out=="Social Events") ? "at a social event": topOptionsMapper[out])+"</option>"
    })
    elementID = ["#categorySelect","#activitySelect"][index]
    index +=1
   
    $(elementID).html(output)

  })
  
  return categories
}

function buildGraphData(data){//,pickType,subLevel,options,otherOptions,color){
    
  showKind = $("#categorySelect").val()
  type="Category"
  if(showKind =="-Occupation-") {
    type = "Activity"
    pickType = $("#activitySelect").val()
  }
  
  settings = retrieveOptions(type)
 
  if(type == "Category"){
    options = settings["Category"]
    otherOptions = settings["Activity"]
  }else{
    otherOptions = settings["Category"]
    options = settings["Activity"]
  }

  subLevel = type
 
  activities = options
  output = []
  allNames = []
  

  occupation = $("#categorySelect").val()
  activity = $("#activitySelect").val()

  secondLevel = "Activity"
  if(subLevel == "Activity"){
    secondLevel = "Category"
  }
 
  if(occupation != "-Occupation-"){
    tempDat = data.filter(function(d){
    return d["Category"] == occupation//generalize this
  })}else{
    tempDat = data
  }
  
  if(occupation=="-Occupation-"){
    tempDat = tempDat.filter(function(d){
      return d["Activity"] == activity //generalize this
    })
  }

  output = createDaySchedule(tempDat,activities,secondLevel,otherOptions)
 
  allNames = _.uniq(allNames)  
  allNames = allNames.sort(compareLastWord)
  
  if(allNames.length>1){
    allNamesText=""
    allNames.forEach(function(d){
      allNamesText = allNamesText+"<a class='clickName'>"+d+"</a><br>"
    })
  }else{
    
    startingName = allNames
    linkName = "https://en.wikipedia.org/wiki/"+allNames
    linkName = linkName.replace(" ","_")
    allNamesText = "<a id='currentViewingName' class='clickName' href='"+linkName+"' target='_blank'>"+allNames+"</a><br><div id='correlationNav'>"//make link to wiki here
    activityArray = findCorrelations(output)
  
    data = $.extend(testingDat1,[])
    
    correlationOutput = createDaySchedule(data,activities,secondLevel,otherOptions)

    allNames = _.uniq(allNames)
    allNamesArray = []
    allNames.forEach(function(d){
      if(d != startingName){
        allNamesArray.push({name: d, score: 0})
      }
    })
    
    index= 0
    activityArray.forEach(function(hour){
      hour.forEach(function(activityKey){
        tempSelect = correlationOutput[index][activityKey]
        tempSelect.forEach(function(match){
          if(match != startingName){
            allNamesArray.filter(function(matchPair){ return matchPair.name==match})[0].score += 1
          }
        })
      })
      index += 1
    })
    
    allNamesArray.sort(compare)
    
    allNamesText = allNamesText+"<span> Routine is most similar to:</span><br>"
    allNamesArray.slice(0,3).forEach(function(d){
      allNamesText = allNamesText+"<a class='clickName'>"+d.name+"</a><br>"
    })
    
    allNamesText = allNamesText+"<span> Routine is least similar to:</span><br>"
    
    lowestMatch = allNamesArray.filter(function(d) {return d.score == 0})
    if(lowestMatch.length>1){
      navMatch = []
      for(i=0;i<1;i++){
        select = Math.floor(Math.random(0,1)*lowestMatch.length)
        navMatch.push(lowestMatch[select])  
      }
        navMatch.forEach(function(d){
        allNamesText = allNamesText+"<a class='clickName'>"+d.name+"</a><br>"
      })
    }else{
      allNamesArray.slice(allNames.length-2,allNames.length-1).forEach(function(d){
        allNamesText = allNamesText+"<a class='clickName'>"+d.name+"</a><br>"
      })
    }
    allNamesText = allNamesText+"</div>" 
  }
  
  $("#chosen").html(allNamesText)
  allOut = output  
 
  return allOut
}


function createDaySchedule(data,activities,secondLevel,otherOptions){
 
  allNames = []
  functionOutput = []  
  for(j=1;j<=24;j++){

    newObj = {}
    newObj["TimeZone"] = j
    activities.forEach(function(cat){
      peoples = []
      data.filter(function(d){
        if(d[secondLevel] == cat && ((parseInt(d.StartGMT) <=j && parseInt(d.StopGMT)>j) || ((parseInt(d.StopGMT) < parseInt(d.StartGMT)) && (j >= parseInt(d.StartGMT) || j < parseInt(d.StopGMT))))){
          peoples.push(d.Name)
          allNames.push(d.Name)            
        }
      })
      newObj[cat] = peoples
    })
    otherOptions.forEach(function(d){
      newObj[d] = []
    })
    functionOutput.push(newObj)
  }
  return functionOutput
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

function relativeAbundance(data,type,subLevel,sendOptions){
    
  occupation = $("#categorySelect").val()
  optionTimes = {}
  sendOptions.forEach(function(e){
    optionTimes[e]=0
  })
  
  total = 0

  data.forEach(function(e){
    if(parseInt(e.StartGMT)<parseInt(e.StopGMT)){
      time = parseInt(e.StopGMT)-parseInt(e.StartGMT)
    }else{
      time = parseInt(24-e.StartGMT)+parseInt(e.StopGMT)
    }
    
    optionTimes[e.Activity] += time
    total += time
  })
  
 
  subLevelTime = optionTimes[subLevel]
  percent = subLevelTime/total

  if(subLevel == "-Occupation-") percent = 1
  return percent

}


buildLineGraphDat = function(data,subLevel){
  
  occupation = $("#categorySelect").val()
  activity = $("#activitySelect").val()
  lineDat = []
  
  settings = retrieveOptions(type)
  if(type=="Category"){
    sendOptions = settings["Activity"]
  }else{
    sendOptions = settings["Category"]
  }
  
  if(occupation != "-Occupation-"){
    data=data.filter(function(d){
      return d.Category==occupation
    })
  }
  
  lineDat = createLineDat(data,tempDates,type,activity,sendOptions,occupation)

  buildTimeSeries(lineDat)
}

updateLineGraph = function(data,subLevel){

  occupation = $("#categorySelect").val()
  activity = $("#activitySelect").val()
  
  if(occupation != "-Occupation-"){
    data=data.filter(function(d){
      return d.Category==occupation
    })
  }
  
  settings = retrieveOptions(type)
  if(type=="Category"){
    sendOptions = settings["Category"]
  }else{
    sendOptions = settings["Activity"]
  }
  
  if(occupation == "-Occupation-") sendOptions = settings["Category"]
  
  lineDat = createLineDat(data,tempDates,type,activity,sendOptions,occupation)
  updateTimeSeries(lineDat)

}

function createLineDat(data,tempDates,type,activity,sendOptions,occupation){

  lineDat = []
  for(i=minSlide;i<=maxSlide;i++){
      yearDat = filterByDate(data,tempDates,i)
      if(yearDat.length==0){
        percent = 0
        people = []
      }else{
        percent = relativeAbundance(yearDat,type,activity,sendOptions)
        //people = _.uniq(yearDat.filter(function(y){ if(y[type]==subLevel) return y}).map(function(z) {return z.Name}))
        people = _.uniq(yearDat.filter(function(y){ if((y["Category"]==occupation || occupation=="-Occupation-") && y["Activity"]==activity) return y}).map(function(z) {return z.Name}))
      }
      lineDat.push({date: i, close: percent, people: people})
    }

  return lineDat
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
  
 
  $("#chosen").html(subLevel)

  $("#dateSlider").slider("value",0)
  updateGraphs(testingDat1)

}

searchNamesFunc = function(d){ 
  
  if(d.people.length==1 && singleName==true){
    $("#activitySelect")
      .val(d.name)
      .trigger('change')
  }else if($("#categorySelect").val()=="-Occupation-"){
    searchMultipleName("All",d.name)
  }else{
    searchMultipleName(d.people)
  }
}

searchMultipleName = function(searchName,categoryInput){
    categoryInput = categoryInput || null
    allNames = []
    categories = []
    tempDat = testingDat1.filter(function(e) {
     if(searchName.indexOf(e.Name)>-1 || (searchName=="All" && e.Category==categoryInput)){
        allNames.push(e.Name)
        categories.push(e.Category)
        return e.Name
     }
    })
    
    categories = _.uniq(categories)
    
    subLevel=tempDat[0].Category
    
    type = "Category"
    $("#holdDropType").val(type)
    $("#holdDropValue").val(tempDat[0].Category)
    
    categoryChoose = (categories.length>1) ? "-Occupation-" : categories[0]
    
    $("#categorySelect").find("[name="+ categoryChoose+"]").attr("selected","selected")
    
   
    allNames = _.uniq(allNames)
    if(allNames.length>1){
      allNamesText=""
      allNames.forEach(function(d){
        allNamesText = allNamesText+"<a class='clickName'>"+d+"</a><br>"
      })
   
    
    }else{
      allNamesText = allNames
    }
   // allNames = _.uniq(allNames).join(", <br>")
    //put a dynamic font changer here to fit all input in box
    $("#chosen").html(allNamesText)
    
    if(allNames.length==1) {
      singleName=true
      }else{
      singleName=false
      }

    temp = tempDates.filter(function(e){
      return searchName.indexOf(e.Name)>-1
    })
    
    
    if(temp.length<1) {
      temp = [{Name: searchName, Start:minSlide, Stop:maxSlide}]
      }
        
    temp = temp[0]
    newVal = parseInt(temp.Stop)-((parseInt(temp.Stop)-parseInt(temp.Start))/2)
    $("#dateSlider").slider("value",newVal)
    $("#searchTableDropDown").html("")
    
    $("#backLevel a").text("View all "+$("#categorySelect option:selected").text())
    if(searchName != "All"){
      $("#backLevel").animate({"opacity": 1},"fast",function(){
        $("#backLevel").css("visibility","visible")
      })
    }
    updateGraphs(tempDat)
  
}


function retrieveOptions(type){
    
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
   
    return {"Category": options, "Activity": otherOptions}

}


function findCorrelations(data){

  //get an array of the activity done for each hour by person of interest
  activityArray = []
  index = 0
  data.filter(function(d){
    activityArray.push([])
    options.forEach(function(opt){
      if(d[opt].length>0){
        activityArray[index].push(opt)
      }
    })
    index += 1
  
  })
  
  return activityArray
  
  //now go through a complete hour by hour schedule for all activities/occupations
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


compareLastWord = function(a,b){
  aLast = a.match(/[A-z-]*$/)
  bLast = b.match(/[A-z-]*$/)
  if([aLast,bLast].sort()[0] == aLast){
    return -1
    }else{
    return 1
    }

}

//should also have a graph where you can choose activity, and then shows how many/which people were doing that activity (sleep, awake, working, drinking) in each artist/scientist category for that timezone