<template>
    <div style="height:100%; overflow:auto;" v-on:contextmenu="onContextMenu">
        <el-tree class="page-tree" draggable :data="page_list" :props="defaultProps" node-key="_id" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onDragStart" @node-contextmenu="onContextMenu">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                    <i :class="'far fa-file-alt'"></i>
                    <input v-if="modify_page.page_id === data.page_id" :value="data.page_id" v-on:keyup.enter="onEndRename"/>
                    <span v-else>{{data.page_id}}</span>
                </span>
                <sapn>
                    <i class="el-icon-delete tree-delete" @click="() => {onDeletePage(data)}"></i>
                </sapn>
            </span>
        </el-tree>
    </div>
</template>

<script>
import api from "../../api";
import uuid from 'uuid/v4';

export default {
    data() {
        return {
            modify_page: {
                page_id:""
            },
            page_list: [],
            defaultProps: {
                children: 'children',
                label: 'page_id'
            },
            menu_items:[{
                id:"page",
                label:"Page",
                children:[{
                    id:"new",
                    label:"New",
                    action:this.onAddPage
                },{
                    id:"rename",
                    label:"Rename",
                    action:this.onStartRename
                }]
            }]
        }
    },
    components: {

    },
    methods: {
        savePage(page_info) {
            var me = this;
            var param_instances = [];
            function recursive_instances(instances, parent_id) {
                _.each(instances, function(v,i) {
                    if(v.props.children && v.props.children.length > 0) {
                        recursive_instances(v.props.children, v.id)
                    }
                    if(parent_id) v['parent_id'] = parent_id;
                    if(v.props.children) delete v.props.children;
                    v["page_id"] = page_info.page_id
                    param_instances.push(v);
                })
            }
            recursive_instances(page_info.instances);
            console.log(param_instances);
            api.nodes.saveNodes({instances:param_instances}).then((res) => {
                console.log(res);
                me.custom_events.emit('refresh', {});
                //me.custom_events.emit('outline', {});
                me.$message({
                    message:"페이지가 저장되었습니다.",
                    type:"success"
                });
            }).catch(function(err) {
                console.log(err);
                me.$message({
                    message:"페이지 저장이 실패하였습니다.",
                    type:"error"
                });
            })
        },
        onEndRename(e) {
            console.log(e);
            this.modify_page.page_id = ""
            this.page.page_id = e.target.value;
            this.savePage(this.page);
        },
        onStartRename(menu, params) {
            console.log(params.node);
            this.modify_page.page_id = params.node.page_id;
            this.page = params.node;
        },
        onAddPage() {
            var me = this;
            var new_page = {
                page_id: uuid(),
                instances: [{
                    id: "basic_layer",
                    input:true,
                    output:false,
                    compName: "two-layer-comp",
                    type:"two_comp",
                    props: {
                        style:{
                            position: "absolute",
                            overflow: "hidden",
                            top: "0%",
                            left: "0%",
                            width: "100%",
                            height: "100%",
                            zIndex: "0"
                        },
                        children:[]
                    }
                }]
            }
            this.savePage(new_page);
        },
        onContextMenu(event,node, tree_node) {
            Vue.custom_events.emit('contextmenu', {
                active:true,
                params : {
                    event:event,
                    node: node
                },
                menu_items: this.menu_items
            });
        },
        onDeletePage(item) {
            var me = this;
            api.nodes.removePage(item).then(function(res) {
                me.refresh();
            })
        },
        onDragStart(node, e) {
            var transfer_page = node.data;

            e.dataTransfer.setData("page", JSON.stringify(transfer_page));
        },
        allowDrop(dragNode, dropNode, type) {
            return false;
        },
        allowDrag(node) {
            return true;
        },
        refresh(params) {
            var me = this;
            api.nodes.getNodes().then(function(res){
                me.page_list = res;
            })
        }
    },
    created() {
        var me = this;
        me.custom_events.on('refresh', me.refresh);
    },
    mounted() {
        this.refresh();
    },
    destroyed() {
        var me = this;
        me.custom_events.off('refresh', me.refresh);
    }
}
</script>

<style>
.page-tree {
    background : transparent;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.tree-delete:hover {
    color:red !important;
}
</style>
