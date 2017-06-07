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
        '<input id="team'+i+'"/>'+
      '</li>'
  )
  $("#team"+i).val(teamNames[i])
}

$("#editTeams").on("click", function(){
  var allFilledIn = true
  for(var i=0; i<$("#teamNames li").length; i++){
    if(inputIsEmpty(i)){
      alert("Whoops, looks like one of the options is blank. Please put something in the form.")
      allFilledIn = false
    }
  }
  if(allFilledIn){
    teamNames = []
    for(var i=0; i<$("#teamNames li").length; i++){
      teamNames.push($("#team"+i).val())
    }
    sessionStorage.teamNames = teamNames
    window.location.href = "addEvents.html"
  }
})

function inputIsEmpty(position){
  result = false
    if($("#team"+position).val() == ""){
      result = true
    }
  return result
}