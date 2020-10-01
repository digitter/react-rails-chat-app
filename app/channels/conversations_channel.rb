class ConversationsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from expects to receive a string as an argumment
    stream_from "conversations_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
