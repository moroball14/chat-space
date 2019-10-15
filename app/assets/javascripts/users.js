$(function(){

  function addHTML(data) {
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${data.user_name}</p>
                  <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${data.id}" data-user-name="${data.user_name}">追加</div>
                </div>`;
    return html;
  }

  function addChatMember(id, name) {
    var html = `<div class='chat-group-user'>
                  <input name='group[user_ids][]' type='hidden' value='${id}'>
                  <p class='chat-group-user__name'>${name}</p>
                  <div class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</div>
                </div>`
    return html;
  }

  $('#user-search-field').on("keyup",function(e){
    e.preventDefault();
    if ($(this).val() != '') var name = $(this).val();
    
    $.ajax({
      url: '/users',
      type: 'GET',
      data: ('keyword=' + name),
      dataType: "json",
      processData: false,
      contentType: false
    })

    .done(function(datas){
      if (datas.length !== 0) {
        $('.user-search-add').parent().remove();
        datas.forEach(function(data){
          $('#user-search-result').append(addHTML(data)); // 検索結果を表示している
        });
      } else {
        alert('ユーザー検索に失敗しました');
        $('.user-search-add').parent().remove();
      }
    });
    // .fail(function(){
    //   $('#user-search-result').append('<div id="error">ユーザーを取得できません</div>');
    // });
  });

  $(document).on("click",".user-search-add",function(data){ //追加を押したら「追加」を押した部分の要素を削除したい
    $(this).parent().remove(); //削除して
    var id = $(this).attr('data-user-id'); //idを変数に格納して
    var name = $(this).attr('data-user-name'); //名前を変数に格納して
    $('.chat-group-form__field--right').eq(2).append(addChatMember(id, name)); //idとnameを引数に、addChatMemberメソッドを呼び出す
  });

  $(document).on("click",".user-search-remove",function(data){
    $(this).parent().remove();
  });
});