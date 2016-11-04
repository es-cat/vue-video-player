(function ($) {
    $.fn.oldBrowserAlert = function (opts) {
        var md = new MobileDetect(window.navigator.userAgent);
        var config = $.extend({}, {
            ie8: '您用的瀏覽器過舊，可能無法正常瀏覽頁面，若想要得到完整體驗，請改用新版瀏覽器(IE10以上、Firefox、Chrome)瀏覽。',
            iosChrome: '建議使用Safari檢視，以獲得完整的體驗。',
            onIosAppBroser: '建議使用Safari檢視，以獲得完整的體驗。',
            onAndroidAppBroser: '建議使用Chrome檢視，以獲得完整的體驗。'
        }, opts);

        var navU = navigator.userAgent;

        // Android Mobile
        var isAndroidMobile = navU.indexOf('Android') > -1 && navU.indexOf('Mozilla/5.0') > -1 && navU.indexOf('AppleWebKit') > -1;

        // Apple webkit
        var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
        var resultAppleWebKitRegEx = regExAppleWebKit.exec(navU);
        var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navU)[1]));

        // Chrome
        var regExChrome = new RegExp(/Chrome\/([\d.]+)/);
        var resultChromeRegEx = regExChrome.exec(navU);
        var chromeVersion = (resultChromeRegEx === null ? null : parseFloat(regExChrome.exec(navU)[1]));

        // Native Android Browser
        var isAndroidBrowser = isAndroidMobile && (appleWebKitVersion !== null && appleWebKitVersion < 537) || (chromeVersion !== null && chromeVersion < 37);

        //webview ios
        var is_uiwebview = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

        var coki = new function () {
            this.create = function (name, value, days) {
                if (days) {
                    var date = new Date();
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    var expires = "; expires=" + date.toGMTString();
                }
                else var expires = "";
                document.cookie = name + "=" + value + expires + "; path=/";
            };

            this.read = function (name) {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                }
                return null;
            };

            this.erase = function (name) {
                createCookie(name, "", -1);
            };
            return this;
        };

               // if (navigator.userAgent.indexOf('MSIE 8.0') > 0 && !FDO.common.cookieRead("alert")) {
               //     if (typeof config.ie8 == 'string') {
               //         alert(config.ie8);
               //     }
               //     else if (typeof config.ie8 == 'function') {
               //         config.ie8();
               //     }
               //     FDO.common.cookieCreate("alert", true, 1);
               // }
               // if (navigator.userAgent.match('CriOS') && !FDO.common.cookieRead("alert")) {
               //     if (typeof config.iosChrome == 'string') {
               //         alert(config.iosChrome);
               //     }
               //     else if (typeof config.iosChrome == 'function') {
               //         config.iosChrome();
               //     }
               //     FDO.common.cookieCreate("alert", true, 1);
               // }


        if ((/FBAV/i.test(navigator.userAgent) || navigator.userAgent.toLowerCase().indexOf('line') != -1 ) || navigator.userAgent.match('CriOS')) { // && !FDO.common.cookieRead("alert") //alert everytime
            if (md.os() == "AndroidOS") {
                alert('建議使用Chorme瀏覽器開啟，獲得更好的網頁體驗');
            }
            if (md.os() == "iOS") {
                alert('建議使用Safari瀏覽器開啟，獲得更好的網頁體驗');
            }
        }

        return this;
    };
})($);

