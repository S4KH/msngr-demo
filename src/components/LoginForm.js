import React, { Component } from 'react';

export default class LoginForm extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	nickname:"",
	  };
	}

	handleSubmit = (e)=>{
		e.preventDefault()
		const { nickname } = this.state
		if(nickname) {
      this.props.setUser(nickname)
    }
	}

	handleChange = (e)=>{	
		this.setState({nickname: e.target.value})
	}

	render() {	
		const { nickname } = this.state
		return (
				<form onSubmit={this.handleSubmit}>
          <div className="text-center form-group">
            <label htmlFor="nickname" className="control-label">
              <h3>Your nickname?</h3>
            </label>
            <input
              ref={(input)=>{ this.textInput = input }} 
              type="text"
              id="nickname"
              className="form-control"
              value={nickname}
              onChange={this.handleChange}
              placeholder={'What should we call you'}
              />
          </div>
				</form>			
		);
	}
}