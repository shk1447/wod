const _ = require('lodash');
const nodes = require('../../model/nodes');
const mongoose = require('mongoose');

module.exports = {
    get : {
        "comp":function(req,res,next) {
            nodes.find({page_id:{$ne:'flow'}}).then((nodes) => {
                res.status(200).send(nodes);
            }).catch((err) => {
                res.status(500).send(err);
            });
        },
        "flow":function(req,res,next) {
            nodes.find({"flow":{$exists:true}}).then((nodes) => {
                res.status(200).send(nodes);
            }).catch((err) => {
                res.status(500).send(err);
            });
        },
        "all" : function(req,res,next) {
            nodes.find({page_id:{$ne :'flow'}}).then((nodes) => {
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
                
                res.status(200).send(page_list);
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    },
    post: {
        "add" : function(req,res,next) {
            var node = req.body;
            console.log(node);
            nodes.update({id:node.id,page_id:node.page_id}, node, {upsert:true}, function(err, doc) {
                if(err) return res.status(200).send(err);
                return res.status(200).send();
            })
        },
        "save" : function(req,res,next) {
            var instances = req.body.instances;
            var bulk = nodes.collection.initializeUnorderedBulkOp();
            _.each(instances, (instance, i) => {
                var query = {};
                // query["id"] = instance["id"];
                // query["page_id"] = instance["page_id"];
                query["_id"] = new mongoose.Types.ObjectId(instance["_id"]);
                delete instance["_id"];
                //if(page_id) { instance["page_id"] = page_id; }
                bulk.find(query).upsert().updateOne( instance );
            });
            bulk.execute((err, bulkres) => {
                if(err) res.status(500).send();
                else res.status(200).send();
            })
        },
        "removeFlow" : function(req,res,next) {
            var instances = req.body.instances;
            if(instances.length > 0) {
                var bulk = nodes.collection.initializeUnorderedBulkOp();
                _.each(instances, (instance, i) => {
                    var obj_id = new mongoose.Types.ObjectId(instance["_id"]);
                    if(instance.type === 'flow_comp') {
                        bulk.find({_id:obj_id}).removeOne();
                    } else {
                        bulk.find({_id:obj_id}).upsert().updateOne({$unset:{flow:1}});
                    }
                });
                bulk.execute((err, bulkres) => {
                    if(err) res.status(500).send();
                    else res.status(200).send();
                })
            } else {
                res.status(200).send();
            }
        },
        "removePage" : function(req,res,next) {
            nodes.remove({page_id:req.body.page_id}).then(() => {
                res.status(200).send();
            }).catch((err) => {
                res.status(500).send(err);
            })
        },
        "removeById" : function(req,res,next) {
            nodes.remove({_id:new mongoose.Types.ObjectId(req.body._id)}).then(() => {
                res.status(200).send();
            }).catch((err) => {
                res.status(500).send(err);
            })
        }
    }
}