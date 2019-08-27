const PollingNode = require('./module/PollingNode');
const PushNode = require('./module/PushNode');

module.exports = [{
    name:"polling-node",
    class:PollingNode,
    fields:{}
},{
    name:"push-node",
    class:PushNode,
    fields:{}
}]