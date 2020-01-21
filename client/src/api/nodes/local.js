import _ from 'lodash';
import uuid from 'uuid/v4';

export default {
    instances:[],
    setConfig:function(params) {
        this.instances = params.instances;
    },
    removePage:function(params) {
        var me = this;
        return new Promise(function(resolve, reject) {
            me.instances = me.instances.filter(function(d) {
                return d.page_id !== params.page_id
            });
            resolve();
        })
    },
    removeFlow:function(params) {
        var me = this;
        return new Promise(function(resolve, reject) {
            var instances = params.instances;
            if(instances.length > 0) {
                for(var i in instances) {
                    var instance = instances[i];
                    var obj_id = instance["id"];
                    if(instance.type === 'flow_comp') {
                        var del_index = me.instances.findIndex((d) => { return d.id === obj_id});
                        if(del_index >= 0) me.instances.splice(del_index, 1);
                    } else {
                        var del_inst = me.instances.find((d) => { return d.id === obj_id});
                        if(del_inst) delete del_inst["flow"];
                    }
                }
            }
            resolve();
        })
    },
    removeById:function(params) {
        var me = this;
        return new Promise(function(resolve, reject) {
            var obj_id = params["id"];
            var del_index = me.instances.findIndex((d) => { return d.id === obj_id});
            if(del_index >= 0) me.instances.splice(del_index, 1);
            resolve();
        });
    },
    saveNodes: function(params) {
        var me = this;
        return new Promise(function(resolve, reject) {
            var instances = params.instances;
            for(var i in instances) {
                var instance = instances[i];
                var inst_index = me.instances.findIndex(function(d) { return d.page_id === instance.page_id && d.id === instance.id });
                if(inst_index >= 0) {
                    me.instances[inst_index] = instance
                } else {
                    me.instances.push(instance);
                }
            }
            resolve();
        });
    },
    getNodes: function() {
        var me = this;
        return new Promise(function(resolve, reject) {
            try {
                var nodes = me.instances.filter((d) => {
                    return d.type !== 'flow_comp'
                });
    
                var page_list = [];
                _.each(nodes, (node, i) => {
                    if(node.page_id) {
                        if(node.parent_id) {
                            var parent_node = nodes.find((d) => {return d.id === node.parent_id && d.page_id === node.page_id});
                            if(parent_node) {
                                if(parent_node.props.children) {
                                    parent_node.props.children.push(node);
                                } else {
                                    parent_node.props.children = [node];
                                }
                            }
                        }
                        if(!page_list.find((d) => {return d.page_id === node.page_id})) {
                            page_list.push({page_id:node.page_id,instances:[]});
                        }
                    }
                });
                var root_nodes = nodes.filter((d) => {return !d.parent_id && d.page_id});
                
                _.each(root_nodes, (root, i) => {
                    var page = page_list.find((d) => {return d.page_id === root.page_id});
                    page.instances.push(root);
                })
                resolve(JSON.parse(JSON.stringify(page_list)));
            } catch (error) {
                reject(error);
            }
        })
    },
    getFlow: function(page_id) {
        var me = this;
        return new Promise(function(resolve, reject) {
            try {
                var nodes = me.instances.filter((d) => {
                    return d.page_id === page_id;
                });
                
                resolve(JSON.parse(JSON.stringify(nodes)));
            } catch (error) {
                reject(error)
            }
        })
    },
    getComp: function() {
        var me = this;
        return new Promise(function(resolve, reject) {
            try {
                var nodes = me.instances.filter((d) => {
                    return d.type !== 'flow_comp'
                });
                resolve(JSON.parse(JSON.stringify(nodes)));
            } catch (error) {
                reject(error)
            }
        })
    },
    checkPage: function(page_id) {
        var me = this;
        return new Promise(function(resolve, reject) {
            try {
                var i = me.instances.findIndex((d) => {
                    return d.page_id === page_id
                });
                resolve({result:i < 0});
            } catch (error) {
                reject(error)
            }
        })
    }
}