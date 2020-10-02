import React, { Component } from 'react';
import { ActionCableConsumer } from 'react-actioncable-provider';
import { API_ROOT } from '../constants';
import NewConversationForm from './NewConversationForm';
import MessagesArea from './MessagesArea';
import Cable from './Cables';

export default class ConversationList extends Component {
  state = {
    conversations: [],
    activeConversation: null
  }

  componentDidMount = () => {
    fetch(`${API_ROOT}/conversations`)
      .then(res => res.json())
      .then(conversations => this.setState({ conversations }));
  }

  handleClick = id => {
    this.setState({ activeConversation: id });
  }

  handleReceivedonversation = response => {
    const { conversation } = response;

    this.setState({ conversations: [...this.state.conversations, conversation ]});
  };

  handleReceivedMessage = response => {
    const { message } = response;
    const conversations = [...this.state.conversations];
    const conversation = conversations.find(
      conversation => conversation.id === message.conversation_id
    );

    conversation.messages =[...conversation.messages, message];
    this.setState({ conversations });
  }

  render = () => {
    const { conversations, activeConversation } = this.state;

    return (
      <div className="conversationsList">
        <ActionCableConsumer
          channel={{ channel: 'ConversationsChannel' }}
          onReceived={this.handleReceivedonversation}
        />

        {this.state.conversations.length ? (
          <Cable
            conversations={conversations}
            handleReceivedMessage={this.handleReceivedMessage}
          />
        ) : null}

        <h2>Conversations</h2>

        <ul>{mapConversations(conversations, this.handleClick)}</ul>

        <NewConversationForm />

        {activeConversation ? (
          <MessagesArea
            conversation={findActiveConversation(conversations, activeConversation)}
          />
        ) : null}
      </div>
    )
  }
}

// helpers
const findActiveConversation = (conversations, activeConversation) => {
  return conversations.find(
    conversation => conversation.id === activeConversation
  );
};

const mapConversations = (conversations, handleClick) => {
  return conversations.map(conversation => {
    return (
      <li key={conversation.id} onClick={() => handleClick(conversation.id)}>
        {conversation.title}
      </li>
    );
  });
};
