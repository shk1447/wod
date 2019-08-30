<template>
<div class="editor-area" @dragover="dragover" @drop="drop">
    <component v-for="item in instances" :key="item._id" :is="item.compName"
        :_id="item._id" :page_id="item.page_id" :props="item.props" :data="item.data" :input="item.input" :output="item.output"></component>
</div>
</template>

<script>
export default {
    data () {
        return {
            instances : []
        }
    },
    methods: {
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
                    me.instances = data.instances;
                    me.$nextTick(function() {
                        this.core.flow.manager.executeFlow();
                    });
                    me.$loading({}).close();
                    me.$message({
                        message:"페이지가 로드되었습니다.",
                        type:"success"
                    });
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
