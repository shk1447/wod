<template>
<modal
    class="w-modal"
    ref="setting_modal"
    id="setting-page"
    name="setting-page"
    :width="420"
    :height="210"
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
        <el-switch
            style="display: block; margin-bottom:20px;"
            v-model="isCloud"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="CLOUD"
            inactive-text="LOCAL">
        </el-switch>
        <el-form ref="setting_page_form" size="mini" label-position="left" :model="getForms" label-width="60px" :rules="getRules">
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
import _ from 'lodash';
import api from "../../api";

export default {
    data () {
        return {
            isCloud:false,
            form: {
                cloud: {
                    url:''
                },
                local: {
                    instances: [],
                    instances_path:''   
                }
            },
            rules: {
                cloud: {
                    url:[{required:true,message:'Please input url', trigger:'blur'}],
                },
                local: {
                    instances:[{required:true,message:'Please select json file', trigger:'blur'}]
                }
            }
        }
    },
    computed: {
        getForms() {
            return this.isCloud ? this.form["cloud"] : this.form["local"];
        },
        getRules() {
            return this.isCloud ? this.rules["cloud"] : this.rules["local"];
        }
    },
    components:{
        
    },
    methods: {
        show(opt) {
            this.$modal.show('setting-page');
        },
        beforeModalClose() {
            this.$modal.hide('setting-page');
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