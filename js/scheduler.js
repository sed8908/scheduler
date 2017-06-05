$("#create").on("click", function() {
  $("#results").empty()
  var num_of_teams = 2
  var team_length = $('#teams').val()
  var event_length = $('#events').val()
  var rounds_length = calculate_rounds_length(team_length, event_length)
  output_schedule_header(event_length);
  var schedule = new Array()
  debugger
  schedule.rounds = initialize_rounds(rounds_length, event_length, team_length, num_of_teams)
  schedule = add_empty_events(schedule, team_length, event_length, num_of_teams)
  //schedule = add_bye_rounds(schedule)
  main:
  for(var roundCounter=0; roundCounter < rounds_length; roundCounter++){
    assigned_empty = false
    for(var eventCounter=0; eventCounter < event_length; eventCounter++){
      for(var teamCounter=0; teamCounter < num_of_teams; teamCounter++){
        var team = getRandomInt(0, team_length)
        var safetyCheck = 0
        var clearedCheck = 0
          while(schedule.rounds[roundCounter].events[eventCounter].teams.length < 2){
          safetyCheck++
          team = getRandomInt(0, team_length)
          if(team_is_free(team, eventCounter, roundCounter, schedule)){
            schedule.rounds[roundCounter].events[eventCounter].teams.push(team)
          }
          if(safetyCheck > 50){
            clearedCheck++
            schedule = clearRound(schedule, roundCounter)
            teamCounter=0;
            eventCounter=0;
            safetyCheck = 0;
            if(clearedCheck > 10){
              break main
            }
          }
        }
      }
    }
  }
  output_schedule_body(schedule);
})

function calculate_empty_events(team_length, event_length){
  var result = 0
  if(event_length > (team_length/2)){
    result = event_length - (team_length/2)
  }
  return result
}

function calculate_bye_rounds(team_length, event_length){
  var result = 0
  if(event_length < (team_length/2)){
    result = (team_length/2)-event_length
  }
  return result
}

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
      if(schedule.rounds[roundCounter].events[i].teams[0] != -1){
        schedule.rounds[roundCounter].events[i] ={
          eventName: "Event "+(i+1),
          teams: []
        }
      }
  }
  return schedule
}

function calculate_rounds_length(team_length, event_length){
  var result = 0
  team_length = parseInt(team_length)
  event_length = parseInt(event_length)
  if(team_length/2 >= event_length){
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
  debugger
  for(var i=0; i<schedule.rounds.length; i++){
    $("#schedule").append("<tr id='round"+i+"'></tr>")
    $("#round"+i).append("<td>"+schedule.rounds[i].roundName+"</td>")
    for(var j=0; j<schedule.rounds[i].events.length; j++){
      $("#round"+i).append("<td id='r"+i+"e"+j+"'></td>")
      for(var k=0; k<schedule.rounds[i].events[j].teams.length; k++){
        var team = schedule.rounds[i].events[j].teams[k]
        if(team < 0){
          $("#r"+i+"e"+j).append("-")
        }else{
          $("#r"+i+"e"+j).append(parseInt(team)+1)
        }
        if(k < schedule.rounds[i].events[j].teams.length-1){
          $("#r"+i+"e"+j).append(" & ")
        }
      }
    }
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

function initialize_rounds(rounds_length, event_length, team_length, num_of_teams){
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

function add_empty_events(schedule,team_length, event_length, num_of_teams){
  var empty_events = calculate_empty_events(team_length, event_length)
  // var bye_rounds = calculate_bye_rounds(team_length, event_length)
  if(empty_events != 0){
    for(var roundCounter=0; roundCounter <schedule.rounds.length; roundCounter++){
      for(var i=0; i < empty_events; i++){
        var eventCounter = roundCounter+i
        if(eventCounter >= schedule.rounds[roundCounter].events.length){
          eventCounter = eventCounter - event_length
        }
        for(var j=0; j < num_of_teams; j++){
          schedule.rounds[roundCounter].events[eventCounter].teams.push(-1)
        }
      }
    }
  }
  return schedule
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
