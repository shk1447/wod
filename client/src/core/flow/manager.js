const _ = require('lodash');
const api = require('../../api').default;

module.exports = function(layer) {
    var pageId = "";
    var layer = layer;
    var map = {}
    var delete_items = [];
    return {
        getCompMap:function(instance) {
            return map[instance.page_id + '/' +instance.id];
        },
        addCompNode:function(instance) {
            console.log(instance);
            map[instance.meta.page_id+"/"+instance.meta.id] = instance;
            console.log(map)
        },
        removeCompNode:function(instance) {
            delete map[instance.meta.page_id+"/"+instance.meta.id];
            console.log(map)
        },
        loadFlow:function(page_id) {
            layer.clear();
            api.nodes.getFlow(page_id).then(function(nodes) {
                _.each(nodes, function(v,k) {
                    if(!v.flow) {
                        v.flow = {
                            x: parseInt(v.props.style.left),
                            y: parseInt(v.props.style.top),
                            wires:[]
                        }
                    }
                })
                layer.addNodes(nodes);
            });
        },
        addNode: function(node) {

        },
        removeNode: function(node) {
            // type에 따라 다른 명령
            var instance = {
                _id:node._id,
                id:node.id,
                input:node.input,
                output:node.output,
                page_id:node.page_id,
                parent_id:node.parent_id,
                compName:node.compName,
                type:node.type,
                props:node.props,
                flow:node.flow
            }
            delete_items.push(instance);
        },
        addLink: function(node) {

        },
        saveFlow:function() {
            var param_instances = [];
            var nodes = layer.getNodes();
            var links = layer.getLinks();

            return api.nodes.removeFlow({instances:delete_items}).then(function() {
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
                        _id:node._id,
                        id:node.id,
                        input:node.input,
                        output:node.output,
                        page_id:pageId,
                        parent_id:node.parent_id,
                        compName:node.compName,
                        type:node.type,
                        props:node.props,
                        flow:node.flow
                    })
                })
                return api.nodes.saveNodes({instances:param_instances}).then(function(res) {
                    Vue.$message({
                        type:'success',
                        message:'Success Deploy'
                    })
                })
            })
        },
        executeFlow:function(page_id) {
            api.nodes.getFlow(page_id).then(function(res) {
                _.each(res, function(node,i) {
                    if(node.type === 'flow_comp') {
                        var flow_module = new Vue[node.type][node.compName].class(node);
                        flow_module.meta = node;
                        flow_module.created();
                        map[node.page_id + '/' + node.id] = flow_module;
                    }
                })
                _.each(map, function(v,k) {
                    if(v.meta.flow && v.meta.flow.wires && v.meta.flow.wires.length > 0) {
                        v.meta.flow.wires = v.meta.flow.wires.map(function(d,i) {
                            return map[d];
                        })
                        if(v.type === 'flow_comp') v.mounted();
                    }
                })
            });
            pageId = page_id;
        },
        destroyFlow: function() {
            _.each(map, function(comp, i) {
                if(comp.type === 'flow_comp') {
                    comp.destroyed();
                }
            })
        },
        resetManager : function(){
            //manager.js가 갖고있는 데이터 초기화
            map = {};
        }
    }
};
