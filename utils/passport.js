const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const UserDb = require('../models/user')
const TaskDb = require('../models/tasklist')
const jwt = require('jsonwebtoken')

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordFiled : 'password'},
    (username, password, done ) => {
        console.log('username=' , username)
        console.log('password=' , password)

        done(null, 'ok')
    }
    ))

const options = {}
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = 'hs123$@Abc'
passport.use(new JWTStrategy(options, (jwt_playload, done) => {
    //done is callback function that have 2 parameter:
    //1st parameter: error message
    //2nd parameter: User data
    console.log(jwt_playload)
    UserDb.findOne({_id: jwt_playload.id} , (err, data) => {
        if (!err)
        {
            if (data) // If user is found
            {
                
                // return User Data and save intop  session
                done(null, data);
            }
            else
            {
                done('InvalidUser', null);
            }
        }
        else
        {
            done(err.message, null);
        }
    })
}))
