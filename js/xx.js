gerid = function(){
    var w = $('.grid').width(); 
    $('.grid').css('height', 2.3*w+'px');
    $('.grid').css('padding-top', 0.1*w +'px');
}

vidScale = function(){
    var v = $('.vid').width(); 
    $('.vid').css('height', v*9/16 +'px');
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

var app = angular.module('xapp', []);

app.service('appData', function() {  
    this.api = 'cc4b67c52acb514bdf4931f7cedfd12b';
  })

app.controller('mainCtrl', function($scope, appData){
    $scope.login = false;
    $scope.focus = '';
    $scope.logIn = function(bool) {
        $scope.login = bool;
        $scope.focus = 'list';
        if(bool){
            angular.element(document.querySelector('#mlist')).scope().changeFilter('now_playing');
        } else{
            Cookies.set('user', null);
            Cookies.set('pass', null);
            Cookies.set('remember', null);    
        }
    };
    $scope.selectFilter = function(filter) {
        angular.element(document.querySelector('#mlist')).scope().changeFilter(filter);
        $scope.focus = 'list';
    };
    $scope.searchMovie = function(querry) {
        angular.element(document.querySelector('#mlist')).scope().search(querry);
        $(".navi").find('.active').removeClass("active");
        $scope.focus = 'list';
    };
    $scope.changeFocus = function(querry) {
        $scope.focus = querry;
    };
});

app.controller('movieList', function($scope, appData, $http){
    $scope.api = appData.api;
    $scope.filter = 'now_playing';
    $scope.titel = '';
    $scope.changeFilter = function(filter) {
        $scope.filter = filter;
        $scope.page = 1;
        $http.get('https://api.themoviedb.org/3/movie/'+ $scope.filter +'?api_key='+ $scope.api +'&language=en-US&page='+ $scope.page).then(function(response){ 
            console.log(response);
            $scope.movieDB = response.data.results;
            $scope.totalPage = response.data.total_pages;
        });
        if($scope.filter == 'now_playing') {
            $scope.titel = 'Now Playing';
        } else if($scope.filter == 'popular') {
            $scope.titel = 'Popular';
        } else if($scope.filter == 'upcoming') {
            $scope.titel = 'Up Coming';
        }
    };
    $scope.search = function(querry) {
        $scope.page = 1;
        $http.get('https://api.themoviedb.org/3/search/movie?api_key='+ $scope.api +'&language=en-US&query='+ querry).then(function(response){
            console.log(response);
            $scope.movieDB = response.data.results;
            $scope.totalPage = response.data.total_pages;
        });
    };
    $scope.changePage = function(page){
        $scope.page = page;
        if($scope.page < 1 ) $scope.page = 1;
        if($scope.page > $scope.totalPage ) $scope.page = $scope.totalPage;
        $http.get('https://api.themoviedb.org/3/movie/'+ $scope.filter +'?api_key='+ $scope.api +'&language=en-US&page='+ $scope.page).then(function(response){ 
            $scope.movieDB = response.data.results;
        });
    };
    $scope.finished = function() {
        gerid();
      };
    $scope.detail = function(id){
        angular.element(document.querySelector('#mDetail')).scope().setID(id);
        angular.element(document).find('body').scope().changeFocus('detail');
        $scope.yAxis = $(window).scrollTop();
        console.log($scope.yAxis);
        $(window).scrollTop(0);
    };
    $scope.scrollY = function(){
        $(window).scrollTop($scope.yAxis);
    };
});

app.directive('myRepeatDirective', function() {
    return function(scope, element, attrs) {
      if (scope.$last){
        gerid();
      }
    };
});

app.controller('movieDetail', function($scope, appData, $http, $sce){
    $scope.api = appData.api;
    $scope.setID = function(id){
        $http.get('https://api.themoviedb.org/3/movie/'+ id +'?api_key='+ $scope.api +'&language=en-US').then(function(response){ 
            console.log(response);
            $scope.movie = response.data;
        });
        $http.get('https://api.themoviedb.org/3/movie/'+ id +'/videos?api_key='+ $scope.api +'&language=en-US').then(function(response){ 
            console.log(response);
            $scope.video = response.data.results;
            if (typeof $scope.video !== 'undefined' && $scope.video.length > 0) {
                $scope.trailer = $scope.video[0];
                $scope.url = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.trailer.key);
            } else{
                $scope.url = false;
            }
        });
    };
    $scope.back = function(){
        angular.element(document).find('body').scope().changeFocus('list');
        $('.vid').attr('src', '{{url}}');
        angular.element(document).find('#mlist').scope().scrollY();
    }
});

function UserDB(){
    if (localStorage.getItem("userDB") === null) {
        var userDB = [];
        userDB.push({'user':'user', 'pass': 'uaspti'});
        localStorage.setItem('userDB', JSON.stringify(userDB));
    }
}

