const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const UserDb = require('../models/user')
const TaskDb = require('../models/tasklist')
const jwt = require('jsonwebtoken')
const {SECRET} = require("./consts")


console.log(SECRET)
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
options.secretOrKey = SECRET;
passport.use(new JWTStrategy(options, (jwt_payload, done) => {
    console.log('token is', jwt_payload);
    // done is a callback function that have 2 parameters:
    // 1st parameter: error message
    // 2nd parameter: User data
    UserDb.findOne({ _id: jwt_payload.id }, (err, data) => {		
        if (!err)
        {
            if (data)	// If user is found
            {
                console.log('Verification success:', data);
                // return User Data and save into session
                // this data will be inserted into every request, i.e. req.user
                done(null, data);
            }
            else
            {
                done('Invalid User', null);
            }
        }
        else
        {
            done(err.message, null);
        }
    })
}));