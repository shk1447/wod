<template>
  <div style="position:absolute;height:100%;width:100%;" @dragover="dragover" @drop="drop">
    <component v-for="item in instances" :key="item.id" :is="item.compName" :id="item.id" :props="item.props" :action="item.action"></component>
  </div>
</template>

<script>

export default {
    data () {
        return {
            instances : []
        }
    },
    components : {
        
    },
    methods: {
        dragover(e) {
            e.preventDefault();
        },
        drop(e) {
            e.preventDefault();
            var me = this;
            me.$loading({})
            var transfer_data = e.dataTransfer.getData("page");
            var data = JSON.parse(transfer_data);
            me.instances = data.instances;
            me.$loading({}).close();
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
</style>
