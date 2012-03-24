var CSSP = require('cssp'),
    FS = require('fs'),
    PATH = require('path');

exports.rebase = function(src, config, move, copy) {
    var patterns = getPatterns(config.patterns),
        ast = CSSP.parse(src),
        uris = [],
        uri,
        inPath, outPath, outDir;

    collect(ast, uris);

    for (var i = 0; i < uris.length; i++) {
        uri = uris[i];
        inPath = getPath(uri);
        outPath = rename(inPath, patterns);
        if (outPath) {
            setPath(uri, outPath);
            if (copy || move) {
                outDir = PATH.dirname(config.toBase + outPath);
                try {
                    FS.readdirSync(outDir);
                } catch (e) {
                    FS.mkdirSync(outDir);
                }
            }
            copy && FS.writeFileSync(config.toBase + outPath, FS.readFileSync(config.fromBase + inPath));
            move && FS.renameSync(config.fromBase + inPath, config.toBase + outPath);
        }
    }

    return CSSP.translate(ast);
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
            return e.dir + PATH.basename(path);
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