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

        if(ui.value==1){
          $("#clockImg img").fadeIn(1000)
        }else{
          $("#clockImg img").fadeOut()

        }
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
        $("#slideVal").text(ui.value)
        if(ui.value==$("#dateSlider").slider("option","min")){
            $("#slideVal").text("")
        }

        if (event.originalEvent) {
          singleName = false

          yearDat = filterByDate(testingDat1,tempDates,ui.value)
         
          updateGraphs(yearDat)
          
          $("#backLevel a").text("View all "+$("#categorySelect").val().toLowerCase()+"s")
          $("#backLevel").fadeIn()

         // $("#chosen").html(subLevel)
        }
      }
    });
  });

});