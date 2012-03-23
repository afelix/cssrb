var cssp = require('cssp'),
    fs = require('fs');

exports.rebase = function(src, config, move, copy) {
    var patterns = getPatterns(config.patterns),
        ast = cssp.parse(src),
        uris = [],
        uri,
        inPath, outPath;

    collect(ast, uris);

    for (var i = 0; i < uris.length; i++) {
        uri = uris[i];
        inPath = getPath(uri);
        outPath = rename(inPath, patterns);
        if (outPath) {
            setPath(uri, outPath);
            if (copy) {
                fs.writeFileSync(config.toBase + outPath, fs.readFileSync(config.fromBase + inPath));
            } else if (move) {
                move && fs.renameSync(config.fromBase + inPath, config.toBase + outPath);
            }
        }
    }

    return cssp.translate(ast);
};

function getPatterns(patterns) {
    var out = [];

    for (var k in patterns) {
        out.push({ re: new RegExp(k), dir: patterns[k] });
    }

    return out;
}

function rename(path, patterns) {
    var e;

    for (var i = 0; i < patterns.length; i++) {
        e = patterns[i];
        if (e.re.test(path)) {
            return e.dir + getFileName(path);
        }
    }
}

function collect(token, uris) {
    var x;

    if (Array.isArray(token)) {
        for (var i = 0; i < token.length; i++) {
            x = token[i];
            if (Array.isArray(x)) {
                if (x[0] === 'uri') {
                    uris.push(x);
                } else {
                    collect(x, uris);
                }
            }
        }
    }
}

function getPath(uri) {
    var body = uri[1];

    switch(body[0]) {
        case 'string':
            return body[1].substring(1, body[1].length - 1);
        case 'raw':
            return body[1];
    }
}

function setPath(uri, path) {
    uri[1] = ['string', '\'' + path + '\''];
}

function getFileName(path) {
    var i = path.lastIndexOf('/');
    return i === -1 ? path : path.substring(i + 1);
}