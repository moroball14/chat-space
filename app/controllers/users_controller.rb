class UsersController < ApplicationController

  def index
    @users = User.where('name LIKE(?)',"%#{params[:keyword]}%").where.not(id: current_user.id)
    respond_to do |format|
      format.html
      format.json
    end
  end

  def edit
  end

  def update
    if current_user.update(user_params) # もし現在ログインしているユーザー(current_user)の情報が入力された内容(user_params)で更新(update)されたら
      redirect_to root_path # root_pathに遷移(redirect_to)してください
    else # そうでなければ
      render :edit # 編集画面(edit)に戻って(render)ください
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email)
  end

end
