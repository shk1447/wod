const _ = require('lodash');
const api = require('../../api').default;
const PollingNode = require('./module/PollingNode');
const PushNode = require('./module/PushNode');

module.exports = function(layer) {
    var layer = layer;
    var map = {}
    var modules = [];
    return {
        addCompNode:function(instance) {
            console.log(instance);
            map[instance.meta.page_id+"/"+instance.meta.id] = instance;
            console.log(map)
        },
        removeCompNode:function(instance) {
            delete map[instance.meta.page_id+"/"+instance.meta.id];
            console.log(map)
        },
        loadFlow:function() {
            api.nodes.getFlow().then(function(nodes) {
                layer.addNodes(nodes);
            });
        },
        saveFlow:function() {
            var param_instances = [];
            var nodes = layer.getNodes();
            var links = layer.getLinks();
            _.each(nodes, function(node,i) {
                var wires = links.filter(function(d) {
                    return d.source.page_id+"/"+d.source.id === node.page_id+"/"+node.id
                }).map(function(d) {
                    return d.target.page_id+"/"+d.target.id
                })
                node.flow["wires"] = wires;
                if(node.props.children) {
                    delete node.props.children;
                }
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
                        test.created();
                        modules.push(test);
                    }
                })
            });
        },
        destroyFlow: function() {
            _.each(modules, function(module, i) {
                module.destroyed();
            })
            modules = [];
        },
        resetManager : function(){
            //manager.js가 갖고있는 데이터 초기화
            modules = [];
            map = {};
        }
    }
};
