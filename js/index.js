sessionStorage.numberOfEvents = []
sessionStorage.numberOfTeams = []
sessionStorage.teamNames = []
sessionStorage.eventNames = []

$("#teamEntry").on("click", function(){
  sessionStorage.numberOfTeams = $('#teams').val()
  sessionStorage.numberOfEvents = $('#events').val()
  var answer = $("input[name='option']:checked").val();

  if(($('#teams').val() == '') || ($('#events').val() == '')){
    alert("Whoops! You need to enter an amount for teams and events to continue.")
  }else if(answer == "auto"){
    sessionStorage.teamNames = []
    sessionStorage.eventNames = []
    window.location.href = "views/schedule.html"
  } else if(answer == "manual"){
    window.location.href = "views/addTeams.html"
  } else {
    alert("Whoops! You need to choose whether you want to enter in team and event names manually, or just have the app use numbers for names.")
  }

})