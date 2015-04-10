/* global _gaq: true */

(function (angular) {
    'use strict';

    angular.module('angularAnalytics.gaq', ['angularAnalytics.base'])
        .config(['$analyticsProvider', function ($analyticsProvider) {
            
            //Define accountId and domain
            $analyticsProvider.setupAccount(function (accountInfo) {
                window._gaq = window._gaq || [];
                
                if (accountInfo.accountId && accountInfo.domainName) {
                    window._gaq.push(['_setAccount', accountInfo.accountId]);
                    window._gaq.push(['_setDomainName', accountInfo.domainName]);
                }
            });

            $analyticsProvider.sendPageView(function (url) {
                _gaq.push(['_trackPageview', this.formatUrl(url)]);
            });

            //Example: _gaq.push(['_trackEvent', '[INSERT CATEGORY]', '[INSERT ACTION]', '[INSERT LABEL]', [INSERT NUMBER], true]);
            $analyticsProvider.sendEvent(function (eventProperties, customProperties) {
                if (!eventProperties || Object.keys(eventProperties).length === 0 || !eventProperties.action || !eventProperties.category) {
                    return;
                }

                var eventCategory = eventProperties.category,
                    eventAction = eventProperties.action,
                    eventLabel = eventProperties.label || null,
                    eventValue = this.parseValue(eventProperties.value),
                    nonInteraction = eventProperties.noninteraction || null;

                //Example: _gaq.push(['_setCustomVar', 1,'User ID', '[INSERT USER ID]', 1]);
                angular.forEach(customProperties, function(property) {
                    if (property && Object.keys(property).length !== 0 && property.slot && property.name && property.value) {
                        var slot = this.parseValue(property.slot),
                            name = property.name,
                            value = property.value,
                            scope = property.scope || 3;  //if blank, default is page	Scope (1=visitor, 2=session, 3=page)

                        _gaq.push(['_setCustomVar', slot, name, value, scope]);
                    }
                }, this);

                _gaq.push(['_trackEvent', eventCategory, eventAction, eventLabel, eventValue, nonInteraction]);
            });

            //Example: _gaq.push(['_setCustomVar', 1,'User ID', '[INSERT USER ID]', 1]);
            $analyticsProvider.sendCustomVar(function (customProperties) {
                if (!customProperties || Object.keys(customProperties).length === 0 || !customProperties.slot || !customProperties.name || !customProperties.value) {
                    return;
                }

                var slot = this.parseValue(customProperties.slot),
                    name = customProperties.name,
                    value = customProperties.value,
                    scope = customProperties.scope || 3;  //if blank, default is page	Scope (1=visitor, 2=session, 3=page)

                _gaq.push(['_setCustomVar', slot, name, value, scope]);
            });
        }]);
})(angular);