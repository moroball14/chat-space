class MessagesController < ApplicationController
  
  def index
  end

  def create
    @message = Message.new
    Message.create(message_params)
    render "index"
  end

  private
  def message_params
    params.require.(:message).permit(:content)
  end

end
