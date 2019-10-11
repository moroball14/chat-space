require 'rails_helper'

describe MessagesController do
  let(:group) { create(:group) }
  let(:user) { create(:user) }   # letを使用してテスト中使用するインスタンスを定義

  describe "#index" do
    context "log in" do # ログインしている場合
    
      before do # beforeで囲まれた処理は、各exampleが実行すされる直前に、毎回実行される
        login user # controller_macros.rb内のlogin_userメソッドを呼び出し
        get :index, params: { group_id: group.id } # 擬似的にindexアクションを動かすリクエストを行う
      end

      it 'assigns @message' do
        expect(assigns(:message)).to be_a_new(Message) # be_a_newマッチャ：対象が引数で指定したクラスのインスタンスかつ未保存のレコードであるか
      end

      it 'assigns @group' do
        expect(assigns(:group)).to eq group # assigns(:group) = group かどうか
      end

      it 'redners index' do
        expect(response).to render_template :index #response と render_templateを合わせることで、example内でリクエストが行われた時の遷移先のビューが、indexアクションのビューと同じかどうか
      end

    end

    context "as a user not to login" do # ログインしていない場合
      before do
        get :index, params: { group_id: group.id }
      end

      it 'redirects to new_user_session_path' do
        expect(response).to redirect_to(new_user_session_path) # redirect_toは、プレフィックスにリダイレクトした際の情報を返すマッチャ
      end
    end
  end

  describe '#create' do
    let(:params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message) } }

    context 'log in' do # ログインしている場合
      before do
        login user
      end

      context 'can save' do # 投稿が保存できた場合
        subject {
          post :create,
          params: params
        }

        it 'count up message' do
          expect{ subject }.to change(Message, :count).by(1) # changeマッチャは引数が変化したかどうか
        end

        it 'redirects to group_messages_path' do
          subject
          expect(response).to redirect_to(group_messages_path(group))
        end
      end

      context 'can not save' do # 投稿が保存できなかった場合
        let(:invalid_params) { { group_id: group.id, user_id: user.id, message: attributes_for(:message, content: nil, image: nil) } }
        # 擬似的にcreateアクションをリクエストする際にinvalid_paramsを引数として渡してあげることによって、意図的にメッセージの保存に失敗する場合を再現

        subject {
          post :create,
          params: invalid_params
        }

        it 'does not count up' do
          expect{ subject }.not_to change(Message, :count)
        end

        it 'renders index' do
          subject
          expect(response).to render_template :index
        end
      end
    end

    context 'not log in' do

      it 'redirects to new_user_session_path' do
        post :create, params: params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end