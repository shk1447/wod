<template>
    <div class="flip-card">
        <div class="flip-card-content">
            <div class="viewer-area flip-card-side-front" @dragover="dragover" @drop="drop">
                <component v-for="item in instances" :key="item._id" :is="item.compName" :meta="item"></component>
            </div>
            <div class="flip-card-side-back">
                <flow-manager></flow-manager>
            </div>
        </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import FlowManager from './Manager';

export default {
    data () {
        return {
            page_id:"",
            instances : []
        }
    },
    components : {
        'flow-manager':FlowManager
    },
    methods: {
        toggleFlip() {
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
            this.core.flow.manager.resetManager();
            var transfer_data = e.dataTransfer.getData("page");
            var data = JSON.parse(transfer_data);
            setTimeout(function() {
                me.$loading({})
                me.page_id = data.page_id;
                me.instances = data.instances;
                me.$nextTick(function() {
                    this.core.flow.manager.executeFlow();
                });
                me.$loading({}).close();
            },0)
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted');
        var me = this;
        me.custom_events.on('toggle_flip',me.toggleFlip);
    },
    updated() {
        console.log('updated')
    },
    destroyed() {
        console.log('destroyed');
        this.core.flow.manager.destroyFlow();
        me.custom_events.off('toggle_flip',me.toggleFlip);
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
