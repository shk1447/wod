const _ = require('lodash');
const nodes = require('../../model/nodes');

module.exports = {
    get : {
        "flow":function(req,res,next) {
            nodes.find({"flow":{$exists:true}}).then((nodes) => {
                res.status(200).send(nodes);
            }).catch((err) => {
                res.status(500).send(err);
            });
        },
        "all" : function(req,res,next) {
            nodes.find({}).then((nodes) => {
                var page_list = [];
                _.each(nodes, (node, i) => {
                    if(node.page_id) {
                        if(node.parent_id) {
                            var parent_node = nodes.find((d) => {return d.id === node.parent_id});
                            if(parent_node) {
                                if(parent_node.children) {
                                    parent_node.children.push(node);
                                } else {
                                    parent_node.children = [node];
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
                
                res.status(200).send(page_list);
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    },
    post: {
        "save" : function(req,res,next) {
            var page_id = req.body.page_id;
            var instances = req.body.instances;
            var bulk = nodes.collection.initializeUnorderedBulkOp();
            _.each(instances, (instance, i) => {
                var query = {};
                query["id"] = instance["id"];
                if(page_id) instance["page_id"] = page_id;
                bulk.find(query).upsert().updateOne( instance );
            });
            bulk.execute((err, bulkres) => {
                if(err) res.status(500).send();
                else res.status(200).send();
            })
        }
    }
}