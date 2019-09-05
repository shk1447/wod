<template>
<modal
    class="w-modal"
    ref="create_page_modal"
    id="create-page"
    name="create-page"
    :width="260"
    :height="180"
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
        </el-form>
    </div>
    <div class="modal-footer">
        <el-button size="mini" @click="onSubmit()">OK</el-button>
        <el-button size="mini" @click="beforeModalClose()">CANCEL</el-button>
    </div>
</modal>
</template>

<script>
import _ from 'lodash';
import api from "../../api";

export default {
    data () {
        return {
            node_types:[],
            form: {
                page_id: '',
                instances: [{
                    id: "two_layer",
                    input:true,
                    output:false,
                    compName: "two-layer-comp",
                    type:"two_comp",
                    props: {
                        style:{
                            position: "absolute",
                            overflow: "hidden",
                            top: "0%",
                            left: "0%",
                            width: "100%",
                            height: "100%",
                            zIndex: "0"
                        },
                        children:[]
                    }
                }],
                instances_path:''
            },
            rules: {
                page_id:[{required:true,message:'Please input name', trigger:'blur'}]
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
            var param_instances = [];
            function recursive_instances(instances, parent_id) {
                _.each(instances, function(v,i) {
                    if(v.props.children && v.props.children.length > 0) {
                        recursive_instances(v.props.children, v.id)
                    }
                    if(parent_id) v['parent_id'] = parent_id;
                    if(v.props.children) delete v.props.children;
                    v["page_id"] = me.form.page_id
                    param_instances.push(v);
                })
            }
            recursive_instances(this.form.instances);
            console.log(param_instances);
            api.nodes.saveNodes({instances:param_instances}).then((res) => {
                console.log(res);
                me.custom_events.emit('page', {});
                me.custom_events.emit('outline', {});
                me.$modal.hide('create-page');
                me.$message({
                    message:"페이지가 저장되었습니다.",
                    type:"success"
                });
            }).catch(function(err) {
                console.log(err);
                me.$modal.hide('create-page');
                me.$message({
                    message:"페이지 저장이 실패하였습니다.",
                    type:"error"
                });
            })
            // api.pages.setPage({page_id:this.form.page_id, instances:this.form.instances}).then(function(res) {
            //     console.log(res);
            //     me.custom_events.emit('page', {});
            //     me.$modal.hide('create-page');
            // }).catch(function(err) {
            //     console.log(err);
            //     me.$modal.hide('create-page');
            // })
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