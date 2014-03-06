$(document).ready(function(){

  $(function() {
    $("#changeGraphTypeSlider").slider({
      value: 1,
      orientation: "vertical",
      min: 0,
      max: 1,
      step: 1,
      slide: function( event, ui ) {
       
        changeGraphType(ui.value)
     
      }
    });
    
   $("#dateSlider").slider({
      value: 0,
      min: 0,
      max: 100,
      step: 1,
      slide: function( event, ui ) {
        $("#slideVal").text(ui.value)
        $("#resetButton").css("visibility","visible")
      },
      change: function( event, ui ) {
        if (event.originalEvent) {
          yearDat = filterByDate(testingDat1,tempDates,ui.value)
          console.log(yearDat)
          console.log("yearDat")
          updateGraphs(yearDat,type,subLevel,options,otherOptions,metric)
        }
      }
    });
  });

});