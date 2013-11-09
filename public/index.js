$(function(){

  $('.show-coach').on('click', function(){
    $('.coach-page').show();
  });

  appendTask(task1);
  appendTask(task2);

  appendMessage(message1);
  appendMessage(message2);
  
  theCoachSays();
  window.setInterval(function(){
    theCoachSays();
  }, 4500);

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
  	$("#hours").val('');
  	$("#task").val('');
  	$("#minutes").val('');
  	$("#seconds").val('');
  })
});

function getMessages()
{
    $.ajax({ url: "query/?id=" + maxId, success: function( data ) {
        data = JSON.parse(data);
        // sanitize the data into valid objects
        for(var i = 0; i < data.length; i++) {
            var message = {"id": "", "name": "", "message": ""};
            message.id = data[i].pk;
            message.name = data[i].fields.name;
            message.text = data[i].fields.motivation_text;
            appendMessage(message);
        }
    }, dataType: 'json', complete: getMessages, timeout: 10000 });
}

// call when user presses on lets go
function transitionToCoach()
{
  $('.coach-page').show();
  $('.task-number').html("Number of Tasks: " + tasklist.length);
  //getMessages();
}

function appendTask(item)
{
  tasklist.push(item);
  $('.task-list').append("<div class='task-item'><span class='task-name'>" + item.name + " </span><div class='task-time'>" +
    "<span class='task-time-label'>Hour: <span class='task-time-number'>" + item.hours + " </span></span>" +
    "<span class='task-time-label'>Min: <span class='task-time-number'>" + item.minutes + " </span></span>" +
    "<span class='task-time-label'>Sec: <span class='task-time-number'>" + item.seconds + " </span></span>" +
    "</div></div>");
  $('.front-list').prepend("<div class='front-item'><span class='front-name'>" + item.name + " </span><span class='front-time'>" +
  	 "<span class='front-time-label'>Hour: <span class='front-time-number'>" + item.hours + " </span></span>" +
  	 "<span class='front-time-label'>Min: <span class='front-time-number'>" + item.hours + " </span></span>" +
  	 "<span class='front-time-label'>Sec: <span class='front-time-number'>" + item.hours + " </span></span>" +
  	 "</span></div>");
}

function appendMessage(item)
{
  if (item.id > maxId)
    maxId = item.id;

  $('.message-list').prepend("<div class='message-item'><span class='message-name'>" + item.name + 
    ": </span><span class='message-text'>" + item.text + "</span</div>");
}

function theCoachSays()
{
  $('.the-coach').addClass('talking');
  $('.the-coach-says').html(coachMessages[Math.floor(Math.random()*coachMessages.length)]);
  $('.the-coach-says').show();
  setTimeout(function(){
    $('.the-coach').removeClass('talking');
    $('.the-coach-says').hide();
  }, 2000 );
}

var messageList = [];
var maxId = -1;
var coachMessages = [
  "Work on it harder soldier!",
  "What are you, a chicken?",
  "I really need a cheeseburger right now....",
  "You're doing well!  Just kidding, you're performing like crap.",
  "C'mon man, I've seen babies performing better.",
  "Hello World!",
  "Prove P = NP next!",
  "Man, this hackathon is kinda long, dontcha think?"
]

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
