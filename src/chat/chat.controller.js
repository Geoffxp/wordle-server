let lobby = {
    active: false,
    messages: [],
    users: [],
    timeouts: []
};
const getChat = (req, res) => {
    lobby.timeouts.forEach(timeout => clearTimeout(timeout));
    lobby.timeouts.push(setTimeout(() => {
        lobby.messages = [];
    }, 10000))
    return res.status(200).json({
        messages: lobby.messages,
        users: lobby.users
    })
}
const startChat = (req, res, next) => {
    const user = req.body.user;
    if (!lobby.users.includes(user)) {
        lobby.users.push(user);
        lobby.messages.push(`${user} has joined the chat`);
    }
    return next();
}
const postChat = (req, res, next) => {
    lobby.messages.push(req.body.message);
    return next();
}

module.exports = {
    getChat,
    start: [startChat, getChat],
    post: [postChat, getChat]
}