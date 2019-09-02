<template>
    <div style="height:100%; overflow:auto;" v-on:contextmenu="onContextMenu">
        <el-tree class="page-tree" draggable :data="comp_list" :props="defaultProps" node-key="_id" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onDragStart" @node-contextmenu="onContextMenu">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
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
            comp_list:[],
            defaultProps: {
                children: 'children',
                label: function(data,node) {
                    return data.page_id + '/' + data.id
                }
            }
        }
    },
    components: {

    },
    methods: {
        onDeleteNode(item) {
            var me = this;
            api.nodes.removeById(item).then(function(res) {
                me.refreshOutlinePanel();
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
        refreshOutlinePanel(params) {
            var me = this;
            api.nodes.getComp().then(function(res){
                me.comp_list = res;
            })
        }
    },
    created() {
        
    },
    mounted() {
        console.log('mounted');
        this.refreshOutlinePanel();
    },
    updated() {
        console.log('updated');
    },
    destroyed() {
        
    }
}
</script>

<style>

</style>
