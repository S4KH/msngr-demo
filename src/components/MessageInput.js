import React, {Component} from 'react'

export default class MessageInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "",
      isTyping: false
    }
  }

  // Used for catching 'Enter'
  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.msg !== "") {
      this.props.sendMsg(this.state.msg);
      this.setState({msg: ""});
    }
  }

  sendTyping = () => {
    this.lastUpdateTime = Date.now()
    if(!this.state.isTyping) {
      this.setState({isTyping: true})
      this.props.sendTyping(true)
      this.startCheckTyping()
    }
  }

  startCheckTyping = () => {
    this.typingInterval = setInterval(() => {
      if((Date.now() - this.lastUpdateTime) > 300) {
        this.setState({isTyping: false});
        this.stopCheckTyping()
      }
    }, 300)
  }

  stopCheckTyping = () => {
    if(this.typingInterval) {
      clearInterval(this.typingInterval)
      this.props.sendTyping(false)
    }
  }

  render() {
    const { msg } = this.state
    return (
      <div className="col-md-9">
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <input 
                type="text" className="form-control" 
                value={ msg }
                autoComplete= {'off'}
                onKeyUp = { e => { e.keyCode !== 13 && this.sendTyping() } } 
                onChange={({target}) => { this.setState({msg: target.value})}} 
                placeholder="Type your..."
              />

              <span className="input-group-btn">
                <button disabled={msg.length > 1} className="btn btn-default " type="button"><span className="glyphicon glyphicon-send"></span></button>
              </span>
            </div>
          </form>
      </div>
    )
  }
}