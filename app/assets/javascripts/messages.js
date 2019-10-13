$(function(){
  function addHTML(message){
    var content = message.content ? `${ message.content }`: '';
    var image = message.image ? `<img src= ${message.image}>`: '';
    var html =`<div class='message' data-id="${message.id}">
                <div class='message__upper'>
                  <div class='message__upper--talker'>
                    ${message.user_name}
                  </div>
                  <div class='message__upper--date'>
                    ${message.date}
                  </div>
                  </div>
                  <div class='message__comment'>
                  <p class='message__comment--content'>
                    ${content}
                  </p>
                  ${image}
                </div>
              </div>`;
    return html;
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var message = new FormData(this);
    var url = $('#new_message').attr('action');

    $.ajax({
      url: url,
      type: "POST",
      data: message,
      dataType: "json",
      processData: false,
      contentType: false
    })
    .done(function(data){
      $(".messages").append(addHTML(data));
      $("#new_message")[0].reset();
      $(".right-body").animate({scrollTop: $(".right-body")[0].scrollHeight}, 'fast');
    })
    .fail(function(data){
      alert("エラーのためメッセージを送信できませんでした。");
    })
    .always(function(data){
      $('.input-form__submit-btn').prop('disabled', false);
    });
  });
});