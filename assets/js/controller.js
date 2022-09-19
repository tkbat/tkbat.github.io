var apiUrl = 'https://web.myteam11.com/';
var appApiUrl = 'https://web.myteam11.com/apk/downlaod?mobile=';
var app = angular.module('myteam11', ['timer']);
app.controller('MatchCtrl', ['$scope','$http','$timeout' ,function($scope,$http,$timeout) {
    $scope.isLoaded = false;
	$scope.playNow = function (id) {
        window.location.href = 'https://www.myteam11.com/fantasy-sports/sports/create-team/' + id + '/0';
    }

    function getMilisec(date) {
        var splitData = date.split('-');
        var temp = '';
        temp = splitData[1];
        splitData[1] = splitData[0];
        splitData[0] = temp;
        return new Date(splitData[0] + '/' + splitData[1] + '/' + splitData[2]);
    }

    $scope.getMatches = function (value) {
        var headerData = {'appCode': 2, 'matchType': value, 'myleauge': '0', 'Cache-Control': 'no-cache'};
        $scope.matches = {};
        $http({
            method: 'GET',
            url: apiUrl + "match/getmatchlist",
            headers: headerData
        }).then(function (response) {
            if (response.data.Status) {
                $scope.matches = response.data.Response.Notstarted;
				$timeout( function(){		
					document.getElementsByClassName("match_listing")[0].removeAttribute("style");
				}, 500);
                for (var index in $scope.matches) {
                    if ($scope.matches[index].StartDate && $scope.matches[index].CurrentTime) {
                        if (!$scope.matches[index].milisec) {
                            var c = getMilisec($scope.matches[index].CurrentTime).getTime();
                            var s = getMilisec($scope.matches[index].StartDate).getTime();
                            var e = s - c;
                            $scope.matches[index]["milisec"] = e / 1000;
                        }
                    }
                }
/*
                $("#tabs-" + value).trigger('click');
                Event.preventDefault();
*/
            }
        })
    }
     $scope.init = function () {
         var headerData = {'appCode': 2, 'appVersion': 0, 'languageCode': 'en',userId:0}; 
        $http({
            method: 'GET',
            url: apiUrl + "match/getsporttypev12",
            headers: headerData
        }).then(function (response) {
            $scope.headerData = response.data.Response
             $scope.getMatches(1);
        });
    }
    
    $scope.setLocalStorage = function(id){    
      localStorage.setItem('match_info', JSON.stringify({"matchType":id,"matchMode":2}))    
    }
    $scope.init();

    $scope.options = {
        loop: true,
        margin: 10,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            450: {
                items: 2
            },
            768: {
                items: 3
            },
            1024: {
                items: 4
            }
        }};
    
        
        $scope.getNews = function(){        
                $http({
                    method: 'GET',
                    url: 'https://blog.myteam11.com/Blog/GetLatestBlogs?pageId=1&records=5&type=1&teamId='
                }).then(function (response) {
                    if (response.data.model) {
                        $scope.blogs = response.data.model;
                    } else {
                        $scope.news = [];
                    }
                })
            }
    
            $scope.getNews();
    }]).directive("owlCarousel", function() {
        return {
            restrict: 'E',
            transclude: false,
            link: function (scope) {
                scope.initCarousel = function(element) {
                  // provide any default options you want
                    var defaultOptions = {
                    };
                    var customOptions = scope.$eval($(element).attr('data-options'));
                    // combine the two options objects
                    for(var key in customOptions) {
                        defaultOptions[key] = customOptions[key];
                    }
                    // init carousel
                    $(element).owlCarousel(defaultOptions);
                };
            }
        };
    })
    .directive('owlCarouselItem', [function() {
        return {
            restrict: 'A',
            transclude: false,
            link: function(scope, element) {
              // wait for the last item in the ng-repeat then call init
                if(scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
}]);

app.controller('IPLCtrl', ['$scope','$http' ,function ($scope, $http) {
    $scope.init = function (routeUrl,num) {
		var headerData = {'appCode': 2, 'matchType': 1, 'myleauge': '0', 'Cache-Control': 'no-cache'};
        $scope.matches = {};
         $http({
            method: 'GET',
            url: apiUrl + "match/getmatchlist",
            headers: headerData
        }).then(function (response) {
            if (response.data.Status) {
                $scope.matches = response.data.Response.Notstarted;            
            }
        })
    }
	$scope.formatAMPM= function(date) {
		  const tempStore = date.split('-')
		  date = tempStore[1] + '-' + tempStore[0] + '-' + tempStore[2]
		  var date = new Date(date);
		  var hours = date.getHours();
		  var minutes = date.getMinutes();
		  var ampm = hours >= 12 ? 'pm' : 'am';
		  hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  const month = date.getMonth();
 
		  return date.getDate() + ' ' + monthNames[month] + ' ' + strTime;
	}
	$scope.init();
}]);

app.controller('AppDownloadCtrl', ['$scope','$http','$timeout' ,function ($scope, $http, $timeout) {
    $scope.getAppLink = function (routeUrl,num) {
        if ($scope.AppMobilenumber && $scope.AppMobilenumber.length == 10) {
            $http.get(appApiUrl+ $scope.AppMobilenumber ).then(function (response) {
                if (routeUrl.indexOf('IOS') != -1) {
                    $scope.message = response.data.lst1;
                } else {
                    $scope.message = response.data;
                     $timeout(function () {
                         $scope.AppMobilenumber='';
                         $scope.message = '';
                     }, 2000);
                }
            })
        } else {
            $scope.message = 'Please enter 10 digit mobile number.';
            $timeout(function () {
                $scope.message = '';
            }, 2500);
        }
    }
    
}]);
