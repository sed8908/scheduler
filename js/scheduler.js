$("#create").on("click", function() {
  $("#results").empty()
  var numOfTeams = 2 //TODO: replace with an input
  var teamLength = $('#teams').val()
  var eventLength = $('#events').val()
  var roundsLength = calculateRoundsLength(teamLength, eventLength)
  outputScheduleHeader(eventLength);
  var schedule = new Array()
  schedule.rounds = initializeRounds(roundsLength, eventLength, teamLength, numOfTeams)
  schedule = addEmptyEvents(schedule, teamLength, eventLength, numOfTeams)
  //schedule = addByeRounds(schedule)
  main:
  for(var roundCounter=0; roundCounter < roundsLength; roundCounter++){
    for(var eventCounter=0; eventCounter < eventLength; eventCounter++){
      for(var teamCounter=0; teamCounter < numOfTeams; teamCounter++){
        var team = getRandomInt(0, teamLength)
        var safetyCheck = 0
        var clearedCheck = 0
        while(schedule.rounds[roundCounter].events[eventCounter].teams.length < 2){
          safetyCheck++
          team = getRandomInt(0, teamLength)
          if(teamIsFree(team, eventCounter, roundCounter, schedule)){
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
  outputScheduleBody(schedule);
})

function calculateEmptyEvents(teamLength, eventLength){
  var result = 0
  if(eventLength > (teamLength/2)){
    result = eventLength - (teamLength/2)
  }
  return result
}

function calculateByeRounds(teamLength, eventLength){
  var result = 0
  if(eventLength < (teamLength/2)){
    result = (teamLength/2)-eventLength
  }
  return result
}

function teamIsFree(team, eventCounter, roundCounter, schedule){
  var result = true
  if(alreadyInRound(team, roundCounter, schedule)){
    result = false
  }
  if(alreadyInEvent(team, eventCounter, schedule)){
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

function calculateRoundsLength(teamLength, eventLength){
  var result = 0
  teamLength = parseInt(teamLength)
  eventLength = parseInt(eventLength)
  if(teamLength/2 >= eventLength){
    result = (teamLength/2)
  }
  else {
    result = eventLength
  }
  result = Math.ceil(result)
  return result
}

function outputScheduleHeader(eventLength){
  $("#results").append("<table id='schedule' class='container'></table>")

  // $("#schedule").append("<th></th>")
  for(var i=1; i <= eventLength; i++){
    $("#schedule").append("<th>Event "+i+"</th>")
  }

}

function outputScheduleBody(schedule){
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

function alreadyInRound(team, roundCounter, schedule){
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

function alreadyInEvent(team, eventCounter, schedule){
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

function initializeRounds(roundsLength, eventLength, teamLength, numOfTeams){
  var rounds = []
  for(var i=0; i < roundsLength; i++){
    rounds[i] = {
      roundName: "Round "+(i+1),
      events: []
    }
    for(var j=0; j < eventLength; j++){
      rounds[i].events[j] = {
        eventName: "Event "+(j+1),
        teams: []
      }
    }
  }
  return rounds
}

function addEmptyEvents(schedule,teamLength, eventLength, numOfTeams){
  var emptyEvents = calculateEmptyEvents(teamLength, eventLength)
  // var byeRounds = calculateByeRounds(teamLength, eventLength)
  if(emptyEvents != 0){
    for(var roundCounter=0; roundCounter <schedule.rounds.length; roundCounter++){
      for(var i=0; i < emptyEvents; i++){
        var eventCounter = roundCounter+i
        if(eventCounter >= schedule.rounds[roundCounter].events.length){
          eventCounter = eventCounter - eventLength
        }
        for(var j=0; j < numOfTeams; j++){
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
