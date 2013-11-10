$(function(){

  $('.show-coach').on('click', function(){
    startTimer();
    transitionToCoach();
  });

  
  appendTask(task1);
  appendTask(task2);

  appendMessage(message1);
  appendMessage(message2);

  theCoachSays();

  $("#hours, #minutes, #seconds, #task").keyup(function (e) {
    if (e.keyCode == 13) {
      submitTask();
    }
  });

  $('.add-task').on('click', function(){
  	submitTask();
  });

  $('.break-now').on('click', function(){
    $('.break-page').fadeIn(1000);
    takeBreak();
  });
});

function Timer(callback, delay) {
  var timerId, start, remaining = delay;

  this.pause = function() {
      window.clearTimeout(timerId);
      remaining -= new Date() - start;
  };

  this.resume = function() {
      start = new Date();
      timerId = window.setTimeout(callback, remaining);
  };

  this.resume();
}

function postMessage( message )
{
    $.get("post/?msg="+ message);
}

function getMessages()
{
  $.ajax({ url: "query/?id=" + maxId + "&time=" + full_time + "&date=" + full_date, success: function( data ) {
      data = JSON.parse(data);
      // sanitize the data into valid objects
      for(var i = 0; i < data.length; i++) {
          var message = {"id": "", "name": "", "message": "", "image_url": ""};
          message.id = data[i].pk;
          message.name = data[i].fields.name;
          message.text = data[i].fields.motivation_text;
          message.image_url = data[i].fields.image_url;
          appendMessage(message);
      }
  }, dataType: 'json'});
}

// call when user presses on lets go
function transitionToCoach()
{
  if (isSocial) {
      postMessage('Cheer me on at: http://localhost:8000/motivate ' + time_min);
  }
  $('.coach-page').fadeIn(1000);
  $('.task-number').html("Tasks Left: " + tasklist.length);
  $('.initial-page').hide();
  getMessages();
  window.setInterval(function() {
      getMessages();
  }, 60000);
}

var finishedlist = [];
var count = 0;

function submitTask()
{
  var hour=$("#hours").val();
  var mins=$("#minutes").val();
  var secs=$("#seconds").val();
  if (isFinite(parseFloat(hour)) || isFinite(parseFloat(mins)) || isFinite(parseFloat(secs)))
  {
    if(hour == "")
      hour = 0;
    if(mins == "")
      mins = 0;
    if(secs == "")
      secs = 0;
  }
  if (!validateTime(hour, mins, secs)) {
    alert("Please insert a valid time");
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
}

function appendTask(item)
{
  finishedlist.push(0);
  tasklist.push(item);
  $('.task-list').append("<div class='task-item'><div class='checkmark'></div><div class='css-checkbox checkbox' onclick='taskFinished(" + count + ")'></div>" +
    "<span class='task-name'>" + 
    item.name + " </span><div class='task-time'>" +
    "<span class='task-time-label'>Hour: <span class='task-time-number'>" + item.hours + " </span></span>" +
    "<span class='task-time-label'>Min: <span class='task-time-number'>" + item.minutes + " </span></span>" +
    "<span class='task-time-label'>Sec: <span class='task-time-number'>" + item.seconds + " </span></span>" +
    "</div></div>");
  count++;
  $('.front-list').prepend("<div class='front-item'><div class='checkbox'></div><div class='front-wrapper'>" +
     "<span class='front-name'>" + item.name + " </span><span class='front-time'><br>" +
  	 "<span class='front-time-label'>Hours: <span class='front-time-number'>" + item.hours + " </span></span>" + 
  	 "<span class='front-time-label'>Min: <span class='front-time-number'>" + item.minutes + " </span></span>" +
  	 "<span class='front-time-label'>Sec: <span class='front-time-number'>" + item.seconds + " </span></span>" +
  	 "</span></div></div>");
  
  if (!readyToGo)
  {
    readyToGo = true;
    $('.lame-coach-message').hide();
    $('.ready-to-go').show();
    $('.show-coach').css('display', 'inline-block');
  }
}

function appendMessage(item)
{
  if (item.id > maxId)
    maxId = item.id;

  // message from twitter
  if (item.image_url.length != 0)
  {
    $('.message-list').prepend($("<div class='message-item'><div class='message-image twitter' style='background-image: url("
      + item.image_url + ");'></div><span class='message-name'>" + item.name + 
      ": </span><span class='message-text'>" + item.text + "</span</div>").fadeIn(1000));
  }
  else
  {
    var random = Math.floor(Math.random()*numberOfPersonOptions) + 1;
    $('.message-list').prepend($("<div class='message-item'><div class='message-image person-" + 
      random + "'></div><span class='message-name'>" + item.name + 
      ": </span><span class='message-text'>" + item.text + "</span</div>").fadeIn(1000));
  }
}

// accepts a message.  if no message, then random talks.
function theCoachSays(message)
{
  if (message)
  {
    window.clearInterval(coachTimer);
    $('.the-coach').addClass('talking');
    $('.the-coach-says').html(message);
    $('.the-coach-says').show();
    setTimeout(function(){
      $('.the-coach').removeClass('talking');
      $('.the-coach-says').hide();
      randomTalking();
    }, 2000 );
  }
  else {
    window.clearInterval(coachTimer);
    $('.the-coach').addClass('talking');
    $('.the-coach-says').html(coachMessages[Math.floor(Math.random()*coachMessages.length)]);
    $('.the-coach-says').show();
    setTimeout(function(){
      $('.the-coach').removeClass('talking');
      $('.the-coach-says').hide();
    }, 2000 );
    randomTalking();
  }
}

var currentDanger;
var inDanger = true;
// Coach says random stuff
function randomTalking()
{
  coachTimer = setInterval(function(){
    $('.the-coach').addClass('talking');
    if (inDanger) {
      $('.the-coach-says').html(dangerMessages[Math.floor(Math.random()*dangerMessages.length)]);
    } else {
      $('.the-coach-says').html(coachMessages[Math.floor(Math.random()*coachMessages.length)]);
    }
    $('.the-coach-says').show();
    setTimeout(function(){
      $('.the-coach').removeClass('talking');
      $('.the-coach-says').hide();
    }, 2000 );
  }, 4500); 
}

var date = new Date();
var date_year = date.getFullYear();
var date_day = date.getDate();
var date_month = date.getMonth() + 1;
var full_date = "" + date_year + "-" + date_month + "-" + date_day
var time_min = date.getMinutes();
var time_hours = date.getHours() - 1;
var full_time = "" + time_hours + ":" + time_min + ":00";
var messageList = [];
var maxId = -1;
var isSocial = true;
var numberOfPersonOptions = 2;
var coachMessages = [
  "Work on it harder soldier!",
  "What are you, a chicken?",
  "I really need a cheeseburger right now....",
  "You're doing well!  Just kidding, you're performing like crap.",
  "C'mon man, I've seen babies performing better.",
  "Hello World!",
  "Prove P = NP next!",
  "Man, this hackathon is kinda long, dontcha think?"
];
var dangerMessages = [
  "You're running out of time! Speed it up!",
  "You're going slower than a snail!",
  "If you don't finish on time, you will FEEL MY WRATH!",
  "Move it! Move it! Move it!",
  "Are you just sitting there watching paint dry? Get on it!",
  "You only got five minutes to sa... Er I mean you only have a few minutes to finish!"
];

var tasklist = [];

var dangerTimer;
var coachTimer;
var readyToGo = false; // has someone added a task yet?
var task1 = {
  name: "Study for ORF 309",
  time: 5000,
  hours: 0,
  minutes: 10,
  seconds: 8
};
var task2 = {
  name: "Finish drafting my Hackathon idea",
  time: 10000,
  hours: 0,
  minutes: 0,  
  seconds: 10
};
var message1 = {
  id: 0,
  name: "Harold Wu",
  text: "Hey man, I hope you are doing well!  You got this!",
  image_url: ""
};
var message2 = {
  id: 0,
  name: "The Dude",
  text: "Dude, like thats just your opinion man.",
  image_url: 'https://pbs.twimg.com/profile_images/1448108270/image_normal.jpg'
};

function validateTime(a,b,c) 
{
	return !isNaN(a) && isFinite(parseFloat(a)) 
	&& !isNaN(b) && isFinite(parseFloat(b))
	&& !isNaN(c) && isFinite(parseFloat(c));
}

/* convert time to MS */
function convertMS(a,b,c) 
{
	return parseInt(a)*3600000 + parseInt(b)*60000 + parseInt(c)*1000;
}

var taskNum = 0;

/* Used to start timers */
function startTimer() 
{
  for (var i = taskNum; i < tasklist.length; i++) {
    if (finishedlist[i] == 0) {
      clearTimeout(currentDanger);
      taskNum = i;
      var task = tasklist[i];
      $($('.task-time')[i]).countdown({until: task.hours + "h " + task.minutes + "m " + task.seconds + "s", format: "HMS", layout:'<b>{d<}{dn} {dl} and {d>}'+ 
      '{hn} {hl}, {mn} {ml}, {sn} {sl}</b>', onExpiry: expired});
      var timeMS = convertMS(task.hours, task.minutes, task.seconds);
      inDanger = true;
      if (timeMS > 600000) {
        inDanger = false;
        dangerTimer = new Timer(function(){
          inDanger = true;}, (timeMS - 600000));
      }
      return;
    }
  }
}

/* Handling expiration of timers */
function expired() {
  if (isSocial) {
      var text = $($('.task-name')[taskNum]).text();
      postMessage("I didn't finish the task in time: "+ text +"! Come cheer me on so I don't fall behind!");
  }
  finishedlist[taskNum] = 1;
  taskNum++;
  startTimer();
}

var finished = 0;
var urls = ['http://www.dailymotion.com/swf/xsdji_rick-astley-never-gonna-give-you-up_music',
'http://www.dailymotion.com/swf/xyh6xu_journey-dont-stop-believing_music',
'http://www.dailymotion.com/swf/xengzl_cee-lo-green-fuck-you_music',

];

/* Marking tasks finished */
function taskFinished(numTask) {
  theCoachSays("Good job!");
  if (isSocial) {
    var text = $($('.task-name')[numTask]).text();
    postMessage("I just finished my task: "+ text + "! Come and congratulate me!");
  }
  finished++;
  if (finished == tasklist.length) {
    theCoachSays("Congrats, you finished!");
    setTimeout(function(){
      allDone();
    }, 1500);
  }
  if (numTask == (taskNum)) {
    expired();
  }
  $('.task-number').html("Tasks Left: " + (tasklist.length - finished));
  $($('.task-item')[numTask]).fadeOut(1000);
  $($('.task-time')[numTask]).countdown('destroy');
  finishedlist[numTask] = 1;
}

function takeBreak() {
  dangerTimer.pause();
  $($('.task-time')[taskNum]).countdown('pause');  
  $('.break-timer').countdown({until: "0h 10m 0s", format: "HMS", layout:'<b>{d<}{dn} {dl} and {d>}'+ 
      '{hn} {hl}, {mn} {ml}, {sn} {sl}</b>', onExpiry: finishBreak});
  $('.break-timer').append("<div class='finishBreak' onclick='finishBreak'>End break</div><div class=nextVid onclick='getNextVid'>Next Video</div>");
}

function allDone() {
  window.location.href = "alldone.html";
}

function finishBreak() {
  $('.break-timer').countdown('destroy');
  $('.break-page').fadeOut(1000);
  $($('.task-time')[taskNum]).countdown('resume');
  dangerTimer.resume();
}
var counter = 0;
function getNextVid() {
  $('iframe').attr('src', urls[counter%urls.length]);
}
