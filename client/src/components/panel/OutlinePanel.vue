<template>
    <div style="height:100%; overflow:auto;" v-on:contextmenu="onContextMenu">
        <el-tree class="page-tree" draggable :data="batch_list" :props="defaultProps" node-key="_id" :allow-drag="allowDrag" :allow-drop="allowDrop" @node-drag-start="onDragStart" @node-contextmenu="onContextMenu">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span v-on:dblclick="onSelectComp(data)">
                    <i :class="'far fa-file-alt'"></i>
                    <span>{{data.page_id + '/' + data.id}}</span>
                </span>
                <sapn>
                    <i class="el-icon-delete tree-delete" @click="() => {onDeleteNode(data)}"></i>
                </sapn>
            </span>
        </el-tree>
    </div>
</template>

<script>
import api from "../../api";

export default {
    data() {
        return {
            active_page:"",
            comp_list:[],
            defaultProps: {
                children: 'children',
                label: function(data,node) {
                    return data.page_id + '/' + data.id
                }
            }
        }
    },
    computed: {
        batch_list: function() {
            var me = this;
            var ret_list = [];
            if(me.active_page === '') {
                ret_list = [];
            } else {
                ret_list = me.comp_list.filter(function(d) { return d.page_id === me.active_page});
            }
            return ret_list;
        }
    },
    components: {

    },
    methods: {
        onSelectComp(node) {
            console.log(node);
            var comp = this.core.flow.manager.getCompMap(node);
            if(comp) {
                Vue.custom_events.emit('selected_item', {panel:'Property',type:'style',item:comp.meta});
            }
        },
        onDeleteNode(item) {
            var me = this;
            api.nodes.removeById(item).then(function(res) {
                me.refresh();
            })
        },
        onContextMenu() {

        },
        allowDrag(node) {
            return true;
        },
        allowDrop(dragNode, dropNode, type) {
            return false;
        },
        onDragStart(node,e) {
            var transfer_page = node.data;
            console.log(transfer_page);
            e.dataTransfer.setData("node", JSON.stringify(transfer_page));
        },
        setActive(params) {
            this.active_page = params;
        },
        refresh(params) {
            var me = this;
            api.nodes.getComp().then(function(res){
                me.comp_list = res;
            })
        }
    },
    created() {
        var me = this;
        me.custom_events.on('refresh', me.refresh);
        me.custom_events.on('onloaded_page', me.setActive);
    },
    mounted() {
        console.log('mounted');
        //this.refresh();
    },
    updated() {
        console.log('updated');
    },
    destroyed() {
        var me = this;
        me.custom_events.off('outline', me.refresh);
        me.custom_events.off('onloaded_page', me.setActive);
    }
}
</script>

<style>

</style>
