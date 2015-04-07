# Features #
##Generic features##

###Configure angular-analytics on your App###
Define your dependency on your app
- angularAnalytics.base (required)
- angularAnalytics.gaq (optional)
- angularAnalytics.gtm (optional)


    angular
    .module('angularAnalyticsApp', [
        'ngResource',
        'ngRoute',
        'angularAnalytics.base',
        'angularAnalytics.gaq',
        //'angularAnalytics.gtm',
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

        $analyticsProvider.setupAccount('UA-XXXXXXXX-1', 'none');
        $analyticsProvider.setAdditionalParameters($analyticsconfig);
    }]);
    
###Pageview according to product : country : device : page ###
```
$analyticsProvider.setupAccount('UA-XXXXXXXX-1', 'none');
```

```
$analyticsProvider.setAdditionalParameters({
        "product": "angularAnalytics",
        "country": "pt"
    });
```

The device will be determined using
```
window.device.platform
```
and as a default it will be mobile.

If the Url is **http://0.0.0.0:90000/#!/home/register**
We are going to get this

**angularAnalytics : pt : mobile : home : register**

###Track Events###
At this moment the developer can trigger a beacon using any event ("click", "mouseout"...") and add the parameters needed.

```
<button analytics-bind="click" analytics-category="category" analytics-label="label" analytics-value="1" analytics-noninteraction="false">
        Send Event on click
</button>
```

- **analytics-bind** - the event that we want to listen
- **analytics-category** - Category
- **analytics-label** - Label
- **analytics-noninteraction** - NonInteraction

    
###Send custom var###

```
<button analytics-bind="click" analytics-category="category" analytics-label="label" analytics-value="1"
            analytics-custom-test="1|value|3">
        Send Event on click with custom var
</button>
```

- **analytics-custom-'nameofcustomvar'** - the params are **slot | value | scope**

###Track according to a condition###
```
<button analytics-bind="click" analytics-if="1===2" analytics-category="category" analytics-label="label" analytics-value="1">
        Don't send event - has condition "1==2"
</button>
```

###Populate object based on a function on the scope###
If we have some logic that we don't want to make on the view, we could use a function on the scope, that has to return this object:

    {
     eventProperties: {...},
     customProperties: {...}
    }
        


```
<button analytics-bind="click" analytics-function="test">
        Send Event on click using function on scope
</button>
```


###Send events from the controller###
Just inject the **$analytics** dependency and these methods

    angular.module('angularAnalyticsApp').controller('MainCtrl', function ($scope, $analytics) {        
        $analytics.sendPageView('MyAwesomeUrl');
    });    


##Google Analytics##
- The app needs to setup the accountID and Additional values for Pageview

##Google Tag Manager##
- The app needs to add the Additional values for Pageview
- Custom variables are not yet implemented
- Tracked events are: _trackPageview and _trackEvent


# Checkout and run #

    $ git clone https://yconoclast@bitbucket.org/mindera/angular-analytics.git

    $ npm install

    $ bower install

    $ grunt build

    $ grunt serve