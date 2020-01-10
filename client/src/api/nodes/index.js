import local from "./local.js";
import cloud from "./cloud.js";

export default {
    type:"local",
    module:{
        local:local,
        cloud:cloud
    },
    setConfig:function(type, params) {
        this.type = type;
        this.module[this.type].setConfig(params);
    },
    removePage:function(params) {
        return this.module[this.type].removePage(params);
    },
    removeFlow:function(params) {
        return this.module[this.type].removeFlow(params);
    },
    removeById:function(params) {
        return this.module[this.type].removeById(params);
    },
    saveNodes: function(params) {
        return this.module[this.type].saveNodes(params);
    },
    getNodes: function() {
        return this.module[this.type].getNodes();
    },
    getFlow: function(page_id) {
        return this.module[this.type].getFlow(page_id);
    },
    getComp: function() {
        return this.module[this.type].getComp();
    }
}