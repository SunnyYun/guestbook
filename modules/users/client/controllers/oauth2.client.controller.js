'use strict';


angular.module('users').controller('OAuth2Controller',
    ['$scope', '$http', '$state', '$location', 'Authentication', 'Oauth2',
        function ($scope, $http, $state, $location, Authentication, Oauth2) {
            $scope.authentication = Authentication;

            var search = Oauth2.getSearch();

            $scope.search = 'response_type='+ search.response_type +
                '&client_id='+ search.client_id +
                '&redirect_uri='+ search.redirect_uri +
                '&state='+ search.state;


            // If user is signed in then redirect oauth2 signin
            if (!$scope.authentication.user) {
                $state.go('oauth2.signin', search);
            } else {
                Oauth2.me()
                    .success(function () {
                        Oauth2.authorize(search)
                            .success(function (data) {
                                $scope.client = data.client;
                                $scope.user = data.user;
                                $scope.tid = data.transactionID;
                                $scope.progerssing = false;
                            }).error(function (err) {
                                $location.path('server-error');
                            });
                    })
                    .error(function (err) {
                        $location.path('server-error');
                    });
            }

            $scope.signup = function () {
                $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;

                    // And redirect to the index page
                    $state.go('oauth2.authorize', search);
                }).error(function (response) {
                    $scope.error = response.message;
                });
            };

            $scope.signin = function () {
                $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
                    // If successful we assign the response to the global user model
                    $scope.authentication.user = response;

                    // And redirect to the index page
                    $state.go('oauth2.authorize', search);
                }).error(function (response) {
                    $scope.error = response.message;
                });
            };
        }
    ]);
