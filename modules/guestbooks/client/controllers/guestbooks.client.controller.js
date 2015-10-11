//second step;sixth step
'use strict';

angular.module('guestbooks').controller('guestbooksController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Guestbooks',
    function ($scope, $state, $stateParams, $location, Authentication, Guestbooks) {
        $scope.authentication = Authentication;
        //$scope.commenttext = {show:false};
        $scope.togglleMenu = function (guestbook) {
            guestbook.show = !guestbook.show
        };


        $scope.create = function () {
            console.log('--------------create------------------');
            var guestbook = new Guestbooks({
                //theme: this.theme,
                content: this.content
            });
            guestbook.$save(function (response) {
                $scope.content = '';
                $scope.find();
                //$scope.guestbooks.push(response);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function (guestbook) {
            if (guestbook) {
                guestbook.$remove();
                for (var i in $scope.guestbooks) {
                    if ($scope.guestbooks[i] === guestbook) {
                        $scope.guestbooks.splice(i, 1);
                    }
                }
            } else {
                $scope.guestbook.$remove(function () {
                    $location.path('guestbooks');
                });
            }
        };

        $scope.reply = function () {
            var guestbook = $scope.guestbook;
            console.log(guestbook);
            var comment = {
                content: $scope.content
            };       //why the var?
            guestbook.comments = comment;
            guestbook.$update(function (res) {
                $scope.content = '';
                $scope.findOne();
                //$scope.guestbook = res;
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function () {
            $scope.guestbooks = Guestbooks.query();
        };

        $scope.findOne = function () {
            $scope.guestbook = Guestbooks.get({
                guestbookId: $stateParams.guestbookId
            });
        };
    }
]);
