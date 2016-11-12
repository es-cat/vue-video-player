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

    Vue.filter('formatVideoTime', function(time) {
        return (new Date).clearTime().addSeconds(time).toString('H:mm:ss');
    });

    var Video = Vue.component('videoComponent', {
        template: '#video-component',
        props: {
            playing: {
                type: Boolean
            },
            seekTo: {
                type: Number
            },
            volume: {
                type: Number
            },
            muted: {
                type: Boolean
            }
        },
        data: function() {
            return {
                video: [],
                loadstartDefs: [$.Deferred(), $.Deferred()],
                canplayDefs: [$.Deferred(), $.Deferred()],
                playingDefs: [$.Deferred(), $.Deferred()],
                seekingDefs: [$.Deferred(), $.Deferred()],
                seekedDefs: [$.Deferred(), $.Deferred()],
                pauseDefs: [$.Deferred(), $.Deferred()],
                endedDefs: [$.Deferred(), $.Deferred()],
                currentTime: 0,
                duration: 0
            }
        },
        computed: {},
        watch: {
            playing: function(nextState) {

                var _this = this;
                var videoA = _this.$refs.videoA;
                var videoB = _this.$refs.videoB;


                if (nextState) {
                    videoA.play();
                    videoB.play();
                } else {
                    videoA.pause();
                    videoB.pause();
                }

            },
            seekTo: function(newValue) {
                var _this = this;
                var videoA = _this.$refs.videoA;
                var videoB = _this.$refs.videoB;

                videoA.currentTime = newValue;
                videoB.currentTime = newValue;
            },
            muted: function(newValue) {
                var _this = this;
                var videoA = _this.$refs.videoA;
                var videoB = _this.$refs.videoB;

                videoA.muted = newValue;
                videoB.muted = newValue;
            },
            volume: function(newValue) {
                // console.log(newValue);
                this.$refs.videoA.volume = newValue;
                this.$refs.videoB.volume = newValue;
            }
        },
        methods: {
            canplay: function(e, def) {
                if (def !== undefined) {
                    def.resolve(e);
                }
            },
            timeupdate: function(e, def) {
                var _this = this;

                //時間差太多就對齊時間
                if (_this.$refs.videoA.currentTime - _this.$refs.videoB.currentTime > 0.1) {
                    _this.$refs.videoA.currentTime = _this.$refs.videoB.currentTime;
                }

                _this.currentTime = _this.$refs.videoA.currentTime;
                _this.$emit('timeupdate', _this.currentTime);
            },
            pause: function(e, def) {
                if (def !== undefined) {
                    def.resolve(e);
                }
            },
            seeking: function(e, def) {
                if (def !== undefined) {
                    def.resolve(e);
                }
            },
            seeked: function(e, def) {
                if (def !== undefined) {
                    def.resolve(e);
                }
            },
            loadstart: function(e, def) {
                if (def !== undefined) {
                    def.resolve(e);
                }
            },
            ended: function(e, def) {
                var _this = this;
                if (def !== undefined) {
                    def.resolve(e);
                }
                _this.$refs.videoA.pause();
                _this.$refs.videoB.pause();


                _this.$refs.videoA.currentTime = 0;
                _this.$refs.videoB.currentTime = 0;

                //防呆，為避免有影片的長短不一致，一豆有影片播放完，便當完成播放
                _this.$emit('ended');

            }
        },
        created: function() {

            var _this = this;
            $.when(_this.loadstartDefs[0], _this.loadstartDefs[1]).done(function(task1, task2) {
                _this.$emit('loadstart', task1, task2);
            });

            //同步讀取開始
            $.when(_this.canplayDefs[0], _this.canplayDefs[1]).done(function(event1, event2) {
                //防呆：為避免影片長度不一致，選擇短的那個當作播放長度
                _this.duration = Math.min(_this.$refs.videoA.duration, _this.$refs.videoB.duration);
                _this.$emit('canplay', _this.duration);
            });

            //同步暫停
            $.when(_this.pauseDefs[0], _this.pauseDefs[1]).done(function(task1, task2) {
                _this.$emit('pause', task1, task2);
            });

            //同步播完：暫時沒用到，也許可以設定prop來決定要不要強制同步
            // $.when(_this.endedDefs[0], _this.endedDefs[1]).done(function(task1, task2) {
            //     _this.$emit('ended',task1, task2);
            // });

            //同步緩存

            //同步seeking
            $.when(_this.seekingDefs[0], _this.seekingDefs[1]).done(function(task1, task2) {
                _this.$emit('seeking', task1, task2);
            });
            //同步seeked
            $.when(_this.seekedDefs[0], _this.seekedDefs[1]).done(function(task1, task2) {
                _this.$emit('seeked', task1, task2);
            });

        }
    });

    var app = new Vue({
        el: '#app',
        mixins: [mixin],
        data: {
            playing: false,
            isDrag: false,
            isLoading: false,
            isSeeking: false,
            isMuted: false,
            volume: 0.8,
            currentTime: 0,
            duration: 0,
            seekDisplayTime: 0,
            seekTo: 0,
            dragX: 0,
            videod: {},
            sliderBar: {},
            progress: 0
        },
        computed: {
            playBtnText: function() {
                return !this.playing ? '播放' : '暫停';
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
            mutedDisplay: function() {
                return this.isMuted ? 'off' : 'on';
            }
        },
        watch: {
            volume: function(newValue) {
                if (newValue <= 0) {
                    this.isMuted = true;
                } else {
                    this.isMuted = false;
                }
            }
        },
        methods: {
            formatTime: function(time) {
                return (new Date).clearTime().addSeconds(time).toString('H:mm:ss');
            },
            loadstart: function(time) {
                this.isLoading = true;

            },
            canplay: function() {
                this.playing = true;
                this.isLoading = false;
                this.duration = this.$refs.video.duration;
            },
            pause: function() {
                this.playing = false;
            },
            seeking: function() {
                this.isSeeking = true;
            },
            seeked: function(a, b) {
                this.isDrag = false;
                this.isSeeking = false;
            },
            ended: function(a, b) {
                this.playing = false;
            },
            muted: function(e) {
                var _this = this;
                this.isMuted = !this.isMuted;
            },
            tooglePlay: function(e) {
                e.preventDefault();
                this.playing = !this.playing;
            },
            timeupdate: function(time) {
                // console.log(time);
                this.currentTime = time;
            },
            startDrag: function(e) {
                var _this = this;
                _this.isDrag = true;
                if (_this.isDrag) {
                    _this.dragX = e.offsetX;
                    _this.seekDisplayTime = _this.computedDragOffsetX / 100 * _this.duration;

                }
            },
            onDrag: function(e) {
                e.preventDefault();
                var _this = this;
                if (_this.isDrag) {
                    _this.dragX = e.offsetX;
                    _this.seekDisplayTime = _this.computedDragOffsetX / 100 * _this.duration;
                }
            },
            stopDrag: function(e) {
                var _this = this;
                e.preventDefault();
                _this.isDrag = false;
                _this.seekTo = _this.seekDisplayTime;
            }
        },
        mounted: function() {
            var _this = this;
        }
    })
