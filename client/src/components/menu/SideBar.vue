<template>
    <div>
        <div id="sidebar" ref="sidebar">
            <el-tabs type="border-card" class="custom-tabs" v-model="activePanel">
                <el-tab-pane v-for="panel in panels" :key="panel.name" class="custom-tab-item" :label="panel.name" :name="panel.name">
                    <component :is="panel.comp"/>
                </el-tab-pane>
            </el-tabs>
        </div>
        <div id="sidebar-separator" class="ui-draggable"></div>
    </div>
</template>

<script>
import PagePanel from "../panel/PagePanel.vue";
import FlowPanel from "../panel/FlowPanel.vue";
import PropertyPanel from "../panel/PropertyPanel.vue";
import DescriptionPanel from "../panel/DescriptionPanel.vue";

export default {
    props:["content_area"],
    data() {
        return {
            activePanel:"Page",
            panels:[]
        }
    },
    components: {
        "page-panel":PagePanel,
        "flow-panel":FlowPanel,
        "property-panel":PropertyPanel,
        "description-panel":DescriptionPanel
    },
    methods: {

    },
    created() {

    },
    mounted() {
        var me = this;
        var sidebar =  {};
        $('#sidebar-separator').draggable({
            axis:"x",
            start:function(event, ui) {
                sidebar.closing = false;
                sidebar.start = ui.position.left;
                sidebar.width = me.content_area.clientWidth - ui.position.left - 12;
            },
            drag: function(event, ui) {
                var sidebar_width = me.content_area.clientWidth - ui.position.left - 12;
                
                me.$refs.sidebar.style.width = sidebar_width + 'px';
                me.$refs.sidebar.style.border = 'none';
            
                if(sidebar_width < 200) {
                    sidebar.closing = true;
                } else {
                    sidebar.closing = false;
                }
                if(sidebar.closing) {
                    me.$refs.sidebar.style.border = '1px dashed rgba(80, 80, 80, 0.4)';
                }
                
            },
            stop: function(event, ui) {
                if(sidebar.closing) {
                    me.$refs.sidebar.style.width = '0px';
                    me.$refs.sidebar.style.border = 'none';
                }
                $("#sidebar-separator").css("left","auto");
                $("#sidebar-separator").css("right",($("#sidebar").width())+"px");
            }
        });
    },
    destroyed() {
        
    }
}
</script>

<style>
#sidebar-separator {
    position: absolute;
    top:50px !important;
    left:auto;
    right:0px;
    bottom:0px;
    width:10px;
    background: url("../../assets/img/grip.png") no-repeat 50% 50%;
    cursor: col-resize;
    z-index: 10;
    border-right:1px solid #e0e3eb;
}

#sidebar {
    position: absolute;
    top:50px !important;
    right:0px;
    bottom:0px;
    width:0px;
    background: #ffffff;
    z-index:11;
    box-sizing: border-box;
}

.custom-tabs {
    height:100%;
}

.custom-tabs .el-tabs__content {
    height: calc(100% - 70px);
    overflow: auto;
}
</style>


