$("#create").on("click", function() {
  $("#results").empty()
  var team_length = $('#teams').val()
  var event_length = $('#events').val()
  output_schdule_header(event_length);
  var schedule = {}
  var rounds = []
  var events = []
  var teams = []
  teams = initialize_team(team_length)
  events.teams = teams
  rounds.events.teams = events.teams
  var rounds_length = calculate_rounds_length(team_length, event_length)


  for(var roundCounter=1; roundCounter <= rounds_length; roundCounter++){
    for(var eventCounter=1; eventCounter <= event_length; eventCounter++){
      for(var teamCounter=1; teamCounter <= team_length; teamCounter++){
        var team = getRandomInt(0, team_length)
        while(already_in_round(team, roundCounter, schedule) || already_in_event(team, eventCounter, schedule)){
          team = getRandomInt(0, team_length)
        }
        schedule.rounds[roundCounter].events[eventCounter].teams.push(team)
      }
    }
  }
  console.log(schedule)
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

function output_team_schedule(i, team_event_pairs){
  $("#schedule").append(
    "<tr id ='round"+(i+1)+"'><td>Round "+(i+1)+"</td></tr>"
    )
  for(var j=0; j < team_event_pairs.length; j++){
    $("#round"+(j+1)).append(
      "<td>Game "+ team_event_pairs[j] +"</td>"
    )
  }
}

function output_schdule_header(event_length){
  $("#results").append("<div id='schedule' class='container'></div>")
  $("#schedule").append("<th></th>")
  for(var i=1; i <= event_length; i++){
    $("#schedule").append("<th>Game "+i+"</th>")
  }
}

function already_in_round(team, roundCounter, schedule){
  var result = false
  round = schedule.rounds[roundCounter]
  outerloop:
  for(var i=0; i<round.events.length; i++){
    event = round.events[i]
    if(event.includes(team)){
      result = true
      break outerloop
    }
  }
  return result
}

function already_in_event(team, eventCounter, schedule){
  var result = false
  outerloop:
  for(var i=0; i<schedule.rounds.length;i++){
    event = schedule.rounds[i].events[eventCounter]
    if(event.includes(team)){
      result = true
      break outerloop
    }
  }
  return result
}

function initialize_team(team_length){
 var team_array = []
 for(var i=0; i < team_length; i++){
    team_array.push("Team "+i)
  }
 return team_array
}

function initialize_event(event_length){
  var event_array = []
  for(var i=0; i < event_length; i++){
    event_array.push("Event "+i)
  }
  return event_array
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
