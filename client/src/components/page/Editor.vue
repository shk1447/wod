<template>
<div class="editor-area" @dragover="dragover" @drop="drop" v-on:click.native="onInitialize($event)">
    <transform-area></transform-area>
    <component v-for="item in instances" :key="item._id" :is="item.compName" :meta="item"></component>
</div>
</template>

<script>
import _ from 'lodash';
import api from "../../api";

import TransformArea from './editor/TransformArea.vue';

export default {
    data () {
        return {
            page_id:"",
            instances : []
        }
    },
    components: {
        'transform-area':TransformArea
    },
    methods: {
        onInitialize(e) {
            console.log(e);
            Vue.custom_events.emit('active_transform', {active:false});
        },
        save() {
            // var a = document.createElement('a');
            // var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({"test":"test"}));
            // a.setAttribute("target",     "_blank"     );
            // a.setAttribute("href",     dataStr     );
            // a.setAttribute("download", "scene.json");
            // a.click();
            window.saveFile();
            var me = this;
            var param_instances = [];
            function recursive_instances(instances, parent_id) {
                _.each(instances, function(v,i) {
                    if(v.props.children && v.props.children.length > 0) {
                        recursive_instances(v.props.children, v.id)
                    }
                    if(parent_id) v['parent_id'] = parent_id;
                    if(v.props.children) delete v.props.children;
                    v["page_id"] = me.page_id
                    param_instances.push(v);
                })
            }
            recursive_instances(JSON.parse(JSON.stringify(this.instances)));
            console.log(param_instances);
            return api.nodes.saveNodes({instances:param_instances}).then((res) => {
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
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var me = this;
            
            var transfer_data = e.dataTransfer.getData("page");
            if(transfer_data){
                // drop하게 되면 manager가 관리하는 목록들(module, 컴포넌트 맵)을 비워줘야 한다.
                me.instances = [];
                this.core.flow.manager.resetManager();
                var data = JSON.parse(transfer_data);
                setTimeout(function() {
                    me.$loading({})
                    me.page_id = data.page_id;
                    me.instances = data.instances;
                    // me.$nextTick(function() {
                    //     this.core.flow.manager.executeFlow();
                    // });
                    me.$loading({}).close();
                    me.$message({
                        message:"페이지가 로드되었습니다.",
                        type:"success"
                    });
                    me.custom_events.emit('outline_active', data.page_id)
                },0)
            }
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    updated() {
        console.log('updated')
    },
    destroyed() {
        console.log('destroyed')
        this.onInitialize();
    }
}
</script>

<style>
    .editor-area {
        position:absolute;
        height:calc(100% - 50px);
        width:100%;
    }
</style>
