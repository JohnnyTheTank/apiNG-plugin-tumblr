"use strict";

angular.module("jtt_aping_tumblr", ['jtt_tumblr'])
    .directive('apingTumblr', ['apingTumblrHelper', 'apingUtilityHelper', 'tumblrFactory', function (apingTumblrHelper, apingUtilityHelper, tumblrFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingTumblr, apingTumblrHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };
                    if(typeof appSettings.getNativeData !== "undefined") {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        api_key: apingUtilityHelper.getApiCredentials(apingTumblrHelper.getThisPlatformString(), "api_key"),
                        filter:"text",

                    };

                    if(typeof request.items !== "undefined") {
                        requestObject.limit = request.items;
                    } else {
                        requestObject.limit = appSettings.items;
                    }

                    if(requestObject.limit == 0) {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if(requestObject.limit < 0 || isNaN(requestObject.limit)) {
                        requestObject.limit = undefined;
                    }

                    // the api has a limit of 20 items per request
                    if(requestObject.limit > 20) {
                        requestObject.limit = 20;
                    }

                    if (requestObject.limit === 0 || requestObject.limit === '0') {
                        return false;
                    }

                    if(typeof request.tag !== "undefined") {
                        requestObject.tag = request.tag;
                    }

                    if(request.page) {

                        requestObject.page = request.page;

                        switch(appSettings.model) {
                            case "image":
                                requestObject.type = "photo";
                                break;

                            case "video":
                                requestObject.type = "video";
                                break;

                            case "social":
                                break;

                            default:
                                return false;
                        }

                        tumblrFactory.getPostsFromPage(requestObject)
                            .then(function (_data) {
                                if (_data) {
                                    apingController.concatToResults(apingTumblrHelper.getObjectByJsonData(_data, helperObject));
                                }
                            });
                    }
                });
            }
        }
    }]);