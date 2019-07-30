<template>
    <div style="height:100%; overflow:auto;">
        <el-tree class="page-tree" draggable :data="page_list" :props="defaultProps" node-key="_id" :allow-drag="allowDrag" :allow-drop="allowDrop"
        @node-drag-start="onDragStart">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i :class="'far fa-file-alt'"></i>   {{ data.page_id }}</span>
                <sapn>
                    <i class="el-icon-delete tree-delete" @click="() => {onDeletePage(data)}"></i>
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
            page_list: [],
            defaultProps: {
                children: 'children',
                label: 'page_id'
            }
        }
    },
    components: {

    },
    methods: {
        onDeletePage(item) {
            var me = this;
            api.pages.delPage(item).then(function(res) {
                me.refreshPagePanel();
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
        refreshPagePanel(params) {
            var me = this;
            api.pages.getPage().then(function(res) {
                me.page_list = res;
            })
        }
    },
    created() {
        var me = this;
        custom_events.on('page', function() {
            me.refreshPagePanel();
        })
    },
    mounted() {
        this.refreshPagePanel();
    },
    destroyed() {
        
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
