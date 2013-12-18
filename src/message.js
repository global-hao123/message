/*
 * jQuery sns-share plugin
 * @author yuji@baidu.com
 * @update 2013/10/31
 *
 * TODO:
 * 1. send to @wmf
 */
// window.module = {};

// supports require + window.Hao123




/**
 * message freawork
 * @param  {[type]}   WIN  [description]
 * @param  {[type]}   name [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 *
 * module <-> module
 * iframe <-> module
 * openner -> page
 * page <-> page
 */
!function(WIN, name, fn) {

    typeof define === "function" && typeof module !== "undefined"

    // AMD
    ? module.exports = fn(WIN, {})

    // Native
    : (WIN["Hao123"] || (WIN["Hao123"] = {}))[name] = fn(WIN, {});

}(window, "message", function(WIN, channels, message, undef) {

    var supportPostMessage = "postMessage" in WIN,

        /**
         * simple iterator
         * @param  {[type]}   arr      [description]
         * @param  {Function} callback [description]
         * @return {[type]}            [description]
         */
        each = function(arr, cb) {
            for(var i = 0, l = arr.length; i < l; i++)
            if(cb(arr[i], i, arr)) break;
        },
        trigger = function(data){
            for(
                var prefix = data.slice(data.indexOf("|"))
                    , list = channels
                    , i = 0
                    , fn;
                fn = list[i++];
            ) fn && fn(supportPostMessage ? data.data : data);

            console.log(prefix)
        };

    // init listen
    supportPostMessage
    ? WIN.addEventListener("message", function(data) {
        data = data.data;
        var index = data.indexOf("|")
            , channel = channels[data.slice(0, index)]
            , data = data.slice(index + 1);

        channel && each(channel, function(li) {
            li && li(data);
        });
    }, false)
    : WIN.navigator[prefix + this.name] = trigger;

    // Constractor
    message = function() {
    }


    /**
     * [send description]
     * @param  {[type]} channel [description]
     * @param  {[type]} data    [description]
     * @param  {[Object | Array]} target  default: window.parent
     * @return {[type]}         [description]
     */
    message.send = function(channel, data, target) {
        ({
            "iframe": supportPostMessage ? function() {
                /*!(target = target || WIN.parent).length && (target = [target]);

                each([target], function(li) {
                    li.postMessage(channel + "|" + data, "*"); 
                });*/

                (target || WIN.parent).postMessage(channel + "|" + data, "*");
            } : function() {
                WIN.navigator[channel](data);
            }
            , "module": function() {

                // async callback
                setTimeout(function () {
                    each(channels[channel], function(cb) {
                        cb && cb(data);
                    });
                }, 0);
            }
            , "openner": function() {

            }
            , "page": function() {
                
            }
        })[channel.split(".")[0]]();

        return message;
    }

    message.on = function(channel, callback) {
        ({
            "iframe": function() {
                (channels[channel] || (channels[channel] = [])).push(callback);
            }
            , "module": function() {

                (channels[channel] || (channels[channel] = [])).push(callback);

                // return {channel: channel, callback: callback};
            }
            , "openner": function() {

            }
            , "page": function() {
                
            }
        })[channel.split(".")[0]]();

        return message;
    }

    // off callback or all.
    message.off = function(channel, callback) {
        ({
            "iframe": function() {
                
            }
            , "module": function() {

                if(callback) {
                    each(channels[channel], function(cb) {
                        if(cb === callback) {
                            channels[channel].splice(i, 1);
                            return false;
                        }
                    });
                }
                else channels[channel] = [];
            }
            , "openner": function() {

            }
            , "page": function() {
                
            }
        })[channel.split(".")[0]]();

        return message;
    }

    return message;
});