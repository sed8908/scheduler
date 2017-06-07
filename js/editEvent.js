var eventNames = sessionStorage.eventNames.split(',')

for(var i=0; i<eventNames.length; i++){
  if(eventNames[i] == ""){
    eventNames.splice(i,1)
  }
}

$("#eventAppender").html(
  '<div class="col-sm-4"></div>'+
    '<pre class="col-sm-4 well well-sm">'+
      '<ul id="eventNames">'+
      '</ul>'+
    '</pre>'+
  '<div class="col-sm-4"></div>'

)

for(var i=0; i<eventNames.length; i++){
  $("#eventNames").append(
      '<li>'+
        '<input id="event'+i+'"/>'+
      '</li>'
  )
  $("#event"+i).val(eventNames[i])
}

$("#editEvents").on("click", function(){
  var allFilledIn = true
  for(var i=0; i<$("#eventNames li").length; i++){
    if(inputIsEmpty(i)){
      alert("Whoops, looks like one of the options is blank. Please put something in the form.")
      allFilledIn = false
    }
  }
  if(allFilledIn){
    eventNames = []
    for(var i=0; i<$("#eventNames li").length; i++){
      eventNames.push($("#event"+i).val())
    }
    sessionStorage.eventNames = eventNames
    window.location.href = "schedule.html"
  }
})

function inputIsEmpty(position){
  result = false
    if($("#event"+position).val() == ""){
      result = true
    }
  return result
}