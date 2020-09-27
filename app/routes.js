module.exports = function(app, passport, db, ObjectId) {


    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });


    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('debt').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            debt: result
          })
        })
    });


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/person', (req, res) => {
      //this line is saying go into the debt collection, save the info from debter & debt
      db.collection('debt').save(
        {
        company: req.body.company,
        dbt: parseInt(req.body.dbt),
        owe: parseInt(req.body.dbt),
         amountPaid: 0
       }, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/profile')
      });

    })
    app.put('/person', (req, res) => {
      const uid = ObjectId(req.body._id)
      db.collection('debt').findOneAndUpdate({_id: uid}, {
        $inc: {
          amountPaid: parseInt(req.body.amount)
        }
      }, {
        sort: {_id: -1},
        //populates from the bottom up (asending or decending)
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })



    app.delete('/person', (req, res) => {
      const uid = ObjectId(req.body._id)
      db.collection('debt').findOneAndDelete({'_id':uid}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Debt Paid!')
      })
    })




        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });
          const passportConfig = {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true //
          }
        // process the login form
        app.post('/login', passport.authenticate('local-login', passportConfig));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future


    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
