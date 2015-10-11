'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    oauth2orize = require('oauth2orize'),
    tokenService = require('../../services/token.server.service.js'),
    mongoose = require('mongoose'),
    passport = require('passport'),

    User = mongoose.model('User'),
    Client = mongoose.model('Client'),
    AccessToken = mongoose.model('AccessToken'),
    AuthorizationCode = mongoose.model('AuthorizationCode');

var server = oauth2orize.createServer();

var errorHandler = function (req, res) {
    return res.status(500).send('Something went wrong!');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uid(len) {
    var buf = [];
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
}


// Register authorization code grant type
server.grant(oauth2orize.grant.code(
    function (client, redirectURI, user, ares, done) {
        var ac = new AuthorizationCode({
            code: uid(16),
            clientId: client._id,
            redirectURI: redirectURI,
            userId: user._id,
            scope: ares
        });

        ac.save(function (err) {
            if (err) {
                return done(err);
            }
            return done(null, ac.code);
        });
    }));

// For resource owner flow
server.exchange(oauth2orize.exchange.password(
    function (client, username, password, scope, done) {

        if (!client.isResourceOwnerAuthType()) {
            return done('client authType incorrect');
        }

        User.findOne({username: username}, function (err, user) {

            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }

            if (user.authenticate(password)) {
                var at = new AccessToken();

                at.userId = user._id;
                at.clientId = client._id;
                at.scope = scope;

                at.token = tokenService.createAccessToken(at.userId, at.clientId, at.scope);

                at.save(function (err) {
                    if (err) {
                        return done(err);
                    }
                    return done(null, at.token);
                });

            } else {
                return done(null, false);
            }
        });
    }));

// Exchange authorization codes for access tokens
server.exchange(oauth2orize.exchange.code(function (client, code, redirectURI, done) {
    AuthorizationCode.findOne({code: code}, function (err, authorizationCode) {
        if (err) {
            return done(err);
        }
        if (client._id.toString() !== authorizationCode.clientId.toString()) {
            return done(null, false);
        }
        if (redirectURI.toLowerCase() !== authorizationCode.redirectURI.toLowerCase()) {
            return done(null, false);
        }

        var at = new AccessToken();

        at.userId = authorizationCode.userId;
        at.clientId = authorizationCode.clientId;
        at.scope = authorizationCode.scope;

        at.token = tokenService.createAccessToken(at.userId, at.clientId, at.scope);

        at.save(function (err) {
            if (err) {
                return done(err);
            }
            return done(null, at.token);
        });
    });
}));

server.serializeClient(function (client, done) {
    return done(null, client._id);
});

server.deserializeClient(function (id, done) {

    Client.findOne({_id: id}, function (err, client) {
        if (err) {
            return done(err);
        }
        return done(null, client);
    });
});

// User authorization endpoint
exports.authorize = [
    server.authorize(function (clientID, redirectURI, done) {
        Client.findOne({id: clientID}, function (err, client) {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            if (client.redirectURI.toLowerCase() !== redirectURI.toLowerCase()) {
                return done(null, false);
            }
            return done(null, client, client.redirectURI);
        });
    }),
    function (req, res) {

        Client.findOne({_id: req.oauth2.client._id}, function (err, client) {
            User.findOne({_id: req.user._id}, function (err, user) {
                var allInOneInfo = {
                    transactionID: req.oauth2.transactionID,
                    user: user.toUserWithoutPasswordHash(),
                    client: client.toClientWithoutSecretHash()
                };
                return res.json(allInOneInfo);
            });
        });
    },
    errorHandler];

exports.decision = [
    server.decision(),
    errorHandler
];

// Application client token exchange endpoint
exports.token = [
    server.token(),
    errorHandler
];

exports.deny = function (req, res) {
    Client.findOne({_id: req.body.clientId}, function (err, client) {
        res.append('location', client.homeURI);
        res.append('vary', 'Accept');
        res.status(302).send('<p>Moved Temporarily. Redirecting to ' +
            '<a href="' +
            client.homeURI +
            '">' +
            client.homeURI +
            '</a></p>');
    });
};

exports.me = function (req, res) {

    User.findOne({_id: req.user._id}, function (err, user) {
        if (err) {
            return res.json({message: 'user does not exist'});
        } else {
            return res.json(user.toUserWithoutPasswordHash());
        }
    });
};
