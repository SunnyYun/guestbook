angular.module('guestbooks').controller('commentsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Comments',
    function ($scope, $state, $stateParams, $location, Authentication, Comments) {
        $scope.authentication = Authentication;
        $scope.reply = function () {
            var guestbook = $scope.$parent.guestbookOne.guestbook;
            var comment = new Comments({
                content: this.content,
                guestbook:guestbook._id
            });
            comment.$save(function (response) {
                $scope.content = '';
                $scope.$parent.findOne();
                //$scope.guestbooks.push(response);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        //$scope.find = function () {
        //    $scope.comments = Comments.query();
        //};

    }
]);

///**
// * Created by Flyiyi on 2015/10/11.
// */
//'use strict';
//
//angular.module('guestbooks').directive('commentList', ['Comment', 'toastr', '$state', '$modal', '$http', function (Comment, toastr, $state, $modal, $http) {
//    return {
//        templateUrl: '/modules/guestbooks/client/views/commentlist.part.client.view.html',
//        restrict: 'E',
//        scope: {
//
//        },
//        controller: function ($scope) {
//            $scope.reply = function () {
//                var guestbook = $scope.$parent.guestbook;
//                var comment = new Comment({
//                    content: this.content
//                });
//                console.log(guestbook);
//                comment.$save();
//            };
//            $scope.find = function () {
//                $scope.comments = Comment.query();
//            };
//
//        }
//    };
//}]);
//
