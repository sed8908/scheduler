$("#create").on("click", function() {
  $("#results").empty()
  var num_of_teams = 2
  var team_length = $('#teams').val()
  var event_length = $('#events').val()
  var rounds_length = calculate_rounds_length(team_length, event_length)
  output_schedule_header(event_length);
  var schedule = []
  schedule.rounds = initialize_rounds(rounds_length, event_length, num_of_teams)
  for(var roundCounter=0; roundCounter < rounds_length; roundCounter++){
    events = []
    var extend = roundCounter
    for(var eventCounter=0; eventCounter < event_length; eventCounter++){
      teams = []
      for(var teamCounter=0; teamCounter < num_of_teams; teamCounter++){
        var team = getRandomInt(0, team_length)
        while(already_in_round(team, roundCounter, schedule) || already_in_event(team, eventCounter, schedule) || teams.includes(team)){
          team = getRandomInt(0, team_length)
        }
        teams.push(team)
      }
      schedule.rounds[extend].events[eventCounter]= {
        eventName: "Event "+(eventCounter+1),
        team1: teams[0],
        team2: teams[1]
      }
    }
  }
  console.log(schedule)
  output_schedule_body(schedule);
})

function calculate_rounds_length(team_length, event_length){
  var result = 0
  if(team_length > event_length){
    result = team_length/2
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
      $("#schedule").append("<td>Team "+schedule.rounds[i].events[j].team1+" & Team "+schedule.rounds[i].events[j].team2+"</td>")
    }
    $("#schedule").append("</tr>")
  }

}
function already_in_round(team, roundCounter, schedule){
  var result = false
  if(schedule.rounds[roundCounter] != undefined){
    var round = schedule.rounds[roundCounter]
    outerloop:
    for(var i=0; i<round.events.length; i++){
      var event = round.events[i]
      if(event.team1 === team || event.team2 === team){
        result = true
        break outerloop
      }
    }
  }
  return result
}

function already_in_event(team, eventCounter, schedule){
  var result = false
  if(schedule.rounds != undefined){
    outerloop:
    for(var i=0; i<schedule.rounds.length;i++){
      var event = schedule.rounds[i].events[eventCounter]
      if(event.team1 === team || event.team2 === team){
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
    var events = []
    for(var j=0; j < event_length; j++){
      rounds[i].events[j] = {
        eventName: "Event "+(j+1),
        team1: "",
        team2: ""
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
