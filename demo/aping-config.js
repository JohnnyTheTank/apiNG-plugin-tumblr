"use strict";
angular.module('jtt_aping').config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            tumblr: [
                {'api_key':'<YOUR_TUMBLR_API_KEY>'},
            ],
            //...
        }
    });
}]);