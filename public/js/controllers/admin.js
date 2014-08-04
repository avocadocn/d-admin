'use strict';

var adminApp = angular.module('admin', ['ngRoute']);

adminApp.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/parameter', {
      templateUrl: '/manager/parameter',
      controller: 'ParameterController',
      controllerAs: 'parameter'
    })
    // .when('/dashboard', {
    //   templateUrl: '/public/views/dashboard.html',
    //   controller: 'DashboardController',
    //   controllerAs: 'dashboard'
    // })
    .when('/manager', {
      templateUrl: '/manager/home',
      controller: 'ManagerController',
      controllerAs: 'manager'
    })
    .when('/user', {
      templateUrl: '/manager/user',
      controller: 'UserController',
      controllerAs: 'user'
    })
    .when('/campaign', {
      templateUrl: '/manager/campaign',
      controller: 'CampaignController',
      controllerAs: 'campaign'
    })
    .when('/team', {
      templateUrl: '/manager/team',
      controller: 'TeamController',
      controllerAs: 'team'
    })
    .when('/region', {
      templateUrl: '/manager/region',
      controller: 'RegionController',
      controllerAs: 'region'
    })
    .when('/album', {
      templateUrl: '/manager/album',
      controller: 'AlbumController',
      controllerAs: 'album'
    })
    .when('/chart', {
      templateUrl: '/public/views/chart.html',
      controller: 'ChartController',
      controllerAs: 'chart',
    })
    .when('/message', {
      templateUrl: '/manager/message',
      controller: 'MessageController',
      controllerAs: 'message',
    })
    .when('/error', {
      templateUrl: '/manager/error',
      controller: 'ErrorController',
      controllerAs: 'error',
    }).
    otherwise({
      redirectTo: '/parameter'
    });
}]);

adminApp.filter('dateView', function() {
  return function(input) {
    var today = new Date();
    var date = new Date(input);
    var intervalMilli = date.getTime() - today.getTime();
    var xcts = parseInt(intervalMilli / (24 * 60 * 60 * 1000));
    var nowTime = (date.getHours()<10?('0'+date.getHours()):date.getHours())+':'+(date.getMinutes()<10?('0'+date.getMinutes()):date.getMinutes());
    // -2:前天 -1：昨天 0：今天 1：明天 2：后天， out：显示日期
    switch(xcts){
      case -2:
      return '前天'+nowTime;
      break;
      case -1:
      return '昨天'+nowTime;
      break;
      case 0:
      return '今天'+nowTime;
      break;
      case 1:
      return '明天'+nowTime;
      break;
      case 2:
      return '后天'+nowTime;
      break;
      default:
      return input;
    }
  }
});

adminApp.run(['$rootScope','$location', function ($rootScope,$location) {
  $rootScope.run = function() {
    $(document).ready(function(){
      $('#dataTable').dataTable();
    });
  };
}]);


