var FS = require('fs'),
    PATH = require('path');

exports.mkdirs = function(path) {
    var dirs = PATH.normalize(path).split('/'),
        dir = '';

    for (var i = 1; i < dirs.length; i++) {
        dir += '/' + dirs[i];

        if (!PATH.existsSync(dir)) {
            FS.mkdirSync(dir);
        }
    }
}