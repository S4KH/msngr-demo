import React, { Component } from 'react'
import MessageInput from '../components/MessageInput'
import Messages from '../components/Messages'
import ChannelOption from '../components/ChannelOption'
import { GLOBAL_CHAT, MESSAGE_RECIEVED, TYPING, MESSAGE_SENT, USER_CONNECTED, USER_DISCONNECTED } from '../io-handler/constants'
import {values, differenceBy} from 'lodash';

export default class ChatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      users: [],
      activeChat: null
    };
  }

  componentDidMount() {
    const { socket } = this.props
    this.initSocket(socket)
  }

  componentWillUnmount() {
    const {socket} = this.props;
    socket.off(USER_CONNECTED);
    socket.off(USER_DISCONNECTED);
  }

  initSocket = (socket) => {
    socket.emit(GLOBAL_CHAT, this.resetChat);
    socket.on(USER_CONNECTED, (users) => {
      this.setState({users: values(users)});
    });
    socket.on(USER_DISCONNECTED, (users) => {
      this.setState({users: values(users)})
    });
  }

  resetChat = (chat) => {
    return this.switchChat(chat, true);
  }

  switchChat = (chat, reset = false) => {
    const { socket } = this.props;
    const { chats } = this.state;
    const newChats = reset ? [chat] : [...chats, chat]
    this.setState({
      chats: newChats,
      activeChat: reset ? chat : this.state.activeChat
    })

    const msgEvent = `${MESSAGE_RECIEVED}-${chat.id}`
    const typingEvent = `${TYPING}-${chat.id}`

    socket.on(typingEvent, this.typingMsg(chat.id))
    socket.on(msgEvent, this.addMsgToChat(chat.id))
  }

  addMsgToChat = (chatId) => {
    return (msg) => {
      const { chats } = this.state
      let updatedChats = chats.map((chat) => {
        if(chat.id === chatId) {
          chat.messages.push(msg);
        }
        return chat
      });
      this.setState({chats: updatedChats});
    }
  }

  typingMsg = (chatId) => {
    return ({user, isTyping}) => {
      if(user !== this.props.user.name) {
        const {chats} = this.state;

        let updatedChats = chats.map((chat) => {
          if(chat.id === chatId) {
            if(isTyping && !chat.typingUsers.includes(user)) {
              chat.typingUsers.push(user)
            } else if(!isTyping && chat.typingUsers.includes(user)) {
              chat.typingUsers = chat.typingUsers.filter(u => u !== user);
            }
          }
          return chat;
        });
        this.setState({chats: updatedChats});
      }
    }
  }

  sendMsg = (chatId, msg) => {
    const { socket } = this.props
    socket.emit(MESSAGE_SENT, {chatId, msg})
  }

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props
    socket.emit(TYPING, {chatId, isTyping})
  }

  render() {
    const { activeChat, users } = this.state
    const { user } = this.props

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-3">
              <aside className="sidebar">
                {users && differenceBy(users, [user], 'id').map((user, idx) => 
                  <ChannelOption key={user.id} name={user.name} />
                )}
              </aside>
            </div>           
            <div className="col-md-9 position-relative">
             {activeChat && <div>
              <section className="messages-list">
                <Messages messages={activeChat.messages}  typingUsers={activeChat.typingUsers} />
              </section>
              <section className="new-message">
                <MessageInput 
                  sendMsg={
                    (msg) => {
                      this.sendMsg(activeChat.id, msg)
                    }
                  }
                  sendTyping={
                    (isTyping) => {
                      this.sendTyping(activeChat.id, isTyping)
                    }
                }/>
              </section></div>
             }
            </div>
          </div>
        </div>
      </div>
    )
  }
}