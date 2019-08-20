const _ = require('lodash');
const api = require('../../api').default;
const PollingNode = require('./module/PollingNode');
const PushNode = require('./module/PushNode');

module.exports = function(layer) {
    var layer = layer;
    var map = {}
    
    return {
        addCompNode:function(instance) {
            map[instance.id] = instance;
            console.log(map)
        },
        removeCompNode:function(instance) {
            delete map[instance.id];
            console.log(map)
        },
        loadFlow:function() {
            api.nodes.getFlow().then(function(res) {
                _.each(res, function(node,i) {
                    layer.addNodes(node);
                    if(node.type === 'push_node') {
                        var test = new PushNode(node);
                        console.log(test);
                    }
                })
            });
        },
        saveFlow:function() {
            var param_instances = [];
            var nodes = layer.getNodes();
            var links = layer.getLinks();
            _.each(nodes, function(node,i) {
                var wires = links.filter(function(d) {
                    return d.source.id === node.id
                }).map(function(d) {
                    return d.target.id
                })
                node.flow["wires"] = wires;
                param_instances.push({
                    id:node.id,
                    input:node.input,
                    output:node.output,
                    page_id:node.page_id,
                    parent_id:node.parent_id,
                    compName:node.compName,
                    type:node.type,
                    props:node.props,
                    flow:node.flow
                })
            })
            api.nodes.saveNodes({instances:param_instances}).then(function(res) {
                console.log(res);
            })
        },
        executeFlow:function() {
            api.nodes.getFlow().then(function(res) {
                _.each(res, function(node,i) {
                    if(node.type === 'push_node') {
                        var test = new PushNode(node);
                        test.flow.wires = test.flow.wires.map(function(d,i) {
                            return map[d];
                        })
                    }
                })
            });
        }
    }
};