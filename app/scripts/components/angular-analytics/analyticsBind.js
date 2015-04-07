(function (angular) {
    'use strict';

    angular.module('angularAnalytics.base')
        .directive('analyticsBind', ['$analytics', function ($analytics) {
        function getProperty(name) {
            var outputString = '';
            if (isCustomProperty(name)) {
                outputString = name.slice(15);

            } else {
                outputString = name.slice(9);
            }

            if (typeof outputString !== 'undefined' && outputString !== null && outputString.length > 0) {
                return outputString.substring(0, 1).toLowerCase() + outputString.substring(1);
            }
            else {
                return outputString;
            }
        }

        function isValidProperty(name) {
            return name.indexOf('analytics') === 0 && name.length > 9;
        }

        function isCustomProperty(name) {
            return name.indexOf('analyticsCustom') === 0;
        }

        return {
            restrict: 'A',
            scope: true,
            link: function ($scope, $element, $attrs) {
                var eventType = $attrs.analyticsBind,
                    eventProperties = {},
                    customProperties = {},
                    functionObject,
                    propertyName;

                if ($attrs.analyticsFunction && typeof($scope[$attrs.analyticsFunction]) === 'function') {
                    functionObject = $scope[$attrs.analyticsFunction].call();
                    if (functionObject) {
                        if (functionObject.eventProperties) {
                            eventProperties = functionObject.eventProperties;
                        }
                        if (functionObject.customProperties) {
                            customProperties = functionObject.customProperties;
                        }
                    }
                } else {
                    eventProperties.action = eventType;

                    angular.forEach($attrs.$attr, function (attr, name) {
                        if (isValidProperty(name)) {
                            propertyName = getProperty(name);
                            if (isCustomProperty(name)) {
                                customProperties[propertyName] = {};
                                customProperties[propertyName].name = getProperty(name);
                                var params = $attrs[name].split('|');
                                angular.forEach(params, function (param, index) {
                                    switch (index) {
                                        case 0:
                                            customProperties[propertyName].slot = param;
                                            break;
                                        case 1:
                                            customProperties[propertyName].value = param;
                                            break;
                                        case 2:
                                            customProperties[propertyName].scope = param;
                                            break;
                                    }
                                });

                            } else {
                                eventProperties[propertyName] = $attrs[name];
                            }
                        }
                    });
                }
                angular.element($element[0]).bind(eventType, function () {
                    if ($attrs.analyticsIf) {
                        if (!$scope.$eval($attrs.analyticsIf)) {
                            return;
                        }
                    }

                    $analytics.sendEvent(eventProperties, customProperties);
                });
            }
        };
    }]);
})(angular);