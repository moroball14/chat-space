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

  // ↓リファクタリングをする
  var buildMessageHTML = function(message) {
    if (message.content && message.image.url) {
      //data-idが反映されるようにしている
      var html = `<div class="message" data-id=${message.id}>
                    <div class="upper-message">
                      <div class="upper-message__user-name">
                        ${message.user_name}
                      </div>
                      <div class="upper-message__date">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                      <img src="${message.image.url}" class="lower-message__image" >
                    </div>
                  </div>`
    } else if (message.content) {
      //同様に、data-idが反映されるようにしている
      var html = `<div class="message" data-id=${message.id}>
                    <div class="upper-message">
                      <div class="upper-message__user-name">
                        ${message.user_name}
                      </div>
                    <div class="upper-message__date">
                      ${message.created_at}
                    </div>
                    </div>
                    <div class="lower-message">
                      <p class="lower-message__content">
                        ${message.content}
                      </p>
                    </div>
                  </div>`
    } else if (message.image.url) {
      //同様に、data-idが反映されるようにしている
      var html = `<div class="message" data-id=${message.id}>
                    <div class="upper-message">
                      <div class="upper-message__user-name">
                        ${message.user_name}
                      </div>
                      <div class="upper-message__date">
                        ${message.created_at}
                      </div>
                    </div>
                    <div class="lower-message">
                      <img src="${message.image.url}" class="lower-message__image" >
                    </div>
                  </div>`
    };
    return html;
  };

  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
      last_message_id = $('.message:last').data('id');
      $.ajax({
        //ルーティングで設定した通りのURLを指定
        url: 'api/messages#index {:format=>"json"}',
        //ルーティングで設定した通りhttpメソッドをgetに指定
        type: 'get',
        dataType: 'json',
        //dataオプションでリクエストに値を含める
        data: {id: last_message_id}
      })
      .done(function(messages) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        messages.forEach(function(message){
          insertHTML = buildHTML(message);         //メッセージが入ったHTMLを取得
          $('.messages').append(insertHTML);       //メッセージを追加
          $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
        });

      })
      .fail(function() {
        console.log('error');
      });
    };
  };
  setInterval(reloadMessages, 5000);
});