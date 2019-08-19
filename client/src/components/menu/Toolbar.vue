<template>
<div class="toolbar-wrapper">
    <template v-for="tool in tool.left" >
        <div class="tool left" :key="tool.id" v-on:click="tool.action">
            <span style="font-size:1.2em;">
                <i v-if="tool.icon !== ''" :class="tool.icon"></i>{{tool.label}}
            </span>
        </div>
    </template>
    <div style="flex:1 1 100%; "></div>
    <template v-for="tool in tool.right" >
        <div class="tool right" :key="tool.id" v-on:click="tool.action">
            <span style="font-size:1.2em;">
                <i v-if="tool.icon !== ''" :class="tool.icon"></i>{{tool.label}}
            </span>
        </div>
    </template>
    <div class="tool right" v-on:click="onFullScreen">
        <span style="font-size:1.2em;">
            <i class="fas fa-expand"></i>
        </span>
    </div>
    <div class="tool right" v-on:click="onLogout">
        <span style="font-size:1.2em;">
            <i class="fas fa-sign-out-alt"></i>
        </span>
    </div>
</div>
</template>

<script>
import api from "../../api";

export default {
    data () {
        return {
            tool: {
                left:[],
                right:[]
            }
        }
    },
    methods: {
        onFullScreen() {
            if(document.webkitIsFullScreen) {
                document.webkitCancelFullScreen();
            } else {
                document.documentElement.webkitRequestFullScreen();
            }
        },
        onLogout() {
            console.log('logout');
            api.users.logout().then(function(res) {
                location.href = "/";
            })
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    updated() {
        console.log(this.tool);
    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>

<style>
    .toolbar-wrapper {
        display:flex; height:49px;width:100%;border-bottom:1px solid #e0e3eb;
    }
    .tool {
        display:flex; flex:0 0 auto; align-items:center; justify-content:center; padding:1.5em; cursor: pointer;
    }
    .tool:hover {
        background-color:#f0f3fa;   
    }

    .tool.left {
        border-right:1px solid #e0e3eb;
    }

    .tool.right {
        border-left:1px solid #e0e3eb;
    }

</style>
