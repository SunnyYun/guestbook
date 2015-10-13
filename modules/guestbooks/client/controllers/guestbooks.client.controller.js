//second step;sixth step
'use strict';

angular.module('guestbooks').controller('guestbooksController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Guestbooks',
    function ($scope, $state, $stateParams, $location, Authentication, Guestbooks) {
        $scope.authentication = Authentication;
        //$scope.commenttext = {show:false};
        //$scope.togglleMenu = function (guestbook) {
        //    guestbook.show = !guestbook.show
        //};


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

        $scope.remove = function (guestbookone) {
            console.log('7777777777777777777');

            if (guestbookone) {
                console.log('8888888888888888888');

                guestbookone.guestbook.$remove();

                for (var i in $scope.guestbooks) {
                    if ($scope.guestbooks[i] === guestbook) {
                        $scope.guestbooks.splice(i, 1);
                    }
                }
            }
        };

        $scope.find = function () {
            $scope.guestbooks = Guestbooks.query();
        };

        $scope.findOne = function () {
            $scope.guestbookOne = Guestbooks.get({
                guestbookId: $stateParams.guestbookId
            });
        };
    }
]);


