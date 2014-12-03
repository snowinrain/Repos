var app = angular.module('myProject', [
    'templates-app',
    'templates-common',
    'myProject.main',
    'ui.router',
    'kendo.directives'

])
    .config(function appStateConfig($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        
        $stateProvider
            .state('index', {
                templateUrl: 'main/main.tpl.html',
                controller: 'mainController'
            })
            .state('a', {
                url: '',
                templateUrl: 'main/overview/overview.tpl.html',
                controller: 'overviewController'
            })
            .state('configuration', {
                url: '',
                templateUrl: 'main/configuration/configuration.tpl.html',
                controller: 'configurationController'
            })
            .state('b', {
                templateUrl: 'un-subscription/un-subscription.tpl.html'
            });
    })

    .run(function run($rootScope, $state, $location) {
        $location.path('/');
        $state.go('index', {});
    })

    .controller('appCtrl', function AppCtrl($scope) {
        
    });

