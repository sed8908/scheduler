debugger
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
        eventNames[i]+
      '</li>'
  )
}

newButtonChecker()
$("#addEvent").on("click", function(){
  console.log($("#eventNames li").length)
  debugger
  if(inputIsBlank()){
    alert("Whoops, you have to enter in a name for this to work.")
  }else {
    if($("#eventNames li").length < parseInt(sessionStorage.numberOfEvents)){
      $("#eventNames").append(
        '<li>'+
          $("#events").val()+
        '</li>'
      )
      eventNames.push($("#events").val())
    }
    newButtonChecker()
    $("#events").val("")
  }
})

$("body").on("click", "#editEvent", function(){
  window.location.href = "editevents.html"
})

$("body").on("click", "#addEvents", function(){
  window.location.href = "addEvents.html"
})

$("body").on("click", "#reset", function(){
  window.location.href = "../index.html"
})

function newButtonChecker(){
  if($("#eventNames li").length == sessionStorage.numberOfEvents) {
    sessionStorage.eventNames = eventNames
    $("#button").html(
    '<button id="editEvent" class="btn btn-primary">Edit events</button>'+
    '<button id="reset" class="btn btn-primary">Start Over</button>'
  )
  }
}

function inputIsBlank(){
  result = false
  if($("#events").val() == ""){
    result = true
  }
  return result
}