<template>
<modal
    class="w-modal"
    ref="create_page_modal"
    id="create-page"
    name="create-page"
    :width="260"
    :height="220"
    :isAutoHeight="false"
    :reset="false"
    :clickToClose="true"
    :resizable="false"
    draggable=".modal-header">
    <div class="modal-header">
        <h5>Upload Page</h5>
        <a class="close-modal-btn" role="button" @click="beforeModalClose()"><i class="el-icon-error"></i></a>
    </div>
    <div class="modal-body">
        <el-form ref="create_page_form" size="mini" label-position="left" :model="form" label-width="60px" :rules="rules">
            <el-form-item label="NAME" prop="page_id">
                <el-input v-model="form.page_id"></el-input>
            </el-form-item>
            <el-form-item label="JSON" prop="instances_path">
                <el-input ref="test" type="file" v-model="form.instances_path" @change="onfileChange"></el-input>
            </el-form-item>
        </el-form>
    </div>
    <div class="modal-footer">
        <el-button size="mini" @click="onSubmit()">OK</el-button>
        <el-button size="mini" @click="beforeModalClose()">CANCEL</el-button>
    </div>
</modal>
</template>

<script>

import api from "../../api";

export default {
    data () {
        return {
            node_types:[],
            form: {
                page_id: '',
                instances: {},
                instances_path:''
            },
            rules: {
                page_id:[{required:true,message:'Please input name', trigger:'blur'}],
                instances:[{required:true,message:'Please select json file', trigger:'blur'}]
            },
            node_info:{}
        }
    },
    components:{
        
    },
    methods: {
        show(opt) {
            this.$modal.show('create-page');
        },
        beforeModalClose() {
            this.$modal.hide('create-page');
        },
        onfileChange(e) {
            var me = this;
            var file = this.$refs.test.$refs.input.files[0];
            var reader = new FileReader();
            reader.onload = function() {
                try {
                    me.form.instances = JSON.parse(reader.result);
                } catch(err) {
                    console.log(err);
                }
            };
            reader.readAsText(file, "utf-8");
        },
        onSubmit() {
            var me = this;
            console.log(this.form);
            api.pages.setPage({page_id:this.form.page_id, instances:this.form.instances}).then(function(res) {
                console.log(res);
                me.custom_events.emit('page', {});
                me.$modal.hide('create-page');
            }).catch(function(err) {
                console.log(err);
                me.$modal.hide('create-page');
            })
            
        }
    },
    beforeCreate(){

    },
    created() {
        console.log('created')
    },
    beforeRouteUpdate(to,from){

    },
    mounted() {
        console.log('mounted');
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {
        console.log('destroyed')
    }
}
</script>
<style>
.w-modal .modal-header h5 {margin: 0; font-size: 12px;}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  border-top-left-radius: .3rem;
  border-top-right-radius: .3rem;
}

.w-modal .modal-body {
    height: calc(100% - 110px);
    padding: 12px;
    overflow: auto;
}

.w-modal .modal-footer {
    display: block;   
    text-align: center;
    padding: 0.5rem;
}

.close-modal-btn {
    width: 20px;
    height: 20px;
    border-radius: 11px;
    color: #3f6393;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.close-modal-btn:hover {
    color: #529eff;
}
</style>