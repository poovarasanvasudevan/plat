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
    { URLSearchParams } = require('url'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

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
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/component');
hbs.registerHelper('url', function (urls) {
    var parsedURL = url.parse(urls, true);
    const qry = parsedURL.query
    qry['_qa'] = new Date().valueOf()
    const params = new URLSearchParams(qry);
    return parsedURL.pathname +'?' + params.toString() ;
})

app.use(logger('common'));
app.use(morgan({
    collection: 'error_logger',
    connectionString: MONGO
}, {}, 'common'));


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
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./core/middleware/IPTracker')({}))
const contents = fs.readFileSync('./ql/init.ql', 'utf8');

const Account = require('./models/Account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect(MONGO, {useNewUrlParser: true});


const root = {
    hello: ({loop}) => {
        var cCat = "";
        for (i = 0; i < loop; i++) {
            cCat += i + "==> "
        }
        return cCat;
    },
};
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(contents),
    rootValue: root,
    graphiql: true,
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-status-monitor')());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docs', docsRouter);

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
