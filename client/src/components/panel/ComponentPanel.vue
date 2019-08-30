<template>
    <div style="height:100%; overflow:auto;">
        <el-tree class="page-tree" draggable :data="comp_list" :props="defaultProps" node-key="name" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onDragStart" default-expand-all>
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.type === 'category' ? 'far fa-folder' : 'far fa-file-alt'"></i>   {{ data.name }}</span>
            </span>
        </el-tree>
    </div>
</template>

<script>
import _ from 'lodash';
import api from "../../api";

export default {
    data() {
        var two_comp_list = [];
        var three_comp_list = [];
        _.each(this.two_comp, function(v,k) {
            two_comp_list.push(v);
        })
        _.each(this.three_comp, function(v,k) {
            three_comp_list.push(v);
        })
        
        return {
            comp_list: [{
                name:'two_comp',
                type:'category',
                children:two_comp_list
            },{
                name:'three_comp',
                type:'category',
                children:three_comp_list
            }],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    components: {

    },
    methods: {
        onDragStart(node, e) {
            var transfer_page = node.data;

            e.dataTransfer.setData("component", JSON.stringify(transfer_page));
        },
        allowDrop(dragNode, dropNode, type) {
            return false;
        },
        allowDrag(node) {
            return node.data.type !== 'category';
        }
    },
    created() {
        var me = this;
        
    },
    mounted() {
        
    },
    destroyed() {
        var me = this;
        
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

