/**
 * Created by David Aldorf on 05.06.2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    user_id: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);

var Comment = new Schema({
    title : String,
    user_id: String,
    updated_at : Date
});

mongoose.model('comments', Comment);