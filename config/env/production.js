'use strict';

module.exports = {
    secure: false,
    port: process.env.PORT || 8080,
    db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean'
};
