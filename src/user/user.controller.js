const bcrypt = require('bcrypt');
const saltRounds = 10;
const asyncErrorBoundary = require("../errors/asyncErrorBoundary.js")

const service = require("./user.service")

const login = async (req, res) => {
    const { username } = req.body;
    const { password } = req.body;
    const { session } = req.body;
    const { userCreated } = res.locals;

    const user = await service.find(username);
    if (session && user.session == session) {
        return res.status(200).json({
            username: user.username,
            logged_in: true
        });
    } else if (user) {
        bcrypt.compare(password, user.password).then(async success => {
            if (success) {
                const session = Date.now();
                const userData = {
                    username: user.username,
                    logged_in: true,
                    session: session,
                    userCreated: false
                }
                if (userCreated) userData.userCreated = true;
                await service.setSession(username, session)
                return res.status(200).json({...userData});
            } else {
                return res.status(400).json({user: null});
            }
        }).catch(err => res.status(500))
    } else {
        return res.status(404).json({user: null});
    }
}
const signup = async (req, res, next) => {
    const { username } = req.body;
    const { password } = req.body;
    bcrypt.hash(password, saltRounds).then(async hash => {
        const user = await service.create(username, hash);
        if (user) {
            res.locals.userCreated = true;
            return next();
        } else {
            return res.status(202).json({userCreated: false})
        }
    }).catch(err => res.status(400).json({message: 'Something went wrong'}));
}

module.exports = {
    login: [asyncErrorBoundary(login)],
    signup: [asyncErrorBoundary(signup), asyncErrorBoundary(login)]
}