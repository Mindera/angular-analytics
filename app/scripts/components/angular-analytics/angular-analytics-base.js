(function (angular) {
    'use strict';

    angular.module('angularAnalytics.base', []).provider('$analytics', function () {
        var api = {
                additionalAttributes: '',
                accountInfo: null,

                parseValue: function (value) {
                    var parsed = parseInt(value, 10);
                    return isNaN(parsed) ? 0 : parsed;
                },
                formatUrl: function (url) {
                    var outputUrl = '';
                    if (this.additionalAttributes) {
                        outputUrl = this.additionalAttributes;
                        if (url.indexOf('/') !== -1) {
                            // if the URL only contains a slash it means that we are on the root page of the project.
                            // If that is the case just add 'index' and move on
                            if (url === '/') {
                                outputUrl += 'index';
                            } else {
                                // If there is more then one '/' remove the first and last slashes if needed
                                if (url[0] === '/') {
                                    url = url.substring(1);
                                }

                                if (url[url.length - 1] === '/') {
                                    url = url.slice(0, -1);
                                }
                                // Replace remainder slashes by ':' which is the format we want to push to analytics
                                outputUrl += url.replace('/', ':');
                            }
                        } else {
                            outputUrl += url;
                        }
                    } else {
                        outputUrl = url;
                    }
                    return outputUrl;
                }
            },
            vendorHandlers = ['setupAccount', 'sendPageView', 'sendEvent', 'sendCustomVar'],
            handlers = {},
            provider = {
                //Return API instance
                $get: function () {
                    return api;
                },

                // Prefix that will be added on pageviews
                setAdditionalParameters: function (aAttributes) {
                    var prefix = '';
                    angular.forEach(aAttributes, function (attr) {
                        prefix += attr + ':';
                    });

                    api.additionalAttributes = prefix;
                },

                //Set information to be passed only to GAQ
                setAccount: function (accountId, domain) {
                    api.accountInfo = {
                        accountId: accountId,
                        domainName: domain
                    };
                }
            },

            updateHandlers = function (handlerName, fn) {
                if (!handlers[handlerName]) {
                    handlers[handlerName] = [];
                }
                if (fn) {
                    handlers[handlerName].push(fn);
                }
                return function () {
                    var handlerArgs = arguments;
                    angular.forEach(handlers[handlerName], function (handler) {
                        handler.apply(this, handlerArgs);
                    }, this);
                };
            },

            init = function () {
                angular.forEach(vendorHandlers, function (handlerName) {
                    provider[handlerName] = function (fn) {
                        api[handlerName] = updateHandlers(handlerName, fn);
                        angular.forEach(api[handlerName], function (args) {
                            fn.apply(this, args);
                        });
                    };
                    api[handlerName] = updateHandlers(handlerName);
                });
            };

        init();

        return provider;
    }).run(['$rootScope', '$location', '$analytics', '$injector', function ($rootScope, $location, $analytics, $injector) {
        var sendBeacon = true;

        //Setup key and domain for GAQ
        $analytics.setupAccount($analytics.accountInfo);

        if ($injector.has('$route')) {
            if ($injector.get('$route') && Object.keys($injector.get('$route').routes).length) {
                sendBeacon = false;
            }
        } else if ($injector.has('$state') && Object.keys($injector.get('$state').get()).length) {
            sendBeacon = false;
        }

        if (sendBeacon) {
            $analytics.sendPageView($location.url());
        }

        if ($injector.has('$route')) {
            $rootScope.$on('$routeChangeSuccess', function (event, current) {
                if (current && (current.$$route || current).redirectTo) {
                    return;
                }
                $analytics.sendPageView($location.url());
            });
        }
        if ($injector.has('$state')) {
            $rootScope.$on('$stateChangeSuccess', function () {
                $analytics.sendPageView($location.url());
            });
        }
    }]);
})(angular);
