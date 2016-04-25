// JavaScript source code

angular.module('App.service', [])

.factory('Feed', function () {
    var yam = window.yam;

    var indexOf = [].indexOf || function (item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

    var _getUsers = function (id, references) {
        var a, fn, i, l, ref;
        a = false;
        fn = function (i) {
            if (id === references[i].id) {
                return a = references[i].full_name;
            }
        };
        for (i = l = 0, ref = references.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
            fn(i);
        }
        return a;
    };
    var _getNumberOfReplies = function (id, references) {
        var a, fn, i, l, ref;
        a = false;
        fn = function (i) {
            if (id === references[i].id && references[i].type === "thread") {
                return a = references[i].stats.updates - 1;
            }
        };
        for (i = l = 0, ref = references.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
            fn(i);
        }
        return a;
    };
    var sortByDate = function (array) {
        var _array = array;

        _array.sort(function (a, b) {
            if (a.parent.created_at < b.parent.created_at) {
                return 1;
            }
            if (a.parent.created_at > b.parent.created_at) {
                return -1;
            }
            return 0;
        });
        return _array;
    };
    var hasParent = function (array, value) {
        var j, l, m, ref, ref1, ret, x;
        ret = false;
        for (j = l = 0, ref = array.length; 0 <= ref ? l < ref : l > ref; j = 0 <= ref ? ++l : --l) {
            if (value === array[j].parent.id) {
                ret = j;
                break;
            } else {
                if (indexOf.call(array[j], 'children') >= 0) {
                    for (x = m = 0, ref1 = array[j].children.length; 0 <= ref1 ? m < ref1 : m > ref1; x = 0 <= ref1 ? ++m : --m) {
                        if (value === array[j].children[x]) {
                            ret = j;
                            break;
                        }
                    }
                }
            }
        }
        return ret;
    };
    var foo = function (_data, data) {
        return new Promise(function (resolve, reject) {
            var count, threated;
            threated = [];
            count = 0;
            data.forEach(function (i) {
                setTimeout(function () {
                    window.yam.platform.request({
                        url: "threads/" + i.thread_id + ".json",
                        type: 'GET',
                        success: function (thread) {
                            var k, parent;
                            threated.push({
                                parent: i,
                                children: [],
                                replies: thread.stats.updates - 1
                            });
                            count++;
                            if (count === data.length) {
                                k = _data.length;
                                while (k--) {
                                    parent = hasParent(threated, _data[k].replied_to_id);
                                    if (parent !== false) {
                                        threated[parent].children.push(_data[k]);
                                        _data.splice(k, 1);
                                    }
                                }
                                resolve(sortByDate(threated));
                            }
                        }
                    });
                }, 2000);
            });
        });
    };

    return {
        getFeed: function () {
            return new Promise(function (resolve, reject) {
                window.yam.platform.request({
                    url: 'messages/my_feed.json?threaded=false&limit=20',
                    type: 'GET',
                    success: function (data) {
                        var _data, fn, i, l, ref;
                        _data = data.messages;
                        fn = function (i) {
                            var author;
                            author = _getUsers(_data[i].sender_id, data.references);
                            if (author !== false) {
                                _data[i].full_name = author;
                            }
                        };
                        for (i = l = 0, ref = _data.length; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
                            fn(i);
                        }
                        window.yam.platform.request({
                            url: 'messages/my_feed.json?threaded=true&limit=4',
                            type: 'GET',
                            success: function (data) {
                                console.log(data);
                                var fn1, m, ref1;
                                fn1 = function (i) {
                                    var author;
                                    author = _getUsers(data.messages[i].sender_id, data.references);
                                    if (author !== false) {
                                        data.messages[i].full_name = author;
                                    }
                                };
                                for (i = m = 0, ref1 = data.messages.length; 0 <= ref1 ? m < ref1 : m > ref1; i = 0 <= ref1 ? ++m : --m) {
                                    fn1(i);
                                }
                                foo(_data, data.messages).then(function (data) {
                                    resolve(data);
                                });
                            }
                        });
                    }
                });
            });
        },
        tmp: function (limit) {
            return new Promise(function (resolve, reject) {
                window.yam.platform.request({
                    url: 'messages/my_feed.json?threaded=true&limit=' + limit,
                    type: 'GET',
                    success: function (data) {
                        var _data = {};
                        _data.data = [];
                        for (var i = 0; i < data.messages.length; i++) {
                            (function (i) {
                                _data.data.push({
                                    sender: _getUsers(data.messages[i].sender_id, data.references),
                                    created_at: data.messages[i].created_at,
                                    body: data.messages[i].body.plain,
                                    id: data.messages[i].id,
                                    likes: data.messages[i].liked_by.count,
                                    replies: _getNumberOfReplies(data.messages[i].id, data.references),
                                    url: data.messages[i].web_url
                                });
                                if (i === (data.messages.length - 1)) {
                                    resolve(_data);
                                }
                            })(i);
                        }
                    }
                });
            });
        },
        hisConnected: function () {
            return new Promise(function (resolve, reject) {
                yam.getLoginStatus(function (response) {
                    if (response.authResponse) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                });
            });
        },
        send: function (id, message, attachments) {
            return new Promise(function (resolve, reject) {
                var data = {
                    url: 'messages.json',
                    data: { body: message, group_id: '6213444', replied_to_id: id },
                    type: 'POST',
                    success: function (msg) {
                        resolve(msg);
                    },
                    error: function (error) {
                        reject(error);
                    }
                };
                if(id === null) {
                    delete data.data.replied_to_id;
                }
                for (var i = 0; i < attachments.length; i++) {
                    data.data['pending_attachment' + (i + 1)] = attachments[i];
                }
                yam.platform.request(data);
            });
        }
    };
});