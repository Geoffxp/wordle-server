const service = require("./user.service")

const login = async (req, res) => {
    const { username } = req.body;
    const user = await service.find(username);
    if (user) {
        return res.status(200).json({...user})
    } else {
        return res.status(400).json({user: null})
    }
}
const signup = async (req, res) => {
    const { username } = req.body;
    const user = await service.create(username);
    if (user) {
        return res.status(200).json({userCreated: true})
    } else {
        return res.status(202).json({userCreated: false})
    }
}

module.exports = {
    login,
    signup
}