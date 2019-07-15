<template>
<div class="toolbar-wrapper">
    <div class="tool left">
        <span style="font-size:1.2em;">
            LAYOUT
        </span>
    </div>
    
    <div style="flex:1 1 100%; "></div>
    <div class="tool right">
        <span style="font-size:1.2em;">
            SAVE
        </span>
    </div>
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
export default {
    data () {
        return {}
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
        }
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
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
