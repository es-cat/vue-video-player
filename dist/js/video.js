var md = new MobileDetect(window.navigator.userAgent);
var isMobile = md.phone() != null || md.tablet() != null ;
var isVideoInit = false;


var initVideo = new (function(){
    var _this = this;

    _this.bindEvent = function(){
        var dialog = $('#video');
        var dPlayerA = $('#playerA');
        var dPlayerB = $('#playerB');

        function resizeVideo(player) {
            var playerW = $('.video__wrap').width();
            var playerH = $('.video__wrap').height();
            player.setSize(playerW, playerH);
        };

        function binResize(){
            $( window ).resize(function() {
                resizeVideo(playerA);
                resizeVideo(playerB);
            }); 
        };
        
        function bindA(e) {
            $('body,html').css('overflow', 'hidden');

            dialog.fadeIn(1000, function() {
                var playerW = $('.video__wrap').width();
                var playerH = $('.video__wrap').height();
                playerA.setSize(playerW, playerH);
                binResize();
                dPlayerA.show();
                dPlayerB.hide();
            });

            if (!isMobile && playerA && playerA.playVideo) {
                playerA.playVideo();
            }
        };

        function bindB(e) {
           
            $('body,html').css('overflow','hidden');
            
            dialog.fadeIn(1000,function(){
                var playerW = $('.video__wrap').width();
                var playerH = $('.video__wrap').height();
                playerB.setSize(playerW, playerH);
                binResize();
                dPlayerB.show();
                dPlayerA.hide();
            });

            if (!isMobile && playerB && playerB.playVideo) {
                playerB.playVideo();
            }
        }

        $('.js-playerBtnA').on('click',bindA);
        $('.js-playerBtnB').on('click',bindB);
    };

    _this.init = function(callback){
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        //pc
        window.onYouTubeIframeAPIReady = function() {
            window.playerA = new YT.Player('playerA', {
                height: '220',
                width: '220',
                videoId: 'iYccCsaBV-U',
                // playerVars: {
                //     controls: 0,
                //     disablekb: 1
                // },
                playerVars: {
                    rel: 0
                },
                events: {
                    'onReady': onPlayerReady
                }
            });

            window.playerB = new YT.Player('playerB', {
                height: '0',
                width: '0',
                videoId: 'ih0aMjasNAs',
                playerVars: {
                    rel: 0
                },
                events: {
                    'onReady': onPlayerReady
                }
            });
        };


        window.onPlayerReady = function(event) {

            // if(isVideoInit){
            //     return;
            // }
            // isVideoInit = true;

            // console.log('onPlayerReady');

            var dialog = $('#video');
            var dPlayerA = $('#playerA');
            var dPlayerB = $('#playerB');

            dPlayerA.hide();
            dPlayerB.hide();


            _this.bindEvent();  

            $('.js-closeVideo').on('click',function(e) {
                dialog.hide();
                dPlayerA.hide();
                dPlayerB.hide();
                if(playerA) {playerA.stopVideo();} 
                if(playerB) {playerB.stopVideo();} 
                $(document).unbind('resize', window);
                isOpen = false;
                $('body,html').css('overflow','');    
            });
            _this.inited = true;
            if(callback) {
                callback();
            }
        };
    };

    _this.close = function(){
        $('.js-closeVideo').trigger('click');
    };

    // _this.playVideo = function(playerName){
    //      _this.bindEvent();  
    //     //var dPlayerA = $('#playerA');
    //     //var dPlayerB = $('#playerB');
    //     //(playerName=='A')? playerA.playVideo(): playerB.playVideo();
    // };

})();




