import http from "../utils/http.js";

export default {
    removePage:function(params) {
        var url = "/nodes/removePage";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    removeFlow:function(params) {
        var url = "/nodes/removeFlow";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    removeById:function(params) {
        var url = "/nodes/removeById";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    addNode: function(params) {
        var url = "/nodes/add";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    saveNodes: function(params) {
        var url = "/nodes/save";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    getNodes: function() {
        var url = "/nodes/all";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getFlow: function() {
        var url = "/nodes/flow";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    getComp: function() {
        var url = "/nodes/comp";
        return http.get(url).then(function(res) {
            return res;
        })
    }
}