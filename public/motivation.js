// Adopted from www.irvinzhan.com
$(function(){
  window.location.hash='contact'; // initially not opened

  // resets back to normal
  $('.send-another').on('click', function(){
    $("#contact").removeClass("closing");
    $('.send-another').hide();
    $('.message-confirmation').hide();
    $('.field-input').val('');
  });

  $('.x-button').on('click', function(){
    // close envelope
    $("#contact").addClass("closing");
    window.location.hash='';
    // flip it around
    setTimeout(function() {
      window.location.hash='contact';
      $("#contact").removeClass("closing");
      $('.send-another').hide();
      $('.message-confirmation').hide();
      $('.field-input').val('');
    }, 1500)
  });
  

  $('.new_email').on('submit', function(){
    $('small.error').hide();
    $('.field-input').removeClass('error');

    var valuesToSubmit = $(this).serialize();
    $.ajax({
        url: $(this).attr('action'),
        data: valuesToSubmit,
        dataType: "JSON",
        type: "POST"
    }).success(function(json){
      $("#contact").addClass("closing");
      window.location.hash=''; // transition to closing envelope
      setTimeout(function() {
        $('.message-confirmation').fadeIn();
        $('.send-another').fadeIn();
      }, 1500)
    }).error(function(json){
      var errors = json.responseJSON.errors;
      // whats the error?
      for (var key in errors)
      {
        $('.' + key + '-input').addClass('error');
        $('.' + key + '-error').show().html(key + " " + errors[key]);
      }
    });
    return false;
  });
});
