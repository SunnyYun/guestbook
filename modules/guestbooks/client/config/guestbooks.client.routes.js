//seventh step
'use strict';

angular.module('guestbooks').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
            state('guestbooks', {
                abstract: true,
                url: '/guestbooks',
                template: '<ui-view/>'
            }).
            state('guestbooks.view', {
                url: '/:guestbookId',
                templateUrl: 'modules/guestbooks/views/view-guestbook.client.view.html'
            }).
            state('guestbooks.list', {
                url: '',
                templateUrl: 'modules/guestbooks/views/list-guestbooks.client.view.html'
            });
            //state('guestbooks.create', {
            //    url: '/create',
            //    templateUrl: 'modules/guestbooks/views/create-guestbook.client.view.html'
            //}).
            //state('guestbooks.view', {
            //    url: '/:guestbookId',
            //    templateUrl: 'modules/guestbooks/views/view-guestbook.client.view.html'
            //})
            //state('guestbooks.edit', {
            //    url: '/:guestbookId/edit',
            //    templateUrl: 'modules/guestbooks/views/edit-guestbook.client.view.html'
            //});
    }
]);
