
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , vehicle = require('./routes/vehicle')
  , http = require('http')
  , cradle = require('cradle')
  , path = require('path');

var app = express();

app.configure(function()
{
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('title', 'Benefleet');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(function(req, res, next){
        var err = req.session.error
            , msg = req.session.success;
        delete req.session.error;
        delete req.session.success;
        res.locals.message = '';
        if (err) res.locals.message = err;
        if (msg) res.locals.message = msg;
//        if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
        next();
  });
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

app.get('/login', function(req, res){
    res.render('login');
});
app.get('/register', function(req, res) {
   res.render('register');
});
app.post('/login', user.login);
app.post('/register', user.register);

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

app.get('/', restrict, routes.index);
app.get('/users', restrict, user.list);
app.get('/vehicle', restrict, vehicle.list);
app.get('/logout', user.logout);
app.get('/vehicle/:id', restrict, vehicle.edit);

app.post('/vehicle', restrict, vehicle.add);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});
