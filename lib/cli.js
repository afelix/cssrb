var FS = require('fs'),
    CSSRB = require('./cssrb'),
    UTIL = require('./util'),
    PATH = require('path'),
    print = require('util').print,
    src;

var args = process.argv.slice(2),
    opts = args.length ? getOpts(args, [
            '-v', '--version',
            '-h', '--help',
            '-mv', '--move',
            '-cp', '--copy',
           ], [
            '-i', '--input',
            '-o', '--output',
            '-c', '--config'
           ]) : null,
    single = opts && opts.single,
    pairs = opts && opts.pairs,
    other = opts && opts.other,
    move = (single && single.contains(['-mv', '--move'])),
    copy = (single && single.contains(['-cp', '--copy'])),
    inFile = (pairs && (pairs['-i'] || pairs['--input'])) || (other && other[0]),
    outFile = (pairs && (pairs['-o'] || pairs['--output'])) || (other && other[1]),
    configPath = (pairs && (pairs['-c'] || pairs['--config']));

if (single && single.contains(['-v', '--version'])) {
    printFile('VERSION');
} else if ((move && copy) || !configPath || !inFile || !outFile || !opts || (single && single.contains(['-h', '--help'])) || other.length > 2) {
    printFile('USAGE');
} else {
    src = FS.readFileSync(inFile).toString().trim();
    outFile = PATH.resolve(outFile);
    UTIL.mkdirs(PATH.dirname(outFile));
    FS.writeFileSync(outFile, CSSRB.rebase(src, require(FS.realpathSync(configPath)).config, move, copy));
}

function getOpts(argv, o_single, o_pairs) {
    var opts = { single : [], pairs : {}, other : [] },
        arg;

    for (var i = 0; i < argv.length;) {
        arg = argv[i];
        if (o_single && o_single.indexOf(arg) !== -1 && (!o_pairs || o_pairs.indexOf(arg) === -1)) {
            opts.single.push(arg);
        } else if (o_pairs && o_pairs.indexOf(arg) !== -1 && (!o_single || o_single.indexOf(arg) === -1)) {
            opts.pairs[arg] = argv[++i];
        } else {
            opts.other.push(arg);
        }
        i++;
    }

    opts.single.contains = function(value) {
        if (typeof value === 'string') {
            return this.indexOf(value) !== -1;
        } else {
            for (var i = 0; i < value.length; i++) {
                if (this.indexOf(value[i]) !== -1) return true;
            }
        }

        return false;
    };

    return opts;
}

function printFile(filename) {
    print(FS.readFileSync(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/' + filename).toString());
}