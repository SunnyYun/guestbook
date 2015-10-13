/**
 * Created by Flyiyi on 2015/10/11.
 */
'use strict';

angular.module('guestbooks').factory('Comments', ['$resource',
    function($resource) {
        return $resource('api/comment/:commentId', {
            commentId: '@_id'
            //parent: '@parent'
        }, {
            update:{
                method: 'put'
            },
            query:{
                method: 'get'
            }
        });
    }
]);
