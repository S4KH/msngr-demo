const uuidv4 = require('uuid/v4');

const createChat = ({messages = [], name = "Global", users = [], isCommunity = false} = {})=>(
	{
		id: isCommunity ? 'globalChat' : uuidv4(),
		name: isCommunity ? name : createChatNameFromUsers(users),
		messages,
		users,
		typingUsers:[],
		isCommunity
	}
)

const createUser = ({name = "", socketId = null } = {})=>(
	{
		id:uuidv4(),
		name,
		socketId
	}
)

const createMessage = ({message = "", sender = ""} = {})=>(
  {
    id:uuidv4(),
    time:getTime(new Date(Date.now())),
    message,
    sender	
  }
)

const getTime = (date) => {
	return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`;
}

const createChatNameFromUsers = (users, excludedUser = "") => {
	return users.filter(u => u !== excludedUser).join(' & ') || "Empty Chat"
}

module.exports = {
  createChat,
  createMessage,
  createUser
}