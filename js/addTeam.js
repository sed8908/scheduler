var teamNames = sessionStorage.teamNames.split(',')

for(var i=0; i<teamNames.length; i++){
  if(teamNames[i] == ""){
    teamNames.splice(i,1)
  }
}
$("#teamAppender").html(
  '<div class="col-sm-4"></div>'+
    '<pre class="col-sm-4 well well-sm">'+
      '<ul id="teamNames">'+
      '</ul>'+
    '</pre>'+
  '<div class="col-sm-4"></div>'
)
for(var i=0; i<teamNames.length; i++){
  $("#teamNames").append(
      '<li>'+
        teamNames[i]+
      '</li>'
  )
}

newButtonChecker()
$("#addTeam").on("click", function(){
  if(inputIsBlank()){
    alert("Whoops, you have to enter in a name for this to work.")
  }else {
    if($("#teamNames li").length < parseInt(sessionStorage.numberOfTeams)){
      $("#teamNames").append(
        '<li>'+
          $("#teams").val()+
        '</li>'
      )
      teamNames.push($("#teams").val())
    }
    newButtonChecker()
    $("#teams").val("")
  }
})

$("body").on("click", "#editTeam", function(){
  window.location.href = "editTeams.html"
})

$("body").on("click", "#addEvents", function(){
  window.location.href = "addEvents.html"
})

$("body").on("click", "#reset", function(){
  window.location.href = "../index.html"
})

function newButtonChecker(){
  if($("#teamNames li").length == sessionStorage.numberOfTeams) {
    sessionStorage.teamNames = teamNames
    $("#button").html(
    '<button id="editTeam" class="btn btn-primary">Edit Teams</button>'+
    '<button id="addEvents" class="btn btn-primary">Add Events</button>'+
    '<button id="reset" class="btn btn-primary">Start Over</button>'
  )
  }
}

function inputIsBlank(){
  result = false
  if($("#teams").val() == ""){
    result = true
  }
  return result
}