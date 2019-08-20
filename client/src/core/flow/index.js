

const layer = require('./layer.js');
const manager =  require('./manager.js')(layer);

module.exports = {
    layer:layer,
    manager:manager
}