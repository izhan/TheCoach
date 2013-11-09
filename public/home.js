$(function(){
  // starts blinking foreverrrrrrr
  blink();
});

// recursive
function blink()
{
  var random = Math.random();
  setTimeout(function(){
    $('.lame-coach').hide();
    $('.lame-coach-blinking').show();
    // blinks once
    setTimeout(function(){
      $('.lame-coach').show();
      $('.lame-coach-blinking').hide();
      blink();
    }, 200)
  }, random*2000 + 2750);
}