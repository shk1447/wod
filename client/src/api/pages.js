import http from "../utils/http.js";

export default {
    getPage: function() {
        var url = "/pages/all";
        return http.get(url).then(function(res) {
            return res;
        })
    },
    setPage: function(params) {
        var url = "/pages/set";
        return http.post(url, params).then(function(res) {
            return res;
        });
    },
    delPage: function(params) {
        var url = "/pages/delete";
        return http.post(url, params).then(function(res) {
            return res;
        });
    }
}