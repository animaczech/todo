var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('comments');


router.get('/', function (req, res) {
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
  res.render('register', { });
});

router.post('/register', function(req, res, next) {
  Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    if (err) {
      return res.render('register', { error : err.message });
    }

    passport.authenticate('local')(req, res, function () {
      req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});



/* GET form.
router.get('/form', function(req, res) {
    Comment.find(function(err, comments){
        console.log(comments);
        res.render(
            'form',
            {title : 'ToDo', comments : comments,
                createTime: new Date(),
                user_id    : req.cookies.user_id,
            }

        );
    });
});
 */
router.get('/form', function(req, res) {
    var user_id = req.cookies ?
        req.cookies.user_id : undefined;

    Comment.find({ user_id : user_id }).sort( '-updated_at' ).exec( function ( err, comments ){
        if( err ) return next( err );

        res.render(
            'form',
            {title : 'ToDo', comments : comments,
                user_id    : req.cookies.user_id
            }
        );
    });
});


/* POST form. */

router.post('/create', function(req, res) {
    new Comment({title : req.body.comment,
        user_id : req.cookies.user_id,
        updated_at: new Date()
    })
        .save(function(err, comment) {
            console.log(comment);
            res.redirect('form');
        });
});

module.exports = router;


router.get('/destroy/:id', function ( req, res, next ){
    Comment.findById( req.params.id, function ( err, todo ){
        var user_id = req.Account ?
            req.cookies.user_id : undefined;


        Comment.remove( function ( err, comment ){
            if( err ) return next( err );

            res.redirect( '/form' );
        });
    });
});

