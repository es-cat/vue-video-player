    var mixin = {
        created: function() {

        },
        data: function() {
            return {}
        },
        methods: {},
        mounted: function() {

        }
    };

    


    var app = new Vue({
        el: '#app',
        mixins: [mixin],
        data: {
            isPlaying: false,
            isDrag: false,
            isCanPlay: false,
            isLoading: false,
            isSeeking: false,
            isMuted: false,
            currentTime: 0,
            duration: 0,
            dragX: 0,
            videod: {},
            sliderBar: {},
            volume: 80,
            progress: 0
        },
        computed: {
            UIplayBtn: function() {
                return this.isPlaying ? '播放' : '暫停';
            },
            computedTimeline: function() {
                return this.currentTime / this.duration * 100;
            },
            computedDragOffsetX: function() {
                var _this = this;
                var sliderr = _this.$refs.sliderBar;
                var maxOffestX = _this.$refs.timelineBar ? _this.$refs.timelineBar.offsetWidth : 0;
                return Math.max(Math.min(_this.dragX, maxOffestX), 0) / maxOffestX * 100;
            },
            formatSeekTime: function() {
                var _this = this;
                var time = _this.computedDragOffsetX / 100 * _this.duration;

                return _this.formatTime(time);
            },
            formatCurrentTime: function() {
                return this.formatTime(this.currentTime);
            },
            formatDurationTime: function() {
                return this.formatTime(this.duration);
            }
        },
        watch: {
            volume: function(val) {
                var _this = this;
                var video = _this.video;
                video.volume = val / 100;
                if (val <= 0) {
                    video.muted = true;
                } else {
                    video.muted = false;
                }
                _this.isMuted = video.muted;
            },
            isLoading: function(val) {

            }
        },
        methods: {
            formatTime: function(time) {
                return (new Date).clearTime().addSeconds(time).toString('H:mm:ss');
            },
            syncStatus: function() {
                var _this = this;
                var video = _this.video;

                _this.isPlaying = video.paused;

            },
            timeupdate: function() {
                var _this = this;
                var video = _this.video;

                _this.currentTime = video.currentTime;
            },
            play: function(e) {
                e.preventDefault();
                var _this = this;
                var video = _this.video;
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                _this.syncStatus();
            },
            muted: function(e) {
                var _this = this;
                var video = _this.video;

                if (video.muted) {
                    video.muted = false;
                } else {
                    video.muted = true;
                }

                _this.isMuted = video.muted;

            },
            loadstart: function(e) {
                var _this = this;
                console.log(e);
                _this.isLoading = true;
            },
            canplay: function(e) {
                var _this = this;
                var video = _this.video;

                _this.isLoading = false;
                _this.duration = video.duration;

            },
            seeking: function(e) {
                var _this = this;
                _this.isSeeking = true;

            },
            seeked: function(e) {
                var _this = this;
                _this.isSeeking = false;
            },
            seekTo: function(seekTime, callback) {
                var _this = this;
                _this.video.currentTime = seekTime;

                _this.video.addEventListener('seeked', function() {
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                });
            },
            startDrag: function(e) {
                var _this = this;
                _this.isDrag = true;
                _this.dragX = e.offsetX;

            },
            onDrag: function(e) {
                e.preventDefault();
                var _this = this;
                if (_this.isDrag) {
                    _this.dragX = e.offsetX;
                }

            },
            stopDrag: function(e) {
                e.preventDefault();
                var _this = this;
                var seekTime = _this.computedDragOffsetX / 100 * _this.duration;
                if (_this.isDrag) {
                    _this.dragX = e.offsetX;

                    _this.seekTo(seekTime, function() {
                        _this.isDrag = false;
                    });
                }
            }
        },
        mounted: function() {
            var _this = this;
            _this.video = _this.$refs.video;

            // _this.video2 = _this.$refs.video2;


            // var def1 = $.Deferred();
            // var def2 = $.Deferred();

            // $.when(def1, def2).done(function(a,b) {
            //     console.log('Everything playing');
            //     console.log(a);
            //     console.log(b);

            // });


            // $(_this.video).on('playing', function(e) {
            //     // deferred completed ASAP
            //     if (def1 !== undefined) {
            //         def1.resolve(e);
            //     }
            // });

            // $(_this.video2).on('playing',function(e) {
            //     // deferred completed ASAP
            //     if (def2 !== undefined) {
            //         def2.resolve(e);
            //     }
            // });

        }

    })