adminApp.controller('UserController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    //返回第一个公司的所有员工
    $scope.first = true;
    $scope.company_selected = null;
    $scope.company_regx = {
      'value':''
    };
    $scope.searchCompany = function(all){
      try{
          $http({
              method: 'post',
              url: '/manager/search',
              data:{
                regx : $scope.company_regx.value,
                all : all
              }
          }).success(function(data, status) {
            if(data.result === 1){
              $scope.companies = data.companies;
              $scope.company_selected = data.companies[0];
              if($scope.first){
                $scope.getUser($scope.company_selected);
              }
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    }
    $scope.active = function(user,active){
      try{
          $http({
              method: 'post',
              url: '/user/active',
              data:{
                  _id : user._id,
                  operate : {'active':active}
              }
          }).success(function(data, status) {
            if(data.result === 1){
              for(var i = 0 ; i < $scope.users.length; i ++){
                if($scope.users[i]._id === user._id){
                  $scope.users[i].active = active;
                  break;
                }
              }
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    }
    //根据公司找到员工
    $scope.getUser = function(company) {
      try{
          $http({
              method: 'post',
              url: '/user/search',
              data:{
                  _id : company._id
              }
          }).success(function(data, status) {
            if(data.result === 1){
              $scope.users = data.users;
              if($scope.first){
                setTimeout(function(){$rootScope.run()},500);
                $scope.first = false;
              }
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };
    $scope.searchCompany(true);
}]);



adminApp.controller('TeamController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    //返回第一个公司的所有员工
    $scope.first = true;
    $scope.company_selected = null;
    $scope.company_regx = {
      'value':''
    };
    $scope.show_group = false;
    $scope.searchCompany = function(all){
      try{
          $http({
              method: 'post',
              url: '/manager/search',
              data:{
                regx : $scope.company_regx.value,
                all : all
              }
          }).success(function(data, status) {
            if(data.result === 1){
              $scope.companies = data.companies;
              $scope.company_selected = data.companies[0];
              if($scope.first){
                $scope.getTeam($scope.company_selected);
              }
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    }

    $scope.teamByGroup = function(all) {
      if(!$scope.show_group){
        try{
          $http({
              method: 'post',
              url: '/team/group',
              data:{
                cid : $scope.company_selected._id,
                all : all
              }
          }).success(function(data, status) {
            if(data.result === 1){
              
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
        }
        catch(e){
            console.log(e);
        }
      }else{
        $scope.show_group = false;
      }
    }
    //根据公司找到小队
    $scope.getTeam = function(company) {
      try{
          $http({
              method: 'post',
              url: '/team/search',
              data:{
                  _id : company._id
              }
          }).success(function(data, status) {
            if(data.result === 1){
              $scope.teams = data.teams;
              $scope.host = data.host;
              if($scope.first){
                setTimeout(function(){$rootScope.run()},500);
                $scope.first = false;
              }
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };
    $scope.searchCompany(true);
}]);



adminApp.controller('ErrorController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $http.get('/error/errorList').success(function(data, status) {
      if(data.result === 1){
        $scope.errors = data.error;
        console.log($scope.errors);
        setTimeout(function(){$rootScope.run()},500);
      }
    });
    $scope.delete = function(_id) {
       try{
          $http({
              method: 'post',
              url: '/error/delete',
              data:{
                  _id : _id
              }
          }).success(function(data, status) {
            if(data.result === 1){
              for(var i = 0 ; i < errors.length; i ++){
                if(errors[i]._id.toString() === _id){
                  errors.splice(i,1);
                  break;
                }
              }
            }
            //$('#companyDetailModal').modal();
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };
}]);


adminApp.controller('MessageController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $scope.content = {
      'text':""
    };
    $http.get('/message/sendlist').success(function(data, status) {
      $scope.send_messages = data.message_contents;
      setTimeout(function(){$rootScope.run()},500);
    });
    $scope.send = function() {
       try{
          $http({
              method: 'post',
              url: '/message/send',
              data:{
                  content : $scope.content.text
              }
          }).success(function(data, status) {
            $scope.send_messages = data.message_contents;
            //$('#companyDetailModal').modal();
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };
}]);

adminApp.controller('ParameterController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $scope.host = {
      'admin':'无',
      'product':'无'
    }
    $http.get('/admin/host/get').success(function(data, status) {
      $scope.host = data;
      if(!$scope.host.admin) {
        $scope.host = {
          'admin':'无',
          'product':'无'
        }
      }
      $http.get('/system/getcode').success(function (data, status) {
        $scope.codes = data.codes;
        $http.get('/system/getting').success(function (data, status) {
          if(data.result == 1){
            $scope.value = data.value;
            setTimeout(function(){$rootScope.run()},500);
          }
        });
      });
    });
    $scope.setHost = function(type,value) {
       try{
          $http({
              method: 'post',
              url: '/admin/host/set',
              data:{
                  host_type : type,
                  host_value : type == 0 ? $scope.host.admin : $scope.host.product
              }
          }).success(function(data, status) {
            window.location.reload();
            //$('#companyDetailModal').modal();
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };

    $scope.codeSetting = function(){
      $http({
          method: 'post',
          url: '/system/setting',
          data:{
            company_register_invite_code:$scope.value
          }
      }).success(function(data, status) {
        if(data.result == 1){
          $scope.value = data.value;
        }
      }).error(function(data, status) {
          alert('数据发生错误!');
      });
    }

    $scope.renderCode = function(){
      $http({
          method: 'post',
          url: '/system/createCompanyRegisterInviteCode'
      }).success(function(data, status) {
        if(data.result == 1){
          $scope.codes = data.codes;
        }
      }).error(function(data, status) {
          alert('数据发生错误!');
      });
    }
}]);


adminApp.controller('ManagerController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $scope.detail_show = false;

    $http.get('/manager/company').success(function(data, status) {
      $scope.companies = data;
      $scope.company_num=$scope.companies.length;
      setTimeout(function(){$rootScope.run()},500);
    });

    $scope.active = function(value,company_id){
      try{
        $http({
            method: 'post',
            url: '/manager/active',
            data:{
                operate : {
                  'status.active':value
                },
                _id : company_id
            }
        }).success(function(data, status) {
          if(data.result === 1){
            for(var i = 0 ; i < $scope.companies.length; i ++){
              if($scope.companies[i]._id === company_id){
                $scope.companies[i].status.active = value;
                break;
              }
            }
          }else{
            alert(data.msg);
          }
        });
      }
      catch(e){
          console.log(e);
      }
    }
    $scope.detailBoxShow = function(status) {
      $scope.detail_show = status;
    };
    $scope.sendActiveMail = function(who, name, company_id) {
       try{
          $http({
              method: 'post',
              url: '/manager/validate',
              data:{
                  who : who,
                  name : name,
                  _id : company_id
              }
          }).success(function(data, status) {
            window.location.reload();
            //$('#companyDetailModal').modal();
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };
    $scope.getDetail = function(company_id) {
      try{
          $http({
              method: 'post',
              url: '/manager/company/detail',
              data:{
                  _id : company_id
              }
          }).success(function(data, status) {
            $scope.info = data.info;
            $scope.detail_show = true;
            $scope.register_date = data.register_date;
            $scope.login_email = data.login_email;
            $('#companyDetailModal').modal();
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };
}]);


adminApp.controller('ChartController', ['$http','$scope',
  function ($http, $scope) {
    $scope.metisChart = function() {
      var d2 = [
        [0, 3],
        [1, 8],
        [2, 5],
        [3, 13],
        [4, 1]
      ];

      // a null signifies separate line segments
      var d3 = [
        [0, 12],
        [2, 2],
        [3, 9],
        [4, 4]
      ];

      $.plot($("#trigo"), [
        {data: d2, label: 'MAN'},
        {data: d3, label: 'WOMAN'}
      ], {
        clickable: true,
        hoverable: true,
        series: {
            lines: {show: true, fill: true, fillColor: {colors: [
                {opacity: 0.5},
                {opacity: 0.15}
            ]}},
            points: {show: true}
        }
      });

      $.plot($("#trigo2"), [
        {data: d2, label: 'BAR'}
      ], {
        clickable: true,
        hoverable: true,
        series: {
            bars: {show: true, barWidth: 0.6},
            points: {show: true}
        }
      });

      var parabola = [],
        parabola2 = [];
      for (var i = -5; i <= 5; i += 0.5) {
        parabola.push([i, Math.pow(i, 2) - 25]);
        parabola2.push([i, -Math.pow(i, 2) + 25]);
      }

      var circle = [];

      for (var c = -2; c <= 2.1; c += 0.1) {
        circle.push([c, Math.sqrt(400 - c * c * 100)]);
        circle.push([c, -Math.sqrt(400 - c * c * 100)]);
      }
      var daire = [3];
      $.plot($("#eye"), [
        {data: parabola2, lines: {show: true, fill: true}},
        {data: parabola, lines: {show: true, fill: true}},
        {data: circle, lines: {show: true}}
      ]);

      var heart = [];
      for (i = -2; i <= 5; i += 0.01) {
        heart.push([16 * Math.pow(Math.sin(i), 3), 13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i)]);
      }
      $.plot($("#heart"), [
        {data: heart, label: '<i class="fa fa-heart"></i>', color: '#9A004D'}
      ], {
        series: {
            lines: {show: true, fill: true},
            points: {show: false}

        },
        yaxis: {
            show: true
        },
        xaxis: {
            show: true
        }
      });
      $('#heart .legendLabel').addClass('animated pulse');
      setInterval(function () {
        $('#heart .legendLabel .fa.fa-heart').toggleClass('fa-2x');
      }, 400);


      var bernoulli = [];

      function lemniscatex(i) {
        return Math.sqrt(2) * Math.cos(i) / (Math.pow(Math.sin(i), 2) + 1);
      }

      function lemniscatey(i) {
        return Math.sqrt(2) * Math.cos(i) * Math.sin(i) / (Math.pow(Math.sin(i), 2) + 1);
      }

      for (var k = 0; k <= 2 * Math.PI; k += 0.01) {
        bernoulli.push([lemniscatex(k), lemniscatey(k)]);
      }
      $.plot($("#bernoilli"), [
        {data: bernoulli, label: 'Lemniscate of Bernoulli', lines: {show: true, fill: true}}
      ]);
    };
    $scope.metisChart();
}]);


adminApp.controller('RegionController', ['$http','$scope',
  function ($http, $scope) {

    $http.get('/region/province').success(function(data, status) {
      $scope.provinces = data;
      $scope.cities = $scope.provinces[0].city;
      $scope.districts = $scope.provinces[0].city[0].district;

      $scope.province_selected=$scope.provinces[0];
      $scope.province_new = $scope.province_selected.name;
      $scope.city_selected=$scope.cities[0];
      $scope.city_new = $scope.city_selected.name;
      $scope.district_selected=$scope.districts[0];
      $scope.district_new = $scope.district_selected.name;
    });

    var pid = '';
    var cid = '';

    $scope.province_new='';
    $scope.city_new='';
    $scope.district_new='';

    $scope.getCity = function(province) {
      pid = province.id;
      $scope.province_new = province.name;
      try{
          $http({
              method: 'post',
              url: '/region/city',
              data:{
                  province_id: pid
              }
          }).success(function(data, status) {
              $scope.cities = data;
              $scope.districts = [];
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };

    $scope.getDistrict = function(city) {
      cid = city.id;
      $scope.city_new = city.name;
      try{
          $http({
              method: 'post',
              url: '/region/district',
              data:{
                  province_id: pid,
                  city_id: cid
              }
          }).success(function(data, status) {
              $scope.districts = data;
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };

    $scope.getDistrictSelected = function(district){
      $scope.district_new = district.name;
    }

    $scope.add = function(type) {
      var address = '';
      var new_name = '';
      switch(type) {
        //添加省
        case 0:
          address = "/region/add/province";
          new_name = $scope.province_new;
          break;
        //添加市
        case 1:
          address = "/region/add/city";
          new_name = $scope.city_new;
          break;
        //添加区
        case 2:
          address = "/region/add/district";
          new_name = $scope.district_new;
          break;
        default:break;
      }
      try{
          $http({
              method: 'post',
              url: address,
              data:{
                  pid : pid,
                  cid : cid,
                  name: new_name,
                  _type: type
              }
          }).success(function(data, status) {
            window.location.reload();
            /*
            switch(type) {
              //添加省
              case 0:
                $scope.provinces.push({
                  'id':'null',
                  'name':new_name
                });
                $scope.cities = [];
                $scope.districts = [];
                break;
              //添加市
              case 1:
                $scope.cities.push({
                  'id':'null',
                  'name':new_name
                });
                $scope.districts = [];
                break;
              //添加区
              case 2:
                $scope.districts.push({
                  'id':'null',
                  'name':new_name
                });
                break;
              default:break;
            }
            */
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };

    $scope._edit = function(type,_id) {
      var address = '';
      var new_name = '';
      switch(type) {
        //添加省
        case 0:
          address = "/region/edit/province";
          new_name = $scope.province_new;
          break;
        //添加市
        case 1:
          address = "/region/edit/city";
          new_name = $scope.city_new;
          break;
        //添加区
        case 2:
          address = "/region/edit/district";
          new_name = $scope.district_new;
          break;
        default:break;
      }

      try{
          $http({
              method: 'post',
              url: address,
              data:{
                  pid : pid,
                  cid : cid,
                  id: _id,
                  _type: type,
                  name : new_name
              }
          }).success(function(data, status) {
            switch(type) {
              case 0:
                for(var i = 0; i < $scope.provinces.length; i++) {
                  if ($scope.provinces[i].id === _id) {
                    $scope.provinces[i].name = $scope.province_new;
                    break;
                  }
                }
                $scope.cities = [];
                $scope.districts = [];
                break;
              //修改市
              case 1:
                for(var i = 0; i < $scope.cities.length; i++) {
                  if ($scope.cities[i].id === _id) {
                    $scope.cities[i].name = $scope.city_new;
                    break;
                  }
                }
                $scope.districts = [];
                break;
              //修改区
              case 2:
                for(var i = 0; i < $scope.districts.length; i++) {
                  if ($scope.districts[i].id === _id) {
                    $scope.districts[i].name = $scope.district_new;
                    break;
                  }
                }
                break;
              default:break;
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }

    }

    $scope._delete = function(type,_id) {
      var address = '';
      switch(type) {
        //添加省
        case 0:
          address = "/region/delete/province";
          break;
        //添加市
        case 1:
          address = "/region/delete/city";
          break;
        //添加区
        case 2:
          address = "/region/delete/district";
          break;
        default:break;
      }

      try{
          $http({
              method: 'post',
              url: address,
              data:{
                  pid : pid,
                  cid : cid,
                  id: _id,
                  _type: type
              }
          }).success(function(data, status) {
            switch(type) {
              case 0:
                for(var i = 0; i < $scope.provinces.length; i++) {
                  if ($scope.provinces[i].id === _id) {
                    $scope.provinces.splice(i,1);
                    break;
                  }
                }
                $scope.cities = [];
                $scope.districts = [];
                break;
              //添加市
              case 1:
                for(var i = 0; i < $scope.cities.length; i++) {
                  if ($scope.cities[i].id === _id) {
                    $scope.cities.splice(i,1);
                    break;
                  }
                }
                $scope.districts = [];
                break;
              //添加区
              case 2:
                for(var i = 0; i < $scope.districts.length; i++) {
                  if ($scope.districts[i].id === _id) {
                    $scope.districts.splice(i,1);
                    break;
                  }
                }
                break;
              default:break;
            }
          }).error(function(data, status) {
              //TODO:更改对话框
              alert('数据发生错误！');
          });
      }
      catch(e){
          console.log(e);
      }
    };

    //$scope.formGeneral();
}]);









adminApp.controller('DashboardController', ['$http','$scope',
  function ($http, $scope) {
    $scope.dashboard = function() {
      //----------- BEGIN SPARKLINE CODE -------------------------*/
      // required jquery.sparkline.min.js*/

      /** This code runs when everything has been loaded on the page */
      /* Inline sparklines take their values from the contents of the tag */
      $('.inlinesparkline').sparkline();

      /* Sparklines can also take their values from the first argument
      passed to the sparkline() function */
      var myvalues = [10, 8, 5, 7, 4, 4, 1];
      $('.dynamicsparkline').sparkline(myvalues);

      /* The second argument gives options such as chart type */
      $('.dynamicbar').sparkline(myvalues, {type: 'bar', barColor: 'green'});

      /* Use 'html' instead of an array of values to pass options
      to a sparkline with data in the tag */
      $('.inlinebar').sparkline('html', {type: 'bar', barColor: 'red'});


      $(".sparkline.bar_week").sparkline([5, 6, 7, 2, 0, -4, -2, 4], {
        type: 'bar',
        height: '40',
        barWidth: 5,
        barColor: '#4d6189',
        negBarColor: '#a20051'
      });

      $(".sparkline.line_day").sparkline([5, 6, 7, 9, 9, 5, 4, 6, 6, 4, 6, 7], {
        type: 'line',
        height: '40',
        drawNormalOnTop: false
      });

      $(".sparkline.pie_week").sparkline([1, 1, 2], {
        type: 'pie',
        width: '40',
        height: '40'
      });

      $('.sparkline.stacked_month').sparkline(['0:2', '2:4', '4:2', '4:1'], {
        type: 'bar',
        height: '40',
        barWidth: 10,
        barColor: '#4d6189',
        negBarColor: '#a20051'
      });
      //----------- END SPARKLINE CODE -------------------------*/


      //----------- BEGIN FULLCALENDAR CODE -------------------------*/

      var date = new Date();
      var d = date.getDate();
      var m = date.getMonth();
      var y = date.getFullYear();

      var calendar = $('#calendar').fullCalendar({
        header: {
            left: 'prev,today,next,',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        selectable: true,
        selectHelper: true,
        select: function(start, end, allDay) {
            var title = prompt('Event Title:');
            if (title) {
                calendar.fullCalendar('renderEvent',
                        {
                            title: title,
                            start: start,
                            end: end,
                            allDay: allDay
                        },
                true // make the event "stick"
                        );
            }
            calendar.fullCalendar('unselect');
        },
        editable: true,
        events: [
            {
                title: 'All Day Event',
                start: new Date(y, m, 1),
                className: 'label label-success'
            },
            {
                title: 'Long Event',
                start: new Date(y, m, d - 5),
                end: new Date(y, m, d - 2),
                className: 'label label-info'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: new Date(y, m, d - 3, 16, 0),
                allDay: false,
                className: 'label label-warning'
            },
            {
                id: 999,
                title: 'Repeating Event',
                start: new Date(y, m, d + 4, 16, 0),
                allDay: false,
                className: 'label label-inverse'
            },
            {
                title: 'Meeting',
                start: new Date(y, m, d, 10, 30),
                allDay: false,
                className: 'label label-important'
            },
            {
                title: 'Lunch',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false
            },
            {
                title: 'Birthday Party',
                start: new Date(y, m, d + 1, 19, 0),
                end: new Date(y, m, d + 1, 22, 30),
                allDay: false
            },
            {
                title: 'Click for Google',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                url: 'http://google.com/'
            }
          ]
      });
      /*----------- END FULLCALENDAR CODE -------------------------*/



      /*----------- BEGIN CHART CODE -------------------------*/
      var sin = [], cos = [];
      for (var i = 0; i < 14; i += 0.5) {
        sin.push([i, Math.sin(i)]);
        cos.push([i, Math.cos(i)]);
      }

      var plot = $.plot($("#trigo"),
            [
                {
                    data: sin,
                    label: "sin(x)",
                    points: {
                        fillColor: "#4572A7",
                        size: 5
                    },
                    color: '#4572A7'
                },
                {
                    data: cos,
                    label: "cos(x)",
                    points: {
                        fillColor: "#333",
                        size: 35
                    },
                    color: '#AA4643'
                }
            ], {
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        grid: {
            hoverable: true,
            clickable: true
        },
        yaxis: {
            min: -1.2,
            max: 1.2
        }
      });

      function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#000',
            color: '#fff'
        }).appendTo("body").fadeIn(200);
      }

      var previousPoint = null;
      $("#trigo").bind("plothover", function(event, pos, item) {
        $("#x").text(pos.x.toFixed(2));
        $("#y").text(pos.y.toFixed(2));

        if (item) {
            if (previousPoint !== item.dataIndex) {
                previousPoint = item.dataIndex;

                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                showTooltip(item.pageX, item.pageY,
                        item.series.label + " of " + x + " = " + y);
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }
      });
      /*----------- END CHART CODE -------------------------*/

      /*----------- BEGIN TABLESORTER CODE -------------------------*/
      /* required jquery.tablesorter.min.js*/
      $(".sortableTable").tablesorter();
      /*----------- END TABLESORTER CODE -------------------------*/
    }
    $scope.dashboard();
}]);