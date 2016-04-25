// JavaScript source code

angular.module('App', ['ngRoute', 'App.controllers', 'App.service', 'App.directives'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider

    .when('/', {
        templateUrl: "templates/home.html",
        controller: "HomeCtrl"
    });
}]);