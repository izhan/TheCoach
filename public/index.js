$(function(){

  $('.show-coach').on('click', function(){
    $('.coach-page').show();
  });

  appendTask(task1);
  appendTask(task2);
  transitionToCoach();
});

// call when user presses on lets go
function transitionToCoach()
{
  $('.coach-page').show();
  $('.task-number').html("Number of Tasks: " + tasklist.length);
}

function appendTask(item)
{
  tasklist.push(item);
  $('.task-list').append("<div class='task-item'><span class='task-name'>" + item.name + "</span><span class='task-time'>" +
    item.time
    + "</span></div>");

}

function appendMessage(item)
{
  
}

var messageList = [];

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
