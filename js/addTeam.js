var teamNames = sessionStorage.teamNames.split(',')

for(var i=0; i<teamNames.length; i++){
  if(teamNames[i] == ""){
    teamNames.splice(i,1)
  }
}
$("#teamAppender").html(
    '<pre class="col-sm-12 well well-sm">'+
      '<ul id="teamNames">'+
      '</ul>'+
    '</pre>'
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

$("#teams").on("keyup", function(){
  if(event.keyCode == 13){
    $("#addTeam").click()
  }
})

function newButtonChecker(){
  if($("#teamNames li").length == sessionStorage.numberOfTeams) {
    sessionStorage.teamNames = teamNames
    $("#teams").css("display", "none")
    $("#button").html(
    '<div class="btn-group btn-group-justified" role="group">'+
      '<div class="btn-group" role="group">'+
        '<button id="editTeam" class="btn btn-primary" role="group">Edit Teams</button>'+
      '</div>'+
      '<div class="btn-group" role="group">'+
        '<button id="addEvents" class="btn btn-primary" role="group">Add Events</button>'+
      '</div>'+
      '<div class="btn-group" role="group">'+
        '<button id="reset" class="btn btn-primary" role="group">Start Over</button>'+
      '</div>'+
    '</div>'
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