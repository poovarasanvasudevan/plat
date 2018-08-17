const
    createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    sassMiddleware = require('node-sass-middleware'),
    helmet = require('helmet'),
    session = require('express-session'),
    csrf = require('csurf'),
    redisClient = require('redis'),
    fs = require('fs'),
    graphqlHTTP = require('express-graphql'),
    cors = require("cors"),
    queryString = require('query-string'),
    morgan = require('./core/Logger'),
    hbs = require('hbs'),
    url = require('url'),
    {URLSearchParams} = require('url'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    _ = require('lodash')
LocalStrategy = require('passport-local').Strategy;
var i18n = require("i18n-express");
var SSE = require('express-sse');
var glob = require("glob")
const MongoStore = require('connect-mongo')(session);


const {buildSchema} = require('graphql');

const
    indexRouter = require('./routes/index'),
    docsRouter = require('./routes/atlas-docs')
usersRouter = require('./routes/users');

const app = express();
const limiter = require('express-limiter')(app, redisClient.createClient());
limiter({
    lookup: ['connection.remoteAddress'],
    total: 100,
    expire: 1000 * 60 * 60
})

const MONGO = 'mongodb://localhost:27017/corre-db'

let viewFolders = [path.join(__dirname, 'views')]

glob("./modules/*/view",{},(err,files) => {
    _.each(files,(file) => {
        viewFolders.push(path.join(__dirname,file))
    })

})

// view engine setup
app.set('views', viewFolders);
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/component');
hbs.registerHelper('url', function (urls) {
    const parsedURL = url.parse(urls, true);
    const qry = parsedURL.query
    qry['_qa'] = new Date().valueOf()
    qry['clang'] = 'en'
    const params = new URLSearchParams(qry);
    return parsedURL.pathname + '?' + params.toString();
})

app.use(logger('common'));
app.use(morgan({
    collection: 'error_logger',
    connectionString: MONGO
}, {}, 'common'));

mongoose.connect(MONGO, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection


app.use(cors());
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'mySecretCookieSalt',
    key: 'myCookieSessionId',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: db}),
    cookie: {
        expires: new Date(Date.now() + 60 * 60 * 1000)
    }
}));
// app.use(csrf({ cookie: true }));
// app.use(function(req, res, next){
//     // Expose variable to templates via locals
//
//     res.locals.csrftoken = req.csrfToken();
//     next();
// });
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(i18n({
    translationsPath: path.join(__dirname, 'i18n'), // <--- use here. Specify translations files path.
    siteLangs: ["en"],
    textsVarName: 'translation'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.req = req;
    next();
});
app.use(require('./core/middleware/IPTracker')({}))
//app.use(require('./core/middleware/Cache'))
const contents = fs.readFileSync('./ql/init.ql', 'utf8');

const Account = require('./models/Account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());



app.use('/asset', express.static(path.join(__dirname, 'public')));
app.use(require('express-status-monitor')());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docs', docsRouter);
app.use('/trello', require('./modules/trello/route'));


let sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);
app.get('/stream', sse.init);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
