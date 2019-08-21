import http from "../utils/http.js";

export default {
    delNodes:function(params) {
        var url = "/nodes/remove";
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
    }
}