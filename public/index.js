$(function(){

  $('.show-coach').on('click', function(){
    $('.coach-page').show();
  });

  appendTask(task1);
  appendTask(task2);
  $('.coach-page').show();
  appendMessage(message1);
  appendMessage(message2);
  $('.add-task').on('click', function(){
  	var hour=$("#hours").val();
  	var mins=$("#minutes").val();
  	var secs=$("#seconds").val();
  	if (!onlyNumbers(hour, mins, secs)) {
  		alert("Please insert only numbers");
  		return;
  	}
  	var tasks = $("#task").val();

  	var task = {
  	hours: hour,
  	minutes: mins,
  	seconds: secs,
  	name: tasks,
  	time: convertMS(hour,mins,secs),
  	};
  	appendTask(task);
  })
});

function getMessages()
{
    $.get("query/?id=" + max, function( data ) {
        // sanitize the data into valid objects
        for(var i = 0; i < data.length; i++) {
            var message = {"id": "", "name": "", "message": ""};
            message.id = data[i].pk;
            message.name = data[i].fields.name;
            message.text = data[i].fields.motivation_text;
            appendMessage(message);
        }
    });
}

// call when user presses on lets go
function transitionToCoach()
{
  $('.coach-page').show();
  $('.task-number').html("Number of Tasks: " + tasklist.length);
}

function appendTask(item)
{
  tasklist.push(item);
  $('.task-list').append("<div class='task-item'><span class='task-name'>" + item.name + " </span><div class='task-time'>" +
    "<span class='task-time-label'>Hour: <span class='task-time-number'>" + item.hours + " </span></span>" +
    "<span class='task-time-label'>Min: <span class='task-time-number'>" + item.minutes + " </span></span>" +
    "<span class='task-time-label'>Sec: <span class='task-time-number'>" + item.seconds + " </span></span>" +
    "</div></div>");
  $('.front-list').append("<div class='front-item'><span class='front-name'>" + item.name + " </span><span class='front-time'>" +
  	 "<span class='front-time-label'>Hour: <span class='front-time-number'>" + item.hours + " </span></span>" +
  	 "<span class='front-time-label'>Min: <span class='front-time-number'>" + item.hours + " </span></span>" +
  	 "<span class='front-time-label'>Sec: <span class='front-time-number'>" + item.hours + " </span></span>" +
  	 "</span></div>");
}

function appendTime(hours, minutes, seconds)
{
  var output = "";

}

function appendMessage(item)
{
  if (item.id > maxId)
    maxId = item.id;

  $('.message-list').append("<div class='message-item'><span class='message-name'>" + item.name + 
    ": </span><span class='message-text'>" + item.text + "</span</div>");
}

var messageList = [];
var maxId = -1;

var tasklist = [];
var task1 = {
  name: "Study for ORF 309",
  time: 5000,
  hours: 10,
  minutes: 13,
  seconds: 15
};
var task2 = {
  name: "Finish drafting my Hackathon idea",
  time: 10000,
  hours: 10,
  minutes: 13,
  seconds: 15
};
var message1 = {
  id: 1,
  name: "Harold Wu",
  text: "Hey man, I hope you are doing well!  You got this!"
};
var message2 = {
  id: 2,
  name: "The Dude",
  text: "Dude, like thats just your opinion man."
};

function onlyNumbers(a,b,c) {
	return !isNaN(a) && isFinite(parseFloat(a)) 
	&& !isNaN(b) && isFinite(parseFloat(b))
	&& !isNaN(c) && isFinite(parseFloat(c));
}

function convertMS(a,b,c) {
	return parseInt(a)*3600000 + parseInt(b)*60000 + parseInt(c)*1000;
}
