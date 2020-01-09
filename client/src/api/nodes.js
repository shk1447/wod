import http from "../utils/http.js";

export default {
    init:false,
    type:"local",
    cloud: {
        url:""
    },
    local: {
        data:[]
    },    
    removePage:function(params) {
        var url = this.cloud.url + "/nodes/removePage";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    removeFlow:function(params) {
        var url = this.cloud.url + "/nodes/removeFlow";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    removeById:function(params) {
        var url = this.cloud.url + "/nodes/removeById";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    saveNodes: function(params) {
        var url = this.cloud.url +  "/nodes/save";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    getNodes: function() {
        var url = this.cloud.url +  "/nodes/all";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getFlow: function(page_id) {
        var url = this.cloud.url +  "/nodes/flow?page_id=" + page_id;
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getComp: function() {
        var url = this.cloud.url +  "/nodes/comp";
        return http.get(url).then(function(res) {
            return res;
        })
    }
}