import _ from 'lodash';

export default {
    setConfig:function(params) {
        this.instances = params.instances;
    },
    removePage:function(params) {
        
    },
    removeFlow:function(params) {
        
    },
    removeById:function(params) {
        
    },
    saveNodes: function(params) {
        
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
                resolve(page_list);
            } catch (error) {
                reject(error);
            }
        })
    },
    getFlow: function(page_id) {
        
    },
    getComp: function() {
        var me = this;
        return new Promise(function(resolve, reject) {
            try {
                var nodes = me.instances.filter((d) => {
                    return d.type !== 'flow_comp'
                });
                resolve(nodes);
            } catch (error) {
                reject(error)
            }
        })
    }
}