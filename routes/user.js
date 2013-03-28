var db = require('../model/dao.js').db;
var hash = require('pwd').hash;


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.logout = function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect('/');
    })
};

exports.login = function(req, res){
    authenticate(req.body.username, req.body.password, function(err, user){
        if (user) {
            // Regenerate session when signing in
            // to prevent fixation
            req.session.regenerate(function(){
                // Store the user's primary key
                // in the session store to be retrieved,
                // or in this case the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.name
                    + ' click to <a href="/logout">logout</a>. '
                    + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/');
            });
        } else {
            console.log("Authentication failed");
            req.session.error = 'Authentication failed, please check your '
                + ' username and password.';
            res.redirect('login');
        }
    });
};

exports.register = function(req, res){
    if (!module.parent) console.log('registering %s:%s', req.body.username, req.body.password);

    db.get(req.body.username, function (err, doc) {
        if(doc) {
           req.session.regenerate(function(){
            req.session.error = req.body.username + ' is an existing username';
            res.redirect('/register'); 
        });
       }
    else {
        console.log("New user being registered, user: " + req.body.username);

        hash(req.body.password, function (err, salt, hash) {
            if (err) return fn(err);
            db.save(req.body.username, {
                salt: salt, hash: hash
            }, function (err, res) {
                console.log('Need to handle db response');
                if(err) console.log('DB error saving user - ' + err);
            });
        });
        req.session.regenerate(function(){
                req.session.success = 'Registered as ' + req.body.username;
                res.redirect('/login');
        });
    }
    });
}


// dummy database
/*
var users = [
    {name: 'tj'}];

var lookup = [];
for (var i = 0, len = users.length; i < len; i++) {
    lookup[users[i].name] = users[i];
}

var users = {
    tj: { name: 'tj' },
    tom: { name: 'tom', pass: ''}
};
*/

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)
/*
hash('foobar', function(err, salt, hash){
    if (err) throw err;
    // store the salt & hash in the "db"
    users[0].salt = salt;
    users[0].hash = hash;
});
*/

// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
    if (!module.parent) console.log('authenticating %s:%s', name, pass);
    db.get(name, function (err, user) {
      /*  
      console.log("---------");
      console.log("DB debug statement");
      console.log(doc);
      console.log("---------")
      */
    console.log("in authenticate");
    console.log(user);
    // query the db for the given username
    if (!user) return fn(new Error('cannot find user'));
    // apply the same algorithm to the POSTed password, applying
    // the hash against the pass / salt, if there is a match we
    // found the user
    hash(pass, user.salt, function (err, hash) {
        if (err) return fn(err);
        if (hash == user.hash) return fn(null, user);
        fn(new Error('invalid password'));
    });

    });
}

