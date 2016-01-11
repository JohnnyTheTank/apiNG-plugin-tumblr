"use strict";
apingApp.config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            //...
            tumblr: [
                //{'api_key':'<YOUR_TUMBLR_API_KEY>'},
                {'api_key':'lINWJaOl0lu3ajBn5tdqJgs8IFisHu5GJ8hBYzR41f4BHEl9E6'},
            ],
            //...
        }
    });
}]);