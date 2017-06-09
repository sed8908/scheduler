var eventNames = sessionStorage.eventNames.split(',')

for(var i=0; i<eventNames.length; i++){
  if(eventNames[i] == ""){
    eventNames.splice(i,1)
  }
}
$("#eventAppender").html(
    '<pre class="col-sm-12 well well-sm">'+
      '<ul id="eventNames">'+
      '</ul>'+
    '</pre>'
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

$("body").on("click", "#createSchedule", function(){
  window.location.href = "schedule.html"
})

$("body").on("click", "#reset", function(){
  window.location.href = "../index.html"
})

function newButtonChecker(){
  if($("#eventNames li").length == sessionStorage.numberOfEvents) {
    sessionStorage.eventNames = eventNames
    $("#button").html(
    '<div class="btn-group btn-group-justified">'+
      '<button id="editEvent" class="btn btn-primary">Edit events</button>'+
      '<button id="createSchedule" class="btn btn-primary">Create Schedule</button></button>'+
      '<button id="reset" class="btn btn-primary">Start Over</button>'+
    '</div>'
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