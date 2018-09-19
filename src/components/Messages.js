import React, { Component } from 'react';

export default class Messages extends Component {

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom = () => {
    const { messageList } = this.refs;
    messageList.scrollTop = messageList.scrollHeight    
  }


  render() {
    const {messages, typingUsers} = this.props
    return (
      <div className="position-relative height-100">
        <div className="content" ref="messageList">
          {messages && messages.map((msg, idx) => 
            <div key={idx} className="message">
              <b>{msg.sender}</b> - <i>{msg.time}</i>: {msg.message}
            </div>
          )}
          {
						typingUsers.map((name, idx)=>{
							return (
								<div key={idx} className="typing-user">
									<i>{`${name} is`} <b>typing</b></i>
								</div>
							)
						})
					}
        </div>
      </div>
    )
  }
}
