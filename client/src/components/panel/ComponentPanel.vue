<template>
    <div style="height:100%; overflow:auto;">
        <el-tree class="page-tree" draggable :data="comp_list" :props="defaultProps" node-key="compName" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onDragStart" :default-expanded-keys="expand_keys">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="data.type === 'category' ? 'far fa-folder' : 'far fa-file-alt'"></i>   {{ data.compName }}</span>
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
        var expand_keys = ["two_comp", "three_comp"];
        _.each(this.two_comp, function(v,k) {
            var category = two_comp_list.find(function(d) { return d.compName === v.category});
            if(category) {
                category.children.push(v);
            } else {
                two_comp_list.push({
                    compName:v.category,
                    type:'category',
                    children:[v]
                });
                //expand_keys.push(v.category);
            }
        })
        _.each(this.three_comp, function(v,k) {
            var category = three_comp_list.find(function(d) { return d.compName === v.category});
            if(category) {
                category.children.push(v);
            } else {
                three_comp_list.push({
                    compName:v.category,
                    type:'category',
                    children:[v]
                });
                //expand_keys.push(v.category);
            }
        })
        
        return {
            expand_keys:expand_keys,
            comp_list: [{
                compName:'two_comp',
                type:'category',
                children:two_comp_list
            },{
                compName:'three_comp',
                type:'category',
                children:three_comp_list
            }],
            defaultProps: {
                children: 'children',
                label: 'compName'
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
        },
        refresh() {
            
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

