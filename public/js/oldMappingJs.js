

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

