var numberOfTeams = sessionStorage.numberOfTeams
var numberOfEvents = sessionStorage.numberOfEvents
var teamsPerEvent = 2

var teamNames = sessionStorage.teamNames.split(',')
var eventNames = sessionStorage.eventNames.split(',')

$("#teams").val(sessionStorage.numberOfTeams)
$("#events").val(sessionStorage.numberOfEvents)

createSchedule(numberOfEvents, numberOfTeams, teamsPerEvent, eventNames)

$("#create").on("click", function(){
  sessionStorage.numberOfTeams = $("#teams").val()
  sessionStorage.numberOfEvents = $("#events").val()
  createSchedule(sessionStorage.numberOfEvents, sessionStorage.numberOfTeams, teamsPerEvent, eventNames)
})

$("#reset").on("click", function(){
  window.location.href = "../index.html"
})

function createSchedule(numberOfEvents, numberOfTeams, teamsPerEvent, eventNames){
  $("#results").empty()
  var numberOfRounds = calculatenumberOfRounds(numberOfTeams, numberOfEvents)
  var schedule = new Array()
  schedule.rounds = initializeRounds(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent,eventNames)
  schedule = addOtherEvents(schedule, numberOfTeams, numberOfEvents, teamsPerEvent)
  var clearedCheck = 0
  main:
  for(var roundCounter=0; roundCounter < schedule.rounds.length; roundCounter++){
    for(var eventCounter=0; eventCounter < schedule.rounds[roundCounter].events.length; eventCounter++){
      for(var teamCounter=0; teamCounter < teamsPerEvent; teamCounter++){
        var team = getRandomInt(0, numberOfTeams)
        var safetyCheck = 0
        var scheduleRedo = 0
        while(schedule.rounds[roundCounter].events[eventCounter].teams.length < 2){
          safetyCheck++
          team = getRandomInt(0, numberOfTeams)
          if(teamIsFree(team, eventCounter, roundCounter, schedule)){
            schedule.rounds[roundCounter].events[eventCounter].teams.push(team)
          }
          if(safetyCheck > 50){
            scheduleRedo++
            schedule = clearRound(schedule, roundCounter)
            teamCounter=0;
            eventCounter=0;
            safetyCheck = 0;
            if(scheduleRedo > 50){
              scheduleRedo = 0
              schedule = []
              createSchedule(numberOfEvents, numberOfTeams, teamsPerEvent, eventNames)
              clearedCheck++
              if(clearedCheck > 5){
                alert("Whoops! Something is taking too long. Try again to see if the problem persists. If so, tough luck.")
                break main
              }
            }
          }
        }
      }
    }
  }
  outputSchedule(schedule, teamNames, eventNames)
}

function calculateEmptyEvents(numberOfTeams, numberOfEvents){
  var result = 0
  if(numberOfEvents > (numberOfTeams/2)){
    result = numberOfEvents - (numberOfTeams/2)
  }
  return result
}

function calculateByeRounds(numberOfTeams, numberOfEvents){
  var result = 0
  if(numberOfEvents < (numberOfTeams/2)){
    result = (numberOfTeams/2)-numberOfEvents
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

function calculatenumberOfRounds(numberOfTeams, numberOfEvents){
  var result = 0
  numberOfTeams = parseInt(numberOfTeams)
  numberOfEvents = parseInt(numberOfEvents)
  if(numberOfTeams/2 >= numberOfEvents){
    result = (numberOfTeams/2)
  }
  else {
    result = numberOfEvents
  }
  result = Math.ceil(result)
  return result
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

function initializeRounds(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent, eventNames){
  var rounds = []
  for(var i=0; i < numberOfRounds; i++){
    rounds[i] = {
      roundName: "Round "+(i+1),
      events: []
    }
    if(eventNames.length > 1){
      for(var j=0; j < numberOfEvents; j++){
        rounds[i].events[j] = {
          eventName: eventNames[j],
          teams: []
        }
      }
    }else {
      for(var j=0; j < numberOfEvents; j++){
        rounds[i].events[j] = {
          eventName: "Event "+(j+1),
          teams: []
        }
      }
    }

  }
  return rounds
}

function addOtherEvents(schedule,numberOfTeams, numberOfEvents, teamsPerEvent){
  var emptyEvents = calculateEmptyEvents(numberOfTeams, numberOfEvents)
  var byeRounds = calculateByeRounds(numberOfTeams, numberOfEvents)
  if(emptyEvents != 0){
    for(var roundCounter=0; roundCounter <schedule.rounds.length; roundCounter++){
      for(var i=0; i < emptyEvents; i++){
        var eventCounter = roundCounter+i
        if(eventCounter >= schedule.rounds[roundCounter].events.length){
          eventCounter = eventCounter - numberOfEvents
        }
        for(var j=0; j < teamsPerEvent; j++){
          schedule.rounds[roundCounter].events[eventCounter].teams.push(-1)
        }
      }
    }
  }
  if(byeRounds != 0 ){
    var byeEvents = []
    for(var roundCounter=0; roundCounter < schedule.rounds.length; roundCounter++){
      for(var i=0; i<byeRounds; i++){
        byeEvents = {
          eventName: "Rest",
          teams: []
        }
        schedule.rounds[roundCounter].events.push(byeEvents)
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

function outputSchedule(schedule, teamNames, eventNames){
  if(teamNames == undefined || teamNames.length < 2){
    $("#results").append("<table id='schedule' class='container'></table>")
    for(var i=0; i < schedule.rounds[0].events.length; i++){
      $("#schedule").append("<th>"+schedule.rounds[0].events[i].eventName+"</th>")
    }
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
  }else {
    $("#results").append("<table id='schedule' class='container'></table>")
    for(var i=0; i < schedule.rounds[0].events.length; i++){
      $("#schedule").append("<th>"+schedule.rounds[0].events[i].eventName+"</th>")
    }
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
            $("#r"+i+"e"+j).append(teamNames[team])
          }
          if(k < schedule.rounds[i].events[j].teams.length-1){
            $("#r"+i+"e"+j).append(" & ")
          }
        }
      }
    }
  }
}
