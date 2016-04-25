// JavaScript source code

angular.module('App.controllers', [])

.controller('HomeCtrl', function ($scope, Feed, $filter) {
    var loadView = function () {
        Feed.hisConnected().then(function (user) {
            Feed.tmp(10).then(function (data) {
                $scope.threads = data.data;
                $scope.$apply();
            });
        })
        .catch(function (error) {
            alert('Not logged in!');
        });
    };

    $scope.getDate = function (date) {
        return $filter('date')(Date.parse(date), "dd/MM/yyyy HH:mm");
    }

    $scope.sendResponse = function (id, message) {
        Feed.send(id, message, window.pending_attachments).then(function (msg) {
            alert('message envoyé.');
            $scope.message = "";
            console.log(msg);
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    loadView();
});