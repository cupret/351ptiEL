gerid = function(){
    var w = $('.grid').width(); 
    $('.grid').css('height', 2.3*w+'px');
    $('.grid').css('padding-top', 0.1*w +'px');
}

vidScale = function(){
    var v = $('.vid').width(); 
    var v2 = $('.titel > img').width(); 
    $('.vid').css('height', v*9/16 +'px');
}

function UserDB(){
    if (localStorage.getItem("userDB") === null) {
        var userDB = [];
        userDB.push({'user':'user', 'pass': 'user'});
        localStorage.setItem('userDB', JSON.stringify(userDB));
    }
}

$(document).ready(function() {
    $(window).resize(function() {
        gerid();
        vidScale();
    });
    $("input").on({
        focus: function(){
            $(this).css("background-color", "#cccccc");
        }, 
        blur: function(){
            $(this).css("background-color", "#ffffff");
        }
    });
    $("#rgstr_btn").on({
        click: function(){
            var user = {};
            user['user'] = $(this).siblings('.nm').val();
            user['pass'] = $(this).siblings('.pw').val();

            if(user['user'] == '' ||  user['pass'] == ""){
                alert('Username/Password field is empty');
                return 0;
            }

            var userDB = JSON.parse(localStorage.getItem('userDB')); 
            var exist = false;
            for (var x in userDB) {
                if(userDB[x]['user'] == user['user']) { exist = true;}
            }

            if(exist) {
                alert('Username already existed');
            }else{
                userDB.push(user);
                localStorage.setItem('userDB', JSON.stringify(userDB));
                alert('Registered Successfully');
            }
            $(this).siblings('.nm').val('');
            $(this).siblings('.pw').val('');
        }
    });
    $("#login_btn").on({
        click: function(){
            var nm = $(this).siblings('.nm').val();
            var pw = $(this).siblings('.pw').val();

            var userDB = JSON.parse(localStorage.getItem('userDB')); 
            var exist = false;
            for (var x in userDB) {
                if(userDB[x]['user'] == nm && userDB[x]['pass'] == pw) { exist = true;}
            }

            if(exist){
                if ($(this).siblings('.rmbr').is(':checked')) {
                    Cookies.set('user', nm, { expires: 1 });
                    Cookies.set('pass', pw, { expires: 1 });
                    Cookies.set('remember', true, { expires: 1 });
                } else {
                    Cookies.set('user', null);
                    Cookies.set('pass', null);
                    Cookies.set('remember', null);    
                }
                angular.element($('body')).scope().logIn(true);
            }else {
                alert('No User exist / Wrong Combination of User & Password.');
            }
            $(this).siblings('.nm').val('');
            $(this).siblings('.pw').val('');
        }
    });
    if (Cookies.get('remember') == 'true') {
        $('.sign > .nm').val(Cookies.get('user'));
        $('.sign > .pw').val(Cookies.get('pass'));
        $('.sign > .rmbr').prop('checked', true);
        $("#login_btn").trigger('click');
    }
    $(".navi a").on("click", function(){
        $(this).parent().parent().parent().find('.active').removeClass("active");
        $(this).parent().addClass("active");
    });
});
