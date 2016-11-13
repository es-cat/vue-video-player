var app = {};

//全域事件的中繼器詳情可參考
//https://vuejs.org/v2/guide/migration.html#dispatch-and-broadcast-replaced
var eventHub = new Vue(); 
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

var fakeDatas = {
    feedbacks: [{
        name: 'lala1',
        photo: 'https://dummyimage.com/400x400/000/fff',
        logTime: 50,
        content: "使用者不太開心1"
    }, {
        name: 'lala2',
        photo: 'https://dummyimage.com/400x400/000/fff',
        logTime: 8,
        content: "使用者不太開心2"
    }, {
        name: 'lala3',
        photo: 'https://dummyimage.com/400x400/000/fff',
        logTime: 15,
        content: "使用者不太開心3"
    }, {
        name: 'lala4',
        photo: 'https://dummyimage.com/400x400/000/fff',
        logTime: 20,
        content: "使用者不太開心4"
    }, {
        name: 'lala5',
        photo: 'https://dummyimage.com/400x400/000/fff',
        logTime: 20,
        content: "使用者不太開心4"
    }]
};




Vue.filter('formatVideoTime', function(time) {
    return (new Date).clearTime().addSeconds(time).toString('H:mm:ss');
});

Vue.component('videoComponent', {
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

Vue.component('feedbackDisplayComponent', {
    template: '#feedback-display-component',
    props: {
        feedbacks: {},
        currentTime: {},
        showType: {}
    },
    data: function() {
        return {
            indexDatas: {},
            timmer: 0
        };
    },
    methods: {
        putData: function(obj) {
            var _this = this;
            var indexDatas = _this.indexDatas;
            //因為需要排序，只好把時間四捨五入
            var index = Math.floor(obj.logTime);

            if (indexDatas[index]) {
                indexDatas[index].push(obj);
            } else {
                Vue.set(indexDatas, index, [])
                indexDatas[index].push(obj);
            }
        },
        saveComment: function (newValue) {
            console.log('save a  comment');
            console.log(newValue);
            this.putData(newValue);
            console.log(this.indexDatas);

        }
    },
    created: function() {
        var _this = this;
        var indexDatas = _this.indexDatas;

        //如果一個時間有多個log，這裡先保留了這種可能性，以時間為key建立資料結構，並使用陣列儲存log
        $(_this.feedbacks).each(function(index, item) {
            _this.putData(item);
        });

        //偵測儲存事件
        eventHub.$on('saveComment', _this.saveComment);
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
        feedbacks: fakeDatas.feedbacks,
        feedback: {
            name: 'lala',
            photo: 'https://dummyimage.com/400x400/000/fff',
            logTime: 0,
            content: ""
        }
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
        },
        saveComment: function(e) {
            e.preventDefault();

            var _this = this;
            var comment = $.extend({}, _this.feedback);
            //模擬save
            setTimeout(function() {
                _this.feedbacks.push(comment);
                _this.feedback.content = "";
                eventHub.$emit('saveComment', comment);

            }, 1000);



        },
        feedbackFocus: function(e) {
            this.playing = false;
            this.feedback.logTime = this.currentTime;

        },
        feedbackBlur: function(e) {
            this.playing = true;
        }
    },
    created: function() {
        //這裡可以初始化使用者名稱
    },
    mounted: function() {
        var _this = this;

    }
})
