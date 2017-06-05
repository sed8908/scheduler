$("#create").on("click", function() {
  $("#results").empty()
  var num_of_teams = 2
  var team_length = $('#teams').val()
  var event_length = $('#events').val()
  var rounds_length = calculate_rounds_length(team_length, event_length)
  output_schedule_header(event_length);
  var schedule = new Array()
  schedule.rounds = initialize_rounds(rounds_length, event_length, num_of_teams)
  main:
  for(var roundCounter=0; roundCounter < rounds_length; roundCounter++){
    for(var eventCounter=0; eventCounter < event_length; eventCounter++){
      for(var teamCounter=0; teamCounter < num_of_teams; teamCounter++){
        var team = getRandomInt(0, team_length)
        var safetyCheck = 0
        var clearedCheck = 0
          while(schedule.rounds[roundCounter].events[eventCounter].teams.length < 2){
          debugger
          team = getRandomInt(0, team_length)
          var passedCheck = team_is_free(team, eventCounter, roundCounter, schedule)
          if(passedCheck == true){
            schedule.rounds[roundCounter].events[eventCounter].teams.push(team)
          }
          safetyCheck++
          if(safetyCheck > 100){
            clearedCheck++
            schedule = clearRound(schedule, roundCounter)
            teamCounter=0;
            eventCounter=0;
            safetyCheck = 0;
            if(clearedCheck > 15){
              break main
            }
          }
        }
      }
    }
  }
  output_schedule_body(schedule);
})

function team_is_free(team, eventCounter, roundCounter, schedule){
  var result = true
  if(already_in_round(team, roundCounter, schedule)){
    result = false
  }
  if(already_in_event(team, eventCounter, schedule)){
    result = false
  }
  return result
}

function clearRound(schedule, roundCounter){
  for(var i=0; i < schedule.rounds[roundCounter].events.length;i++){
      schedule.rounds[roundCounter].events[i] ={
        eventName: "Event "+(i+1),
        teams: []
      }
  }
  return schedule
}

function calculate_rounds_length(team_length, event_length){
  var result = 0
  team_length = parseInt(team_length)
  event_length = parseInt(event_length)
  if(team_length > event_length){
    result = (team_length/2)
  }
  else {
    result = event_length
  }
  result = Math.ceil(result)
  return result
}

function output_schedule_header(event_length){
  $("#results").append("<div id='schedule' class='container'></div>")

  $("#schedule").append("<th></th>")
  for(var i=1; i <= event_length; i++){
    $("#schedule").append("<th>Event "+i+"</th>")
  }

}

function output_schedule_body(schedule){
  for(var i=0; i<schedule.rounds.length; i++){
    $("#schedule").append("<tr>")
    $("#schedule").append("<td>"+schedule.rounds[i].roundName+"</td>")
    for(var j=0; j<schedule.rounds[i].events.length; j++){
      // $("#schedule").append("<td>"+(parseInt(schedule.rounds[i].events[j].team1)+1)+" & "+(parseInt(schedule.rounds[i].events[j].team2)+1)+"</td>")
      // for(var k=0; k<schedule.rounds[i].events[j].teams.length; k++){
        $("#schedule").append("<td>"+(parseInt(schedule.rounds[i].events[j].teams[0]+1))+" & "+(parseInt(schedule.rounds[i].events[j].teams[1]+1))+"</td>")
      // }
    }
    $("#schedule").append("</tr>")
  }

}

function already_in_round(team, roundCounter, schedule){
  var result = false
    var round = schedule.rounds[roundCounter]
    outerloop:
    for(var i=0; i<round.events.length; i++){
      var event = round.events[i]
      for(var j=0; j<event.teams.length; j++){
        var eventTeam = event.teams[j]
        if(eventTeam === team){
          result = true
          break outerloop
        }
      }
    }
  return result
}

function already_in_event(team, eventCounter, schedule){
  var result = false
    outerloop:
    for(var i=0; i<schedule.rounds.length;i++){
      var event = schedule.rounds[i].events[eventCounter]
      for(var j=0; j<event.teams.length; j++){
        var eventTeam = event.teams[j]
        if(eventTeam === team){
          result = true
          break outerloop
        }
      }
    }
  return result
}

function initialize_rounds(rounds_length, event_length, num_of_teams){
  var rounds = []
  for(var i=0; i < rounds_length; i++){
    rounds[i] = {
      roundName: "Round "+(i+1),
      events: []
    }
    for(var j=0; j < event_length; j++){
      rounds[i].events[j] = {
        eventName: "Event "+(j+1),
        teams: []
      }
    }
  }
  return rounds
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
