<template>
    <div class="flip-card">
        <div class="flip-card-content">
            <div class="viewer-area flip-card-side-front" @dragover="dragover" @drop="drop">
                <component v-for="item in instances" :key="item._id" :is="item.compName" :meta="item"></component>
            </div>
            <div class="flip-card-side-back">
                <flow-manager ref="flowManager"></flow-manager>
            </div>
        </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import FlowManager from './viewer/FlowManager.vue';

export default {
    data () {
        return {
            page_id:"",
            instances : [],
            meta : []
        }
    },
    components : {
        'flow-manager':FlowManager
    },
    methods: {
        toggleFlip(params) {
            this.$refs.flowManager.page_id = params.page_id;
            $(".flip-card-side-back").toggleClass('flip');
        },
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var me = this;
            me.instances = [];

            // drop하게 되면 manager가 관리하는 목록들(module, 컴포넌트 맵)을 비워줘야 한다.
            this.core.flow.manager.destroyFlow();
            this.core.flow.manager.resetManager();
            var transfer_data = e.dataTransfer.getData("page");
            var data = JSON.parse(transfer_data);
            this.meta = JSON.parse(JSON.stringify(data.instances));
            setTimeout(function() {
                me.$loading({})
                me.page_id = data.page_id;
                me.instances = data.instances;
                me.$nextTick(function() {
                    this.core.flow.manager.loadFlow(data.page_id);
                    this.core.flow.manager.executeFlow(data.page_id);
                });
                me.$loading({}).close();
            },0)
        },
        reload() {
            var me = this;
            me.instances = [];
            this.core.flow.manager.destroyFlow();
            me.core.flow.manager.resetManager();
            setTimeout(function() {
                me.$loading({});
                me.instances = JSON.parse(JSON.stringify(me.meta));
                me.$nextTick(function() {
                    me.core.flow.manager.loadFlow(me.page_id);
                    me.core.flow.manager.executeFlow(me.page_id);
                    me.$loading({}).close();
                })
            },0)
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted');
        this.custom_events.on('toggle_flip',this.toggleFlip);
    },
    updated() {
        console.log('updated')
    },
    destroyed() {
        console.log('destroyed');
        this.core.flow.manager.destroyFlow();
        this.custom_events.off('toggle_flip',this.toggleFlip);
    }
}
</script>

<style>
    .viewer-area {
        position:absolute;
        height:100%;
        width:100%;
        backface-visibility: hidden;
    }

    .flip-card-content {
        width: 100%;
        height:100%;
        position: absolute;
    }

    .flip-card {
        position: relative;
        perspective: 1000px;
        width:100%;
        height: 100%;
    }
    .flip-card-side-back {
        background: rgba(255,255,255,0.85);
        position: absolute;
        width: 100%;
        height:100%;
        backface-visibility: hidden;
        -webkit-transform-style: preserve-3d;
        -webkit-transform-origin: top center;
        -webkit-transform: rotateX(240deg);
        -webkit-transition: all 0.8s ease-in-out;
    }
    .flip-card-side-back.flip {
        -webkit-transform: rotateX(0deg);
    }
</style>
