<template>
<modal
    class="w-modal"
    ref="setting_modal"
    id="setting-page"
    name="setting-page"
    :width="420"
    :height="'auto'"
    :dynamic="true"
    :injectModalsContainer="true"
    :isAutoHeight="false"
    :reset="false"
    :clickToClose="false"
    :resizable="false"
    draggable=".modal-header">
    <div class="modal-header">
        <h5>Setting</h5>
        <a class="close-modal-btn" role="button" @click="beforeModalClose()">
            <i class="el-icon-error"></i>
        </a>
    </div>
    <div class="modal-body">
        <el-switch
            class="setting-option"
            v-model="isCloud"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="CLOUD"
            inactive-text="LOCAL">
        </el-switch>
        <el-input v-if="!isCloud" size="small" class="setting-option" type="file" ref="test"
            v-model="form.local.instances_path" @change="onfileChange"></el-input>
        <el-input v-if="isCloud" size="small" class="setting-option" placeholder="http://127.0.0.1:9000" v-model="form.cloud.url"></el-input>
    </div>
    <div class="modal-footer">
        <el-button size="mini" type="primary" @click="onSubmit()">OK</el-button>
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
            }
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
                    me.form.local.instances = JSON.parse(reader.result);
                } catch(err) {
                    console.log(err);
                }
            };
            reader.readAsText(file, "utf-8");
        },
        onSubmit() {
            var me = this;
            console.log('test');
            var type = this.isCloud ? "cloud" : "local";
            if(this.isCloud) {
                api.nodes.setConfig(type, this.form.cloud);
            } else {
                api.nodes.setConfig(type, this.form.local);
            }

            me.custom_events.emit('refresh', {});
            me.$modal.hide('setting-page');
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
  padding: 0.5rem;
  border-bottom: 1px solid #e9ecef;
  background: #66b1ff;
  color:white;
  font-size:1.2em;
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
    border-top: 1px solid #e9ecef;
}

.close-modal-btn {
    width: 20px;
    height: 20px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color:white;
}
.close-modal-btn:hover {
    color: #e9ecef;
}

.setting-option {
    display: block;
    margin:10px 0px 10px 0px;
}
</style>