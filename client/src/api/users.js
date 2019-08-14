import http from "../utils/http.js";

export default {
    logout: function() {
        var url = "/users/logout";
        return http.get(url).then(function(res) {
            return res;
        })
    }
}