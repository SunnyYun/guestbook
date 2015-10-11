'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
    return (this.provider !== 'local' || (password && password.length >= 6));
};

/**
 * Directory model definition
 *
 * @module Users
 * @class User
 */

/**
 * User Schema
 */
var UserSchema = new Schema({
    /**
     * @attribute firstName
     * @readOnly
     * @required
     * @type String
     */
    firstName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    /**
     * @attribute lastName
     * @readOnly
     * @required
     * @type String
     */
    lastName: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    /**
     * @attribute displayName
     * @readOnly
     * @required
     * @type String
     */
    displayName: {
        type: String,
        trim: true
    },
    /**
     * @attribute email
     * @readOnly
     * @required
     * @type String
     */
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    /**
     * @attribute username
     * @readOnly
     * @required
     * @type String
     */
    username: {
        type: String,
        unique: 'this user name has been registered',
        required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        default: '',
        validate: [validateLocalStrategyPassword, 'Password should be longer']
    },
    salt: {
        type: String
    },
    profileImageURL: {
        type: String,
        default: 'modules/users/img/profile/default.png'
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {},
    additionalProvidersData: {},
    roles: {
        type: [{
            type: String,
            enum: ['user', 'admin']
        }],
        default: ['user']
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    rootDirectory: {
        type: Schema.ObjectId,
        ref: 'Directory'
    }
});

/**
 * Hook a pre save method to hash the password
 */

var Directory = mongoose.model('Directory');

UserSchema.pre('save', function (next) {

    var user = this;

    if (user.password && user.password.length >= 6) {
        user.salt = crypto.randomBytes(16).toString('base64');
        user.password = user.hashPassword(user.password);
    }

    next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
    return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.methods.toUserWithoutPasswordHash = function () {
    var obj = this.toObject();
    delete obj.password;
    delete obj.salt;

    return obj;
};

mongoose.model('User', UserSchema);
