const express = require('express'); // same as import in react
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // mongoose is bridge library to mongo
const session = require('express-session'); // save user session
const MongoStore = require('connect-mongo'); // save user session to mongo db
const { connection_string } = require('./utils/consts');
const UserRoute = require('./routes/user')
const AuthRoute = require('./routes/auth')
const TaskRoute = require('./routes/tasklist')
const passport = require('passport');
const Strategy = require('./utils/passport');

const PORT = 5000;

console.log('connection_string', connection_string)
// Connect to database
mongoose.connect(connection_string, { useNewUrlParser: true })
const db = mongoose.connection; // get the db connection reference
// Database events
db.on('error', (err) => console.error('Invalid db connection', err))
db.once('open', () => {
	console.log('DB connected')
})

// connect user session to mongo db
// attach module session into express app
// app.use(session({
// 	secret: 'mydbsession123',
// 	resave: false,
// 	saveUninitialized: true,
// 	store: new MongoStore({ mongooseConnection: db }), 
// 	cookie: { secure: false }
// }))

// increase the limit size to 5 MB, default: 100kb
// attach bodyParser module into app
app.use(bodyParser.json({ limit: '5mb' }))
// req: request, res: response
app.get('/', (req, res) => {
	res.send('Welcome to my backend');
})
app.use(passport.initialize())
// enable to save passport token into session
//app.use(passport.session())
// Start to listening for every connection
app.use('/auth', AuthRoute);
// Any API started /user => handled by UserRoute
app.use('/user', passport.authenticate('jwt', {failureRedirect: '/auth/login', session: false}), UserRoute);
// Initialize passport Strategy
// app.use('/user', UserRoute)
//let uploadfolder can be accessed by public user
app.use('/upload' ,express.static('upload'))

app.use('/tasklist', passport.authenticate('jwt', {failureRedirect: '/auth/login', session: false}), TaskRoute);

app.listen(PORT, () => {
    console.log('Web server started using Port=', PORT)
})