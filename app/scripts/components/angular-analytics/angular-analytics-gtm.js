(function (angular) {
    'use strict';

    angular.module('angularAnalytics.gtm', ['angularAnalytics.base'])
        .config(['$analyticsProvider', function ($analyticsProvider) {
            $analyticsProvider.setupAccount(function(){
                window.dataLayer = window.dataLayer || [];
            });

            $analyticsProvider.sendPageView(function (url) {
                dataLayer.push({
                    'event': '_trackPageview',
                    'content-name': this.formatUrl(url)
                });
            });

            $analyticsProvider.sendEvent(function (eventProperties, customProperties) {
                if (!eventProperties || Object.keys(eventProperties).length === 0 || !eventProperties.action || !eventProperties.category) {
                    return;
                }

                var eventCategory = eventProperties.category,
                    eventAction = eventProperties.action,
                    eventLabel = eventProperties.label || null,
                    eventValue = this.parseValue(eventProperties.value),
                    nonInteraction = eventProperties.noninteraction || null;

                dataLayer.push({
                    'event': '_trackEvent',
                    'target': eventCategory,
                    'action': eventAction,
                    'target-properties': eventLabel,
                    'value': eventValue,
                    'interaction-type': nonInteraction
                });
            });

            $analyticsProvider.sendCustomVar(function () {
            });
        }]);
})(angular);