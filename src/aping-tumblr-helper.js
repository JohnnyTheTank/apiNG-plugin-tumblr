"use strict";

angular.module("jtt_aping_tumblr")
    .service('apingTumblrHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return "tumblr";
        };

        this.getThisBlogLink = function (_page) {
            return "http://" + _page + ".tumblr.com/";
        };

        /**
         * returns the difference between two integers
         *
         * @param _int1 {number}
         * @param _int2 {number}
         * @returns {number}
         */
        this.getDifference = function (_int1, _int2) {
            if (_int1 > _int2) {
                return _int1 - _int2;
            } else {
                return _int2 - _int1;
            }
        };

        /**
         * returns an object with images urls and dimensions
         *
         * @param _array {Array}
         * @returns {Object}
         */
        this.getImagesFromImageArray = function (_array) {

            var that = this;

            var returnObject = {
                thumb_url: undefined,
                thumb_width: undefined, // best case 200px (min)
                thumb_height: undefined,
                img_url: undefined,
                img_width: undefined, // best case 700px
                img_height: undefined,
                native_url: undefined,
                native_width: undefined,
                native_height: undefined,
            };

            if (_array.constructor === Array) {
                angular.forEach(_array, function (value, key) {
                    if (typeof value.url !== "undefined") {
                        if (typeof returnObject.thumb_url === "undefined") {
                            returnObject.thumb_url = value.url;
                            returnObject.thumb_width = value.width;
                            returnObject.thumb_height = value.height;
                        } else {
                            if (
                                that.getDifference(returnObject.thumb_width, 200) > that.getDifference(value.width, 200)
                                &&
                                value.width >= 200
                            ) {
                                returnObject.thumb_url = value.url;
                                returnObject.thumb_width = value.width;
                                returnObject.thumb_height = value.height;
                            }
                        }

                        if (typeof returnObject.img_url === "undefined") {
                            returnObject.img_url = value.url;
                            returnObject.img_width = value.width;
                            returnObject.img_height = value.height;
                        } else {
                            if (
                                that.getDifference(returnObject.img_width, 700) > that.getDifference(value.width, 700)
                            ) {
                                returnObject.img_url = value.url;
                                returnObject.img_width = value.width;
                                returnObject.img_height = value.height;
                            }
                        }

                        if (typeof returnObject.native_url === "undefined") {
                            returnObject.native_url = value.url;
                            returnObject.native_width = value.width;
                            returnObject.native_height = value.height;
                        } else {
                            if (
                                value.width > returnObject.native_width
                            ) {
                                returnObject.native_url = value.url;
                                returnObject.native_width = value.width;
                                returnObject.native_height = value.height;
                            }
                        }
                    }
                });
            }

            return returnObject;
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data && _data.data && _data.data.response) {
                var _this = this;

                if (_data.data.response.posts) {

                    angular.forEach(_data.data.response.posts, function (value, key) {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = value;
                        } else {
                            tempResult = _this.getItemByJsonData(value, _helperObject.model);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                }

            }
            return requestResults;
        };

        this.getItemByJsonData = function (_item, _model) {
            var returnObject = {};
            if (_item && _model) {
                switch (_model) {
                    case "social":
                        returnObject = this.getSocialItemByJsonData(_item);
                        break;
                    case "video":
                        returnObject = this.getVideoItemByJsonData(_item);
                        break;
                    case "image":
                        returnObject = this.getImageItemByJsonData(_item);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getSocialItemByJsonData = function (_item) {
            var socialObject = apingModels.getNew("social", this.getThisPlatformString());

            //fill _item in socialObject
            angular.extend(socialObject, {
                blog_name: _item.blog_name || undefined,
                blog_link: _item.blog_name ? this.getThisBlogLink(_item.blog_name) : undefined,
                type: _item.type || undefined,
                timestamp: _item.timestamp ? _item.timestamp * 1000 : undefined,
                post_url: _item.short_url || undefined,
                intern_id: _item.id || undefined,
            });

            switch (_item.type) {
                case "photo":
                    socialObject.text = _item.caption || undefined;
                    if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                        socialObject.source = _item.photos;

                        if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                            socialObject.source = _item.photos;

                            var tempImageArray = this.getImagesFromImageArray(_item.photos[0].alt_sizes);
                            angular.extend(socialObject, tempImageArray);
                        }
                    }
                    break;

                case "link":
                    socialObject.text = _item.description || undefined;
                    if (socialObject.text) {
                        socialObject.caption = _item.title || undefined;
                    } else {
                        socialObject.text = _item.title || undefined;
                    }
                    if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                        socialObject.source = _item.photos;

                        if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                            socialObject.source = _item.photos;

                            var tempImageArray = this.getImagesFromImageArray(_item.photos[0].alt_sizes);
                            angular.extend(socialObject, tempImageArray);
                        }
                    }
                    break;

                case "video":
                    console.log(_item);
                    socialObject.text = _item.caption || undefined;
                    if (_item.thumbnail_url) {
                        socialObject.img_url = _item.thumbnail_url;
                        socialObject.thumb_url = _item.thumbnail_url;
                        socialObject.native_url = _item.thumbnail_url;
                    }
                    if (_item.player) {
                        socialObject.source = _item.player;
                    }
                    break;

                case "text":
                    socialObject.text = _item.body || undefined;
                    if (socialObject.text) {
                        socialObject.caption = _item.title || undefined;
                    } else {
                        socialObject.text = _item.title || undefined;
                    }
                    break;

                case "audio":
                    socialObject.text = _item.caption || undefined;
                    if (_item.player) {
                        socialObject.source = _item.player;
                    }
                    break;

                default:
                    return false;
            }

            socialObject.date_time = new Date(socialObject.timestamp);

            return socialObject;
        };

        this.getVideoItemByJsonData = function (_item) {
            var videoObject = apingModels.getNew("video", this.getThisPlatformString());

            //fill _item in videoObject
            angular.extend(videoObject, {
                blog_name: _item.blog_name || undefined,
                blog_link: _item.blog_name ? this.getThisBlogLink(_item.blog_name) : undefined,
                type: _item.type || undefined,
                timestamp: _item.timestamp ? _item.timestamp * 1000 : undefined,
                post_url: _item.short_url || undefined,
                intern_id: _item.id || undefined,
                text: _item.caption || undefined,
                img_url: _item.thumbnail_url || undefined,
                thumb_url: _item.thumbnail_url || undefined,
                native_url: _item.thumbnail_url || undefined,
            });

            angular.forEach(_item.player, function (value, key) {

                if (typeof videoObject.markup === "undefined" || value.width > videoObject.width) {
                    videoObject.markup = value.embed_code;
                    videoObject.width = value.width;
                }
            });

            videoObject.date_time = new Date(videoObject.timestamp);

            return videoObject;
        };

        this.getImageItemByJsonData = function (_item) {
            var imageObject = apingModels.getNew("image", this.getThisPlatformString());

            //fill _item in imageObject
            angular.extend(imageObject, {
                blog_name: _item.blog_name || undefined,
                blog_link: _item.blog_name ? this.getThisBlogLink(_item.blog_name) : undefined,
                type: _item.type || undefined,
                timestamp: _item.timestamp ? _item.timestamp * 1000 : undefined,
                post_url: _item.short_url || undefined,
                intern_id: _item.id || undefined,
            });

            imageObject.text = _item.caption || undefined;
            if (_item.photos && _item.photos[0] && _item.photos[0].alt_sizes && _item.photos[0].alt_sizes.length > 0) {
                imageObject.source = _item.photos;

                var tempImageArray = this.getImagesFromImageArray(_item.photos[0].alt_sizes);
                angular.extend(imageObject, tempImageArray);
            }

            imageObject.date_time = new Date(imageObject.timestamp);

            return imageObject;
        };
    }]);