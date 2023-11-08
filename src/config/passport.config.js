import passport from "passport";
import local from 'passport-local'
import UserModel from "../dao/models/user.model.js";
import { createHash } from "../utils.js";

const LocalStratey = local.Strategy
const initializePassport = () => {

    passport.use('register', new LocalStratey({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await UserModel.findOne({ email: username })
            if (user) {
                console.log('User already exists')
                return done(null, false)
            }
            const newUser = {
                first_name, last_name, email, age, password: createHash(password)
            }
            const result = await UserModel.create(newUser)
            return done(null, result)
        } catch(err) {}
    }))

    // passport.use('login', new LocalStratey({

    // }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })

}

export default initializePassport