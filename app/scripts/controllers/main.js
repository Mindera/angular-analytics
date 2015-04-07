'use strict';

/**
 * @ngdoc function
 * @name angularAnalyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularAnalyticsApp
 */
angular.module('angularAnalyticsApp')
    .controller('MainCtrl', function ($scope) {
        $scope.title = 'Main';
        $scope.test = function () {
            return {
                eventProperties: {
                    category: 'category',
                    action: 'action',
                    label: 'label',
                    value: 1,
                    noninteraction: false
                }
            };
        };
    });
