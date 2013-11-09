$(function(){

  $('.show-coach').on('click', function(){
    $('.coach-page').show();
  });

  appendTask(task1);
  appendTask(task2);
  transitionToCoach();
  appendMessage(message1);
  appendMessage(message2);
  
  theCoachSays();
  window.setInterval(function(){
    theCoachSays();
  }, 4500);

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
    }, dataType: 'json', complete: getMessages, timeout: 1000 });
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
	return !NaN(parseInt(a)) && isFinite(a) 
	&& !NaN(parseInt(b)) && isFinite(b)
	&& !NaN(parseInt(c)) && isFinite(c);
}
