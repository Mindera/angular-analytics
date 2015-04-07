'use strict';

/**
 * @ngdoc overview
 * @name angularAnalyticsApp
 * @description
 * # angularAnalyticsApp
 *
 * Main module of the application.
 */
angular
    .module('angularAnalyticsApp', [
        'ngResource',
        'ngRoute',
        'angularAnalytics.base',
        'angularAnalytics.gaq',
//        'angularAnalytics.gtm',
        'analyticsconfig'
    ])
    .config(['$routeProvider', '$analyticsProvider', 'ANALYTICS.CONFIG', function ($routeProvider, $analyticsProvider, $analyticsconfig) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/about', {
                templateUrl: 'views/about.html',
                controller: 'AboutCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $analyticsProvider.setAccount('UA-56447609-1', 'none');
        $analyticsProvider.setAdditionalParameters($analyticsconfig);
    }]);
