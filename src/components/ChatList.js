import React, {Component} from 'react'

export default class ChatList extends Component {
  switchRoom = (room) => {
    const { joinRoom } = this.props
    joinRoom(room)
  }
  render() {
    const { list, title } = this.props
    return (
      <div className="position-relative">
        <h4>{title}</h4>
        <div className="content">
          <ul className="nav nav-pills nav-stacked">
            {list !== {} && Object.keys(list).map((item, idx) =>          
              <li key={idx} onClick={(e) => (this.switchRoom(item))} className="chats text-info">
                {item}
              </li>
            )}
          </ul>
          {/* {list !== {} && Object.keys(list).map((item, idx) =>          
            <div key={idx} className="user">
              <a href="">{item}</a>
            </div>
          )} */}
        </div>
      </div>
    )
  }
}