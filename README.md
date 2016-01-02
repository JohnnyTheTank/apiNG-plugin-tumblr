[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

**_apiNG-plugin-tumblr_** is a [Tumblr API](https://www.tumblr.com/docs/en/api/v2) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

# Information
* **Supported apiNG models: `social`, `image`, `video`**
* Used promise library: [angular-tumblr-api-factory](https://github.com/JohnnyTheTank/angular-tumblr-api-factory) _(included in minified distribution file)_

# Documentation
    I.   INSTALLATION
    II.  API KEY
    III. USAGE

## I. INSTALLATION
    a) Get files
    b) Include files
    c) Add dependencies
    d) Add the plugin

### a) Get files
You can choose your preferred method of installation:

* Via bower: `bower install apiNG-plugin-tumblr --save`
* Download from github: [apiNG-plugin-tumblr.zip](https://github.com/JohnnyTheTank/apiNG-plugin-tumblr/zipball/master)

### b) Include files
Include `aping-plugin-tumblr.min.js` in your apiNG application
```html
<script src="bower_components/apiNG-plugin-tumblr/dist/aping-plugin-tumblr.min.js"></script>
```

### c) Add dependencies
Add the module `jtt_aping_tumblr` as a dependency to your app module:
```js
var app = angular.module('app', ['jtt_aping', 'jtt_aping_tumblr']);
```

### d) Add the plugin
Add the plugin's directive `aping-tumblr="[]"` to your apiNG directive and configure your requests (_**III. USAGE**_)
```html
<aping
    template-url="templates/social.html"
    model="social"
    items="20"
    aping-tumblr="[{'page':'camaradakalderra'}]">
</aping>
```

## II. API KEY
    a) Generate your `api_key`
    b) Insert your `api_key` into `aping-config.js`

### a) Generate your `api_key`
_coming soon ..._

### b) Insert your `api_key` into `aping-config.js`
Open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
apingApp.config(['$provide', function ($provide) {
    $provide.constant("apingApiKeys", {
        //...
        'tumblr': [
            {'api_key':'<YOUR_TUMBLR_API_KEY>'},
        ]
        //...
    });

    $provide.constant("apingDefaultSettings", {
        //...
    });
}]);
```

:warning: Replace `<YOUR_TUMBLR_API_KEY>` with your `api_key`

## III. USAGE
    a) Models
    b) Requests

### a) Models
Supported apiNG models

|  model   | content | support | max items<br>per request | (native) default items<br>per request |
|----------|---------|---------|--------|---------|
| `social` | **text, links, images, videos, audio** | full    | `20`   | `20`   |
| `video`  | **videos** | full    | `20`   | `20`   |
| `image`  | **images** | full    | `20`   | `20`   |

**support:**
* full: _the source platform provides a full list with usable results_
* partly: _the source platfrom provides just partly usable results_


### b) Requests
Every **apiNG plugin** expects an array of **requests** as html attribute.

#### Requests by Page
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`page`** | `camaradakalderra` |  | The standard or custom blog hostname  | no |
| **`items`**  | `15` | `20` | Items per request (`0`-`20`) |  yes  |
| **`tag`** | `soccer` |  | Limits the response to posts with the specified tag | yes |

Sample requests:
* `[{'page':'namikamusik'}]`
* `[{'page':'camaradakalderra', 'tag':'soccer', 'items':14}]`

# Licence
MIT

