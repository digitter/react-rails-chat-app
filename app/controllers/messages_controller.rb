class MessagesController < ApplicationController
  def create
    message = Message.new(message_params)
    conversation = Conversation.find(message_params[:conversation_id])

    if message.save
      serialized_data = ActiveModelSerializers::Adapter::Json.new(
        MessageSerializer.new(message)
      ).serializable_hash

      # insted of string, this method takes an object from model as first argument.
      # stream_for and broadcast_to is useful for transmitting data along non-universal channels, such as for members  of a particular conversation or specific users.
      MessagesChannel.broadcast_to conversation, serialized_data
      head :ok
    end
  end

  private
    def message_params
      params.require(:message).permit(:text, :conversation_id)
    end
end
