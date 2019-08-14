
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(event){
        event.preventDefault();
        
        var user_id = $('.input100[name=user_id]').val();
        var password = $('.input100[name=password]').val();
        var url = location.origin + "/users/login";
        // var params = {
        //     user_id:user_id,
        //     password:aes_utils.encrypt(password),
        //     page_type:'admin'
        // };
        var params = {
            user_id:user_id,
            password:password
        };
        
        var http = new XMLHttpRequest();
        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'application/json');

        http.onreadystatechange = function() {//Call a function when the state changes.
            if(this.readyState == 4 ){
                var data = JSON.parse(this.response)
                if(this.status == 200) {
                    sessionStorage.setItem('user', this.response);
                    location.href = '/';
                } else if(this.status === 401) {
                    alert(data.message)
                }
            }
        }
        http.send(JSON.stringify(params));
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

})(jQuery);