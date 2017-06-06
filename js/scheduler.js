var numberOfTeams
var numberOfEvents
var numberOfRounds
var teamNames = []
var eventNames = []
var teamsPerEvent = 2
$("#teamEntry").on("click", function(){
  numberOfTeams = $('#teams').val()
  numberOfEvents = $('#events').val()
  numberOfRounds = calculatenumberOfRounds(numberOfTeams, numberOfEvents)
  var answer = $("input[name='option']:checked").val();

  if(($('#teams').val() == '') || ($('#events').val() == '')){
    alert("Whoops! You need to enter an amount for teams and events to continue.")
  }else if(answer == "auto"){
    createSchedule(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent)
  } else if(answer == "manual"){
    teamEntryPage()
  }

})

$("body").on("click", "#addTeam", function(){
  if($("#teamNames li").length == undefined || $("#teamNames li").length < 1){
    $("#teamAppender").append(
      '<div class="col-sm-4"></div>'+
        '<pre class="col-sm-4 well well-sm">'+
          '<ul id="teamNames">'+
            '<li>'+
              $("#teams").val()+
            '</li>'+
          '</ul>'+
        '</pre>'+
      '<div class="col-sm-4"></div>'
    )
  } else if($("#teamNames li").length < numberOfTeams){
    $("#teamNames").append(
      '<li>'+
        $("#teams").val()+
      '</li>'
    )
  }
  teamNames = []
  $("#teamNames li").each(function(){
    teamNames.push($(this).text())
  })
  $("#teams").val("")
  if(teamNames.length == parseInt(numberOfTeams)){
    eventEntryPage()
  }
})

$("body").on("click", "#addEvent", function(){
  if($("#eventNames li").length == undefined || $("#eventNames li").length < 1){
    $("#eventAppender").append(
      '<div class="col-sm-4"></div>'+
        '<pre class="col-sm-4 well well-sm">'+
          '<ul id="eventNames">'+
            '<li>'+
              $("#events").val()+
            '</li>'+
          '</ul>'+
        '</pre>'+
      '<div class="col-sm-4"></div>'
  )} else if($("#eventNames li").length < numberOfEvents){
    $("#eventNames").append(
      '<li>'+
        $("#events").val()+
      '</li>'
    )}
    eventNames =[]
    $("#eventNames li").each(function(){
      eventNames.push($(this).text())
    })
    $("#events").val("")
    if(eventNames.length == parseInt(numberOfEvents)){
      createSchedule(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent)
    }

})

function createSchedule(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent){
  $("#results").empty()
  var schedule = new Array()
  schedule.rounds = initializeRounds(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent)
  schedule = addOtherEvents(schedule, numberOfTeams, numberOfEvents, teamsPerEvent)
  var clearedCheck = 0
  main:
  for(var roundCounter=0; roundCounter < schedule.rounds.length; roundCounter++){
    for(var eventCounter=0; eventCounter < schedule.rounds[roundCounter].events.length; eventCounter++){
      for(var teamCounter=0; teamCounter < teamsPerEvent; teamCounter++){
        var team = getRandomInt(0, numberOfTeams)
        var safetyCheck = 0

        while(schedule.rounds[roundCounter].events[eventCounter].teams.length < 2){
          safetyCheck++
          team = getRandomInt(0, numberOfTeams)
          if(teamIsFree(team, eventCounter, roundCounter, schedule)){
            schedule.rounds[roundCounter].events[eventCounter].teams.push(team)
          }
          if(safetyCheck > 50){
            clearedCheck++
            schedule = clearRound(schedule, roundCounter)
            teamCounter=0;
            eventCounter=0;
            safetyCheck = 0;
            if(clearedCheck > 50){
              alert("Whoops! Something is taking too long. Try again to see if the problem persists. If so, tough luck.")
              break main
            }
          }
        }
      }
    }
  }
  outputSchedule(schedule)
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

function initializeRounds(numberOfRounds, numberOfEvents, numberOfTeams, teamsPerEvent){
  var rounds = []
  for(var i=0; i < numberOfRounds; i++){
    rounds[i] = {
      roundName: "Round "+(i+1),
      events: []
    }
    for(var j=0; j < numberOfEvents; j++){
      rounds[i].events[j] = {
        eventName: "Event "+(j+1),
        teams: []
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

function outputSchedule(schedule){
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
}

function teamEntryPage(){
  $('#questions').html(
    '<div class="container">'+
      '<div class="row">'+
        '<div class="col-sm-12">'+
          '<div class="row">'+
            '<label class="col-sm-12" for="teams">Please enter the team names:</label>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-sm-3"></div>'+
              '<input class="col-sm-6" id="teams"/>'+
              '<div class="col-sm-3">'+
                '<div id="button">'+
                  '<button id="addTeam" class="btn btn-primary">Add Team</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<br>'+
          '<div class="row" id="teamAppender">'+
          '</div>'+
        '</div>'+
    '</div>'
  )
}

function eventEntryPage(){
  $('#questions').empty()
  $('#questions').html(
    '<div class="container">'+
      '<div class="row">'+
        '<div class="col-sm-12">'+
          '<div class="row">'+
            '<label class="col-sm-12" for="events">Please enter the event names:</label>'+
          '</div>'+
          '<div class="row">'+
            '<div class="col-sm-3"></div>'+
              '<input class="col-sm-6" id="events"/>'+
              '<div class="col-sm-3">'+
                '<div id="button">'+
                  '<button id="addEvent" class="btn btn-primary">Add Event</button>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<br>'+
          '<div class="row" id="eventAppender">'+
        '</div>'+
      '</div>'+
    '</div>'
  )
}