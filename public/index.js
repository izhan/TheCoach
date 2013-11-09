$(function(){

  $('.show-coach').on('click', function(){
    $('.coach-page').show();
  });

  appendTask(task1);
  appendTask(task2);
  transitionToCoach();
  appendMessage(message1);
  appendMessage(message2);
  $('.add-task').on('click', function(){
  	var hours = $("hours").val();
  	var mins = $("minutes").val();
  	var secs = $("seconds").val();
  	if (onlyNumbers(hours, mins, secs)) {
  		alert("Please insert only numbers");
  	}
  	var tasks = $("task").val();

  	task=new Object();
  	task.hour=hours;
  	task.minute=mins;
  	task.seconds=secs;
  	task.taskname=tasks;
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
            message.text =data[i].fields.motivation_text;
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
}

function appendTime(hours, minutes, seconds)
{
  var output = "";

}

function appendMessage(item)
{
  if (item.id > maxId)
    maxId = item.id;

  $('.message-list').append("<div class=message-item>" + item.text + "</div>");
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
	return !NaN(parseInt(a)) && isFinite(a) 
	&& !NaN(parseInt(b)) && isFinite(b)
	&& !NaN(parseInt(c)) && isFinite(c);
}
