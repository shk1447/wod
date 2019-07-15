var fs = require('fs');
var path = require('path');
var cmd = require('commander');

require('./server/utils/default_extend.js')

cmd.option('-m, --mode [mode]', 'set mode', 'production')
   .option('-c, --conf [conf]', 'set config', './config.json')
   .parse(process.argv);

var relative_path = path.relative(__dirname , './');
var config = JSON.parse(fs.readFileSync(path.resolve(cmd.conf), 'utf8'));

process.env.mode = cmd.mode;
process.env.port = config.port;
process.env.database = config.database.type;
process.env.root_path = config.root_path !== "" ? path.resolve(config.root_path, './bundle')
    : path.resolve(__dirname, relative_path, './bundle');
require('./server')(config);