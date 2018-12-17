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