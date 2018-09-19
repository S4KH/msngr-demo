import React, { Component } from 'react';
import io from 'socket.io-client'
import './App.css';
import { USER_CONNECTED } from './io-handler/constants'
import ChatContainer from './container/ChatContainer'
import LoginForm from './components/LoginForm'
import { createUser } from './utils/factories'

const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:8080";
const options = {
  pingInterval: 5000,
  pingTimeout: 10000,
  transports: ['websocket'],
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: null
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  setUser = (nickname) => {
    const { socket } = this.state;
    let user = createUser({name: nickname, socketId: socket.id})
    socket.emit(USER_CONNECTED, user);
    this.setState({user});
  }

  initSocket = () => {
    const socket = io(socketUrl, options);
    socket.on('connect', () => {
      console.log('connected');
    });
    this.setState({socket});
  }

  render() {
    const { user, socket } = this.state
    return (
      <div className="main-container">
        <div className="container">
          { user ?
            <ChatContainer socket={socket} user={user} />
            :
            <LoginForm socket={socket} setUser={this.setUser} />
          }
        </div>
      </div>
    );
  }
}

export default App;
