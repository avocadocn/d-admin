'use strict';

var adminApp = angular.module('admin', ['ngRoute','datatables']);

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
      templateUrl: '/manager/template/manager',
      controller: 'ManagerController',
      controllerAs: 'manager'
    })
    .when('/user', {
      templateUrl: '/manager/template/user',
      controller: 'UserController',
      controllerAs: 'user'
    })
    .when('/interaction', {
      templateUrl: '/manager/template/interaction',
      controller: 'InteractionController',
      controllerAs: 'interaction'
    })
    .when('/team', {
      templateUrl: '/manager/template/team',
      controller: 'TeamController',
      controllerAs: 'team'
    })
    // .when('/department', {
    //   templateUrl: '/manager/template/department',
    //   controller: 'DepartmentController',
    //   controllerAs: 'department'
    // })
    .when('/region', {
      templateUrl: '/manager/template/region',
      controller: 'RegionController',
      controllerAs: 'region'
    })
    // .when('/chart', {
    //   templateUrl: '/public/views/chart.html',
    //   controller: 'ChartController',
    //   controllerAs: 'chart',
    // })
    .when('/message', {
      templateUrl: '/manager/template/message',
      controller: 'MessageController',
      controllerAs: 'message',
    })
    .when('/error', {
      templateUrl: '/manager/template/error',
      controller: 'ErrorController',
      controllerAs: 'error',
    })
    .when('/app', {
      templateUrl: '/manager/template/app',
      controller: 'AppController',
      controllerAs: 'app',
    })
    .when('/report', {
      templateUrl: '/manager/template/report',
      controller: 'ReportController',
      controllerAs: 'report',
    })
    .when('/component',{
      templateUrl: '/manager/template/component',
      controller:'ComponentController',
      controllerAs: 'component',
    })
    .when('/mold',{
      templateUrl: '/manager/template/mold',
      controller:'MoldController',
      controllerAs:'mold',
    })
    .when('/log',{
      templateUrl: '/manager/template/log',
      controller:'LogController',
      controllerAs:'log',
    })
    .when('/push_log',{
      templateUrl: '/manager/template/push_log',
      controller:'PushLogController'
    })
    .when('/easemob',{
      templateUrl: '/manager/template/easemob',
      controller:'EasemobController'
    })
    .when('/interactionTemplate',{
      templateUrl: '/manager/template/interaction_template',
      controller:'interactionTemplateController',
      resolve:{
        templates:function($http) {
          return $http({
            method: 'get',
            url: '/interaction/template?limit=0&templateType=1'
          }).then(function(data, status) {
            return data.data
          });
        }
      }
    })
    
    .otherwise({
      redirectTo: '/parameter'
    });
}]);

adminApp.filter('templateFilter', function() {
  return function(input) {
    switch(input){
      case '1':
        return '活动';
        break;
      case '2':
        return '投票';
        break;
      case '3':
        return '求助';
        break;
      default:
        return input;
    }
  }
});
adminApp.filter('logType', function() {
  return function(input) {
    switch(input){
      case 'userlog':
        return '用户登录';
        break;
      case 'joinCampaign':
        return '参加活动';
        break;
      default:
        return input;
    }
  }
});
adminApp.filter('dateView', function() {
  return function(input) {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    var date = new Date(input);
    var intervalMilli = date.getTime() - today.getTime();
    var xcts = Math.floor(intervalMilli / (24 * 60 * 60 * 1000));
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
adminApp.filter('day', function() {
  return function(input) {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    var date = new Date(input);
    var intervalMilli = date.getTime() - today.getTime();
    var xcts = Math.floor(intervalMilli / (24 * 60 * 60 * 1000));
    // -2:前天 -1：昨天 0：今天 1：明天 2：后天， out：显示日期
    switch(xcts){
    // case -2:
    //   return '前天';
    case -1:
      return '昨天';
    case 0:
      return '今天';
    case 1:
      return '明天';
    // case 2:
    //   return '后天';
    default:
      return (date.getMonth() + 1) + '-' + date.getDate();
    }
  }
});
adminApp.filter('week', function() {
  return function(input) {
    // input will be ginger in the usage below
    switch(new Date(input).getDay()){
      case 0:
      input = '周日';
      break;
      case 1:
      input = '周一';
      break;
      case 2:
      input = '周二';
      break;
      case 3:
      input = '周三';
      break;
      case 4:
      input = '周四';
      break;
      case 5:
      input = '周五';
      break;
      case 6:
      input = '周六';
      break;
      default:
      input = '';
    }
    return input;
  }
});
adminApp.filter('reportMap', function() {
  var manageReportMap = function(reportType){
    var _outPut;
    switch(reportType){
      case 0:
        _outPut = '淫秽色情';
      break;
      case 1:
        _outPut = '敏感信息';
      break;
      case 2:
        _outPut = '垃圾营销';
      break;
      case 3:
        _outPut = '诈骗';
      break;
      case 4:
        _outPut = '人身攻击';
      break;
      case 5:
        _outPut = '泄露我的隐私';
      break;
      case 6:
        _outPut = '虚假资料';
      break;
      default:
        _outPut = '';
    }
    return _outPut;
  }
  return function(mapType) {
    // input will be ginger in the usage below
    var outPut;
    if (Object.prototype.toString.call(mapType) === '[object Array]'){
      outPut = [];
      mapType.forEach(function(value){
        outPut.push(manageReportMap(value));
      });
      outPut = outPut.join();
    }
    else{
      outPut = manageReportMap(mapType);
    }
    return outPut;
  }
});
adminApp.filter('reportStatusMap', function() {
  return function(reportStatus) {
    var _outPut;
    switch(reportStatus){
      case 'verifying':
        _outPut = '待审核';
      break;
      case 'active':
        _outPut = '已处理';
      break;
      case 'inactive':
        _outPut = '已忽略';
      break;
      default:
        _outPut = '';
    }
    return _outPut;
  }
});
adminApp.factory('imageService', function() {
  return {

      dataURItoBlob: function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
          byteString = atob(dataURI.split(',')[1]);
        else
          byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to a typed array
        // var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {
          type: mimeString
        });
      }

    };
});
adminApp.service('mapSevice', ['$q', function($q) {
  var hasInit = false;
  var loading = false;
  var _AMap;
  var maxRetryTime = 5;
  var hasGetLocalCity = false;
  var searchRes;
  var initCity = function(AMap) {
    var deferred = $q.defer();

    //加载城市查询插件
    AMap.service(["AMap.CitySearch"], function() {
      //实例化城市查询类
      var citysearch = new AMap.CitySearch();
      //自动获取用户IP，返回当前城市
      citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.city && result.bounds) {
            hasGetLocalCity = true;
            searchRes = result;
            deferred.resolve(searchRes);
          }
        }
        else {
          deferred.reject(result);
        }
      });
    });

    return deferred.promise;
  };

  return {
    /**
     * 使用地图进行工作
     * @param  {Function} callback function(err, AMap)
     */
    work: function() {
      var deferred = $q.defer();
      if (!hasInit) {
        hasInit = true;
        loading = true;

        var initialize = function() {
          // 这其实并不是好的做法，无中生有一个全局变量
          // 如果这个初始化的回调函数提供一个AMap参数就好多了
          _AMap = AMap;
          loading = false;
          deferred.resolve(AMap);
        };

        window.initialize = initialize;
        var script = document.createElement('script');
        script.src = 'http://webapi.amap.com/maps?v=1.3&key=077eff0a89079f77e2893d6735c2f044&callback=initialize';
        document.body.appendChild(script);
      }
      else {
        if (loading) {
          var retryCount = 0;

          function retry() {
            if (loading) {
              if (retryCount < maxRetryTime) {
                setTimeout(function() {
                  retry();
                  retryCount++;
                }, 500);
              }
              else {
                deferred.reject(new Error('加载地图超时'));
              }
            }
            else {
              deferred.resolve(_AMap);
            }
          }
          retry();
        }
        else {
          deferred.resolve(_AMap);
        }
      }

      return deferred.promise;
    },

    /**
     * 获取当前城市信息
     */
    getLocalCity: function() {
      return $q.when(function(resolve, reject) {
        if (hasGetLocalCity) {
          resolve(searchRes);
        }
        else {
          initCity(_AMap).then(resolve, reject);
        }
      });
    }

  };
}]);
adminApp.directive('mapSearch', ['mapSevice', '$q', function(mapSevice, $q) {

  var link = function(scope, ele, attrs, ctrl) {
    var controller = {};
    var map;
    var marker;
    var remarkCallback;

    /**
     * 搜索城市，在页面元素中显示，并且在回调中返回搜索结果
     * @param  {String}   locationName 位置名称
     * @return {Promise}
     */
    controller.search = function(locationName) {
      var deferred = $q.defer();

      mapSevice.work().then(function(AMap) {
        if (!map) {
          var mapEle = ele[0];
          map = new AMap.Map(mapEle, {
            resizeEnable: true
          });
          map.setFitView();
        }

        map.plugin(["AMap.ToolBar"],function(){
          var toolBar = new AMap.ToolBar();
          map.addControl(toolBar);
        });

        AMap.service(["AMap.PlaceSearch"], function() {
          var placeSearch;
          mapSevice.getLocalCity().then(function(res) {
            // 搜索城市成功
            placeSearch = new AMap.PlaceSearch({city: res.city});
            doSearch(placeSearch);
          }, function(err) {
            placeSearch = new AMap.PlaceSearch();
            doSearch(placeSearch);
          });
        });

        function doSearch(placeSearch) {
          placeSearch.search(locationName, function(status, result) {
            switch(status) {
            case 'complete':
              var point = result.poiList.pois[0].location;
              var lnglat = new AMap.LngLat(point.getLng(), point.getLat());
              map.setCenter(lnglat);

              if (!marker) {
                marker = new AMap.Marker({
                  map: map,
                  position: lnglat,
                  draggable: true
                });
                AMap.event.addListener(marker, 'dragend', remarkCallback);
              }
              else {
                marker.setPosition(lnglat);
              }

              map.setFitView();
              deferred.resolve(result.poiList.pois[0]);
              break;
            case 'error':
              deferred.reject(result);
              break;
            case 'no_data':
              deferred.resolve(null);
              break;
            default:
              deferred.resolve(null);
            }
          });
        }
      }, deferred.reject);

      return deferred.promise;
    };

    controller.onRemark = function(callback) {
      remarkCallback = callback;
    };

    scope.$watch('ctrl', function(ctrl,oldCtrl) {
      if (ctrl) {
        for (var key in controller) {
          ctrl[key] = controller[key];
        }
      }
    });



  };

  return {
    restrict: 'E',
    replace: true,
    template: '<div class="dl_map"></div>',
    scope: {
      ctrl: '='
    },
    link: link
  };
}]);
adminApp.run(['$rootScope','$location',function ($rootScope,$location) {
  $rootScope.run = function() {
    $(document).ready(function(){
      $('#dataTable').dataTable();
    });
  };
  $rootScope.staticUrl = $location.protocol() +"://"+ $location.host() + ($location.host()==="localhost" ? ":3000":"");
}]);


var colorGenerator = function(){
  var base = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
  var COLOR = "#";
  for(var i = 0; i < 6; i ++){
    COLOR += base[parseInt(Math.random()*10)];
  }
  return COLOR;
}

adminApp.controller('ComponentController',['$http','$scope',function ($http, $scope) {
  $http.get('/component/componentlist').success(function(data, status) {
    $scope.components = data;
  });
  $scope.newcomponent = {};
  $scope.addComponent = function(){
    $http.post('/component/addComponent',$scope.newcomponent).success(function(data,status){
      if(data.result===1)
        window.location.reload();
      else
        alert(data.msg);
    });
  };
  $scope.activate = function(index,value){
    $http.post('/component/activate',{'id':$scope.components[index]._id,'value':value}).success(function(data,status){
      if(data.result===1)
        // window.location.reload();
        $scope.components[index].enable=value;
      else
        alert(data.msg);
    });
  };
  $scope.delete = function(index){
    if(confirm('慎重!!按了确定真的会删数据库数据!!')){
      $http.delete('/component/delete/'+$scope.components[index]._id).success(function(data,status){
        if(data.result===1)
          window.location.reload();
        else
          alert(data.msg);
      });
    }
  };
}]);

adminApp.controller('MoldController',['$http','$scope',function ($http, $scope) {
  
  $http.get('/mold/moldList').success(function(data,status){
    $scope.molds = data.molds;
  });

  $scope.addMold = function(){
    $http.post('/mold/addMold',{'name':$scope.newMold}).success(function(data,status){
        if(data.result===1)
          window.location.reload();
        else
          alert(data.msg);
    });
  };

  $scope.activate = function(index,value){
    $http.post('/mold/activate',{'id':$scope.molds[index]._id,'value':value}).success(function(data,status){
      if(data.result===1)
        $scope.molds[index].enable = value;
      else
        alert(data.msg);
    });
  };

  $scope.delete = function(index){
    if(confirm('慎重!!按了确定真的会删数据库数据!!')){
      $http.delete('/mold/delete/'+$scope.molds[index]._id).success(function(data,status){
        if(data.result===1)
          window.location.reload();
        else
          alert(data.msg);
      });
    };
  };

  //todo
  $scope.save = function(){
    $http.post('/mold/saveMold',$scope.editingMold).success(function(data,status){
      alert(data.msg);
      if(data.result===1)
        window.location.reload();
    });
  };

  $scope.editMold = function(index){
    $http.get('/mold/editMold/'+$scope.molds[index]._id).success(function(data,status){
      $scope.editingMold = data;
      $('#editMoldModal').modal();
    });
  }
}]);

adminApp.controller('AppController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    //返回第一个公司的所有员工
    $scope.first = true;
    $scope.company_selected = null;
    $scope.push_status = {
      value:'on'
    };

    $scope.baidu = {
      ak:'',
      sk:''
    }

    var defaultApn = {
      dev: {
        push: {
          gateway: 'gateway.sandbox.push.apple.com',
          port: '2195'
        },
        feedback: {
          gateway: 'feedback.sandbox.push.apple.com',
          port: '2196',
          interval: 60
        }
      },
      pro: {
        push: {
          gateway: 'gateway.push.apple.com',
          port: '2195'
        },
        feedback: {
          gateway: 'feedback.push.apple.com',
          port: '2196',
          interval: 60
        }
      }
    };

    $scope.apnModeOptions = ['dev', 'pro'];
    $scope.apnModeCurrentSelectd = '';

    $scope.$watch('apnModeCurrentSelectd', function (newVal) {
      if (newVal) {
        switch (newVal) {
        case 'dev':
          $scope.apnSettings = defaultApn.dev;
          break;
        case 'pro':
          $scope.apnSettings = defaultApn.pro;
          break;
        }
      }
    })

    $scope.apnSettings = {
      push: {
        gateway: String,
        port: String
      },
      feedback: {
        gateway: String,
        port: String,
        interval: Number // 获取推送结果的间隔，单位为秒
      },
      cert_path: String,
      key_path: String,
      passphrase: String
    };

    $scope.app_users = [];

    var god = function(scope,per,http,path,operate,method){
      try{
          http({
              method: method,
              url: '/app/'+path,
              data:{
                data : scope[per],
                operate : operate
              }
          }).success(function(data, status) {
            if(data.result === 1){
              scope[per] = data.data;
            }else{
              alert(data.msg);
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
    //用户设备信息
    $scope.info = function(){
      god($scope,'app_users',$http,'info','get','get');
    }

    //百度推送设置
    $scope.baidu = function(operate){
      god($scope,'baidu',$http,'baidu',operate,'post');
    }

    $scope.pushConfig = function(operate){
      god($scope,'push_status',$http,'config',operate,'post');
    }

    $scope.info();
    $scope.baidu('get');
    $scope.pushConfig('get');


    var getApnSettings = function () {
      $http.get('/app/apn')
        .success(function (data, status, headers, config) {
          $scope.apnSettings = data.apn;
          defaultApn.dev.cert_path = data.devPemPath.certPath;
          defaultApn.dev.key_path = data.devPemPath.keyPath;
          defaultApn.pro.cert_path = data.proPemPath.certPath;
          defaultApn.pro.key_path = data.proPemPath.keyPath;
        })
        .error(function (data, status, headers, config) {
          alert('获取推送设置失败');
        });
    };
    getApnSettings();

    $scope.setApnSettings = function () {
      $http.post('/app/apn', { apn: $scope.apnSettings })
        .success(function (data, status, headers, config) {
          alert(data.msg);
        })
        .error(function (data, status, headers, config) {
          alert(data.msg || '设置失败');
        });
    };

}]);




// adminApp.controller('DepartmentController', ['$http','$scope','$rootScope',
//   function ($http, $scope, $rootScope)
// ])
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
    $scope.active = function(user,disabled){
      try{
          $http({
              method: 'post',
              url: '/user/active',
              data:{
                  _id : user._id,
                  operate : {'disabled':disabled}
              }
          }).success(function(data, status) {
            if(data.result === 1){
              for(var i = 0 ; i < $scope.users.length; i ++){
                if($scope.users[i]._id === user._id){
                  $scope.users[i].disabled = disabled;
                  //console.log($scope.users);
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

    $scope.userToLower = function (){
      try{
        $http.get('/user/tolower').success(function(data,status) {
          alert('success');
        }).error(function(data,status){
          alert('error');
        });
      }
      catch(e){
        console.log(e);
      }
    }
}]);







var chartGenerator = function(data,length_property,label_property,ctxPie,ctxBar){
  var dataForPie = [];
  var dataForBar = {
    labels:[],
    datasets: [
      {
        label: "CHART",
        fillColor: "rgba(220,220,220,0.5)",
        strokeColor: "rgba(220,220,220,0.8)",
        highlightFill: "rgba(220,220,220,0.75)",
        highlightStroke: "rgba(220,220,220,1)",
        data: []
      }
    ]
  };
  for(var i = 0;i < data.length; i ++){

    dataForBar.labels.push(data[i][label_property]);
    dataForBar.datasets[0].data.push(length_property ? data[i][length_property].length : data.length);

    dataForPie.push({
      value : length_property ? data[i][length_property].length : data.length,
      color: colorGenerator(),
      highlight: colorGenerator(),
      label:data[i][label_property]
    });
    data[i].color = dataForPie[i].color;
  }
  var optionsForPie = {
    segmentShowStroke : true,
    segmentStrokeColor : "#fff",
    segmentStrokeWidth : 2,
    percentageInnerCutout : 50, // This is 0 for Pie charts
    animationSteps : 100,
    animationEasing : "easeOutBounce",
    animateRotate : true,
    animateScale : false,
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  };
  var optionsForBar = {
    scaleBeginAtZero : true,
    scaleShowGridLines : true,
    scaleGridLineColor : "rgba(0,0,0,.05)",
    scaleGridLineWidth : 1,
    barShowStroke : true,
    barStrokeWidth : 2,
    barValueSpacing : 5,
    barDatasetSpacing : 1,
    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
  };
  var myPieChart = new Chart(ctxPie);
  var myBarChart = new Chart(ctxBar);
  myPieChart.Pie(dataForPie,optionsForPie);
  myBarChart.Bar(dataForBar,optionsForBar);
}


adminApp.controller('TeamController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    //返回第一个公司的所有员工
    $scope.first = true;
    $scope.company_selected = null;
    $scope.company_regx = {
      'value':''
    };

    $scope.show_group_caption = '所有公司的小队类型分布';

    $scope.group_selecteds = [{
      'name':'所有公司',
      'id':0
    },{
      'name':'单个公司',
      'id':1
    }];
    $scope.group_selected = $scope.group_selecteds[0];


    $scope.getDetail = function(teamId) {
      try{
          $http({
              method: 'post',
              url: '/user/team',
              data:{
                teamId : teamId
              }
          }).success(function(data, status) {
            if(data.result == 1){
              $scope.members = data.team.member;
              try{
                  $http({
                      method: 'post',
                      url: '/campaign/team',
                      data:{
                        teamId : teamId
                      }
                  }).success(function(data, status) {
                    if(data.result == 1){
                      $scope.campaigns = data.campaigns;
                      $('#teamDetailModal').modal();
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

    $scope.statisticsSelect = function(option){
      if(option.id == 0){
        $scope.show_group_caption = '所有公司的小队类型分布';
        $scope.teamByGroup(true);
      }
      if(option.id == 1){
        $scope.show_group_caption = $scope.company_selected.name + '的小队类型分布';
        $scope.teamByGroup(false);
      }
    }
    $scope.teamByGroup = function(all) {
      var ctxPie = $("#pie").get(0).getContext("2d");
      var ctxBar = $("#bar").get(0).getContext("2d");
      if(!$scope.show_group){
        try{
          $http({
              method: 'post',
              url: '/team/group',
              data:{
                cid : $scope.company_selected ? $scope.company_selected._id : null,
                all : all
              }
          }).success(function(data, status) {
            if(data.result === 1){
              $scope.team_by_group = data.team_by_group;
              chartGenerator($scope.team_by_group,'teams','group_type',ctxPie,ctxBar);
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
              $scope.first = false;
            }

            if($scope.group_selected.id == 1){
              $scope.teamByGroup(false);
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
    $scope.teamByGroup(true);
    $scope.teamAddCity =function(){
      try{
        $http.post('/team/addCity').success(function(data,status){
          if(data.result===1){
            alert('成功');
          }else{
            alert('失败');
          }
        }).error(function(data,status){
          alert('失败');
        });
      }
      catch(e){
        console.log(e);
      }
    };
}]);


adminApp.controller('InteractionController', ['$http','$scope','$rootScope','$timeout',
  function ($http, $scope, $rootScope, $timeout) {
    $("#start_time").datetimepicker({
      autoclose: true,
      language: 'zh-CN'
    }).on("changeDate",function (ev) {
      if(ev.date) {
        var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
        $scope.startTime = moment(dateUTC).format("YYYY-MM-DD HH:mm");
        $('#end_time').datetimepicker('setStartDate', dateUTC);
      }

    });
    $("#end_time").datetimepicker({
      autoclose: true,
      language: 'zh-CN'
    }).on("changeDate",function (ev) {
      if(ev.date) {
        var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
        $scope.endTime = moment(dateUTC).format("YYYY-MM-DD HH:mm");
        $('#start_time').datetimepicker('setEndDate', dateUTC);
      }
    });
    $scope.interactionType =1;
    $scope.companySelected;
    $scope.companyRegx = {
      'value':''
    };
    $scope.companyName ={};
    $scope.formatCompany  = function(cid) {
      if($scope.companyName[cid])
        return $scope.companyName[cid];
      for (var i = $scope.companies.length - 1; i >= 0; i--) {
        if($scope.companies[i]._id===cid) {
          $scope.companyName[cid] = $scope.companies[i].name
          return $scope.companies[i].name;
        }
      };
      return cid;
    }
    $scope.clearStartTime = function() {
      $scope.startTime = null;
    }
    $scope.clearEndTime = function() {
      $scope.endTime =null;
    }
    $scope.clearCompany = function() {
      $scope.companySelected =null;
    }
    $scope.detail = function(index) {
      $scope.interactionDetail = $scope.interactions[index];
      $('#interactionDetailModal').modal();
    }
    $scope.searchCompany = function(all,callback){
      try{
        $http.post('/manager/search',
          {
            regx : $scope.companyRegx.value,
            all : all
          }
        ).success(function(data, status) {
          if(data.result === 1){
            $scope.companies = data.companies;
            callback()
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
    //根据公司找到活动
    $scope.getInteraction = function() {
      try{
        $http.get('/interaction', {
          params:{
            type: $scope.interactionType,
            cid : $scope.companySelected ? $scope.companySelected._id :null,
            startTime: $scope.startTime,
            endTime: $scope.endTime
          }
        }).success(function(data, status) {
          $scope.interactions = data;
        }).error(function(data, status) {
            //TODO:更改对话框
            alert(data.msg);
        });
      }
      catch(e){
          console.log(e);
      }
    };
    $scope.searchCompany(true,function(){
      $scope.getInteraction();
    });
}]);



adminApp.controller('ErrorController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $http.get('/error/errorList').success(function(data, status) {
      if(data.result === 1){
        $scope.errors = data.error;
        $scope.errors.forEach(function(log) {
          if (log.error && log.error.body) {
            log.errorLines = log.error.body.split(/\n/g);
          } else {
            log.errorLines = [];
          }
        });
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
              for(var i = 0 ; i < $scope.errors.length; i ++){
                if($scope.errors[i]._id.toString() === _id){
                  $scope.errors.splice(i,1);
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
    };
}]);


adminApp.controller('MessageController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $scope.content = {
      'text':""
    };
    $http.get('/message/sendlist').success(function(data, status) {
      $scope.send_messages = data.message_contents;
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
    $scope.code_open = {
      value : ''
    };
    $scope.host = {
      'admin':'无',
      'product':'无'
    };
    $http.get('/admin/host/get').success(function(data, status) {
      if (data.admin) {
        $scope.host.admin = data.admin;
      }
      if (data.product) {
        $scope.host.product = data.product;
      }
      $http.get('/system/getcode').success(function (data, status) {
        $scope.codes = data.codes;
        $http.get('/system/getting').success(function (data, status) {
          if(data.result == 1){
            $scope.code_open.value = data.value.toString();
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
                  //host_value : type == 0 ? $scope.host.admin : $scope.host.product
                  host_value: value
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

    $scope.changeCodeOpen = function(value){
      $scope.code_open.value = value.toString();
      $scope.codeSetting();
    }
    $scope.codeSetting = function(){
      $http({
          method: 'post',
          url: '/system/setting',
          data:{
            company_register_invite_code: ($scope.code_open.value == 'false' || $scope.code_open.value == false) ? false : true
          }
      }).success(function(data, status) {
        if(data.result == 1){
          $scope.code_open.value = data.value.toString();
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

    $http.get('/admin/smtp').success(function (data, status) {
      if (data.result === 1) {
        $scope.smtp = data.smtp;
      } else {
        alert(data.msg);
      }
    }).error(function (data, status) {
      alert('数据发生错误!');
    });

    $scope.setSMTP = function () {
      $http.post('/admin/smtp', { smtp: $scope.smtp }).success(function (data, status) {
        if (data.result === 1) {
          alert('设置成功');
        } else {
          alert(data.msg);
        }
      }).error(function (data, status) {
        alert('数据发生错误!');
      });

    };
    $scope.genarateQrcode = function () {
      $http.post('/admin/generateqrcode').success(function (data, status) {
        if (data.result === 1) {
          alert('生成成功');
        } else {
          alert(data.msg);
        }
      }).error(function (data, status) {
        alert('数据发生错误!');
      });

    };
    $scope.reGenerateRank = function () {
      $scope.reGenerating = true;
      $http.post('/system/rankUpdate').success(function (data, status) {
        alert('重新生成成功');
        $scope.reGenerating = false;
      }).error(function (data, status) {
        alert('重新生成失败');
        $scope.reGenerating = false;
      })
    }

}]);


adminApp.controller('ManagerController', ['$http','$scope','$rootScope', 'DTOptionsBuilder','imageService',
  function ($http, $scope, $rootScope, DTOptionsBuilder,imageService) {
    $scope.detail_show = false;
    $scope.nameEdit = false;
    $scope.domainEdit = false;

    $scope.dtOptions = DTOptionsBuilder.newOptions()
          .withOption('order', [1, 'desc']);

    $http.get('/manager/company').success(function(data, status) {
      $scope.companies = data;
      for(var i = 0; i < $scope.companies.length; i ++){
        $scope.companies.edit = false;
      }
      $scope.company_num=$scope.companies.length;
    });

    //修改公司名
    $scope.editName = function(){
      $scope.nameEdit = !$scope.nameEdit;
    }
    $scope.saveName = function(){
      try{
        $http({
            method: 'post',
            url: '/manager/edit/name',
            data:{
                name: $scope.info.name,
                _id : $scope.cid
            }
        }).success(function(data, status) {
          if(data.result === 1){
            for(var i = 0 ; i < $scope.companies.length; i ++){
              if($scope.companies[i]._id = $scope.cid){
                $scope.companies[i].info.name = $scope.info.name;
                break;
              }
            }
            $scope.nameEdit = false;
          }else{
            alert(data.msg);
          }
        });
      }
      catch(e){
          console.log(e);
      }
    }


    $scope.active = function(value,company_id){
      try{
        $http({
            method: 'post',
            url: '/manager/active',
            data:{
                active: value,
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
          $scope.cid = company_id;
          $scope.detail_show = true;
          $scope.register_date = data.register_date;
          $scope.nameEdit = false;
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

    $scope.newCompany = {
      province: '上海市',
      city: '上海市',
      district: '宝山区'
    };
    var cropper = $('#image_cropper').cropit({
      onFileChange: function () {
        $scope.isUploading = true;
        $scope.$digest();
      },
      imageBackground: true
    });

    $scope.isUploading = false;
    var cropitImageInput = $('#cropit_image_input');
    $scope.selectLogo = function () {
      cropitImageInput.click();
    };
    $scope.createCompany = function() {
      $http({
        method: 'POST',
        url: '/manager/company',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: $scope.newCompany,
        transformRequest: function (data, headersGetter) {
          var formData = new FormData();
          angular.forEach(data, function (value, key) {
              formData.append(key, value);
          });
          var dataURI = cropper.cropit('export');
          if(dataURI) {
            var blob = imageService.dataURItoBlob(dataURI);
            formData.append('photo', blob);
          }
          var headers = headersGetter();
          delete headers['Content-Type'];
          return formData;
        }
      })
      .success(function (data) {
        alert('成功');
        window.location.reload();
      })
      .error(function (data, status) {
        alert(data.msg);
      });
    };

    $scope.showPoint = function(cid) {
      $('#pointAdmin').modal();
      $http.get('/users/company/' + cid).success(function(data, status) {
        $scope.users = data;
      }).error(function(data, status) {
        alert('获取用户失败');
      });
    };

    $scope.appointReady = function(index, type) {
      var tip = type === 1 ? '确认要指定TA为校园大使吗？' : '确认要取消指定TA为校园大使吗？';
      var role = type === 1 ? 'SuperAdmin' : 'Student';
      if(confirm(tip)) {
        $http.post('/user/'+$scope.users[index]._id + '/superadmin', {role:role}).success(function(data, status) {
          $scope.users[index].role = role;
          alert('操作成功');
        }).error(function(data, status) {
          alert('操作失败');
        })
      }
    };

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
      pid = $scope.province_selected.id;
      cid = $scope.city_selected.id;
    });

    var pid = '';
    var cid = '';

    $scope.province_new='';
    $scope.city_new='';
    $scope.district_new='';

    $scope.getCity = function(province) {
      pid = province.id;
      $scope.province_new = province.name;
      // try{
      //     $http({
      //         method: 'post',
      //         url: '/region/city',
      //         data:{
      //             province_id: pid
      //         }
      //     }).success(function(data, status) {
      //         $scope.cities = data;
      //         $scope.districts = [];
      //     }).error(function(data, status) {
      //         //TODO:更改对话框
      //         alert('数据发生错误！');
      //     });
      // }
      // catch(e){
      //     console.log(e);
      // }
      $scope.cities = province.city;
      $scope.city_selected=$scope.cities[0];
      $scope.city_new = $scope.city_selected.name;
      $scope.districts = $scope.city_selected.district;
      $scope.district_selected = $scope.districts[0];
      $scope.district_new = $scope.district_selected.name;
    };

    $scope.getDistrict = function(city) {
      cid = city.id;
      $scope.city_new = city.name;
      // try{
      //     $http({
      //         method: 'post',
      //         url: '/region/district',
      //         data:{
      //             province_id: pid,
      //             city_id: cid
      //         }
      //     }).success(function(data, status) {
      //         $scope.districts = data;
      //     }).error(function(data, status) {
      //         //TODO:更改对话框
      //         alert('数据发生错误！');
      //     });
      $scope.districts = city.district;
      $scope.district_selected = $scope.districts[0];
      $scope.district_new = $scope.district_selected.name;
      // }
      // catch(e){
      //     console.log(e);
      // }
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

adminApp.controller('ReportController', ['$http','$scope',
  function ($http, $scope) {
    $scope.report_statuses = [ {name:'verifying',view:'待审核'},
                            {name:'active',view:'已处理'},
                            {name:'inactive',view:'已忽略'}
                          ];
    $scope.report_types = [ {name:'user',view:'用户'},
                            {name:'comment',view:'评论'}
                          ];
    $scope.select_status = $scope.report_statuses[0].name;
    $scope.select_type = $scope.report_types[0];

    $scope.getReport = function(select_status){
      if(!$scope.select_type.name||!$scope.select_status){
        return;
      }
      $http.get('/report/get/'+$scope.select_type.name+'/'+$scope.select_status).success(function(data, status) {
        if(data.result === 1){
          $scope.reports = data.reports;
        }
      });
    }
    $scope.detail = function(index) {
      $http({
          method: 'post',
          url: '/report/contentDetail',
          data:{
              host_id : $scope.reports[index]._id.id,
              host_type : $scope.reports[index]._id.host_type
          }
      }).success(function(data, status) {
        if(data.result === 1){
          $scope.reportContent = {
            report_type:$scope.reports[index]._id.host_type,
            content:data.content
          };
          $('#contentDetailModal').modal();
          $('#commentTable').dataTable();
        }
        else{
          alert('数据获取失败');
        }
      }).error(function(data, status) {
          //TODO:更改对话框
          alert('数据发生错误！');
      });
    };
    $scope.deal = function(index,flag) {
      $http({
          method: 'post',
          url: '/report/deal',
          data:{
              host_id : $scope.reports[index]._id.id,
              host_type : $scope.reports[index]._id.host_type,
              flag : flag
          }
      }).success(function(data, status) {
        if(data.result === 1){
          alert('举报处理成功');
          $scope.reports.splice(index,1);
        }
        else{
          alert('举报处理失败');
        }
      }).error(function(data, status) {
          //TODO:更改对话框
          alert('数据发生错误！');
      });
    };
    $scope.getReport();
}]);

adminApp.controller('LogController', ['$http','$scope','$rootScope',
  function ($http, $scope, $rootScope) {
    $scope.log_types =  [ {name:'userlog',view:'用户登录'},
                          {name:'joinCampaign',view:'参加活动'}
                        ];
    $scope.select_type = $scope.log_types[0];

    $scope.getLog = function(selectType){
      $http.get('/log/logList/'+selectType.name).success(function(data, status) {
        if(data.result === 1){
          $scope.logs = data.logs;
        }
      });
    }
    $scope.getLog($scope.select_type);
}]);


adminApp.controller('PushLogController', ['$http', '$scope', function($http, $scope) {
  $http.get('/push_logs').success(function(data) {
    $scope.pushLogs = data.pushLogs;
  }).error(function(data) {
    alert(data.msg || '获取数据失败');
  });

  $scope.repush = function(id) {
    $http.post('/push/repush', {pushLogId: id}).success(function(data) {
      alert(data.msg || '已经重新推送');
    }).error(function(data) {
      alert(data.msg || '重新推送失败');
    });
  };

}]);
adminApp.controller('EasemobController', ['$http', '$scope', function($http, $scope) {
  $http.get('/easemob/info').success(function(data) {
    $scope.easemob = data;
  }).error(function(data) {
    alert(data.msg || '获取数据失败');
  });

  $scope.save = function() {
    $http.post('/easemob/save', {easemob: $scope.easemob}).success(function(data) {
      alert(data.msg);
    }).error(function(data) {
      alert(data.msg || '环信设置失败');
    });
  };
  $scope.initHrUser = function() {
    $http.post('/easemob/inithruser').success(function(data) {
      alert(JSON.stringify(data));
    }).error(function(data) {
      alert(data.msg|| '初始化失败');
    });
  };
  $scope.initUser = function() {
    $http.post('/easemob/inituser').success(function(data) {
      alert(JSON.stringify(data));
    }).error(function(data) {
      alert(data.msg|| '初始化失败');
    });
  };
  $scope.initGroup = function() {
    $http.post('/easemob/initgroup').success(function(data) {
     alert(JSON.stringify(data));
    }).error(function(data) {
      alert(data.msg || '初始化失败');
    });
  };
}]);
adminApp.controller('interactionTemplateController', ['$http', '$scope', 'imageService', 'templates', function($http, $scope, imageService,templates) {
  $scope.templateType = 1;
  $scope.template = {
    templateType: 1
  }
  $scope.templates = templates;
  $scope.getTemplate = function(templateType){
    $http({
      method: 'get',
      url: '/interaction/template?limit=0&templateType='+templateType
    }).then(function(data, status) {
      $scope.templates = data.data;
    }).then(null,function(data, status) {
      alert(data.msg)
    });
  }
  $scope.detail = function(id) {
    $http({
      method: 'get',
      url: '/interaction/template/'+$scope.templateType+'/'+id
    }).then(function(data, status) {
      $scope.templateDetail = data.data;
      $('#templateDetailModal').modal();
    }).then(null,function(data, status) {
      alert(data.msg)
    });
  }
  $scope.$watch("templateType",function(newVal,oldVal) {
    if(newVal==1&&oldVal) {
      $("#start_time").datetimepicker({
        autoclose: true,
        language: 'zh-CN',
        startDate: new Date()
      }).on("changeDate",function (ev) {
        var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
        $scope.template.startTime = moment(dateUTC).format("YYYY-MM-DD HH:mm");
        $('#end_time').datetimepicker('setStartDate', dateUTC);
        $('#deadline').datetimepicker('setStartDate', dateUTC);
      });
      $("#deadline").datetimepicker({
          autoclose: true,
          language: 'zh-CN',
          startDate: new Date()
      }).on("changeDate",function (ev) {
        var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
        $scope.template.deadline = moment(dateUTC).format("YYYY-MM-DD HH:mm");
      });
    }
  })
  $('#addTemplateModal').on('shown.bs.modal', function () {
    $("#start_time").datetimepicker({
      autoclose: true,
      language: 'zh-CN',
      startDate: new Date()
    }).on("changeDate",function (ev) {
      var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
      $scope.template.startTime = moment(dateUTC).format("YYYY-MM-DD HH:mm");
      $('#end_time').datetimepicker('setStartDate', dateUTC);
      $('#deadline').datetimepicker('setStartDate', dateUTC);
    });
    $("#deadline").datetimepicker({
        autoclose: true,
        language: 'zh-CN',
        startDate: new Date()
    }).on("changeDate",function (ev) {
      var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
      $scope.template.deadline = moment(dateUTC).format("YYYY-MM-DD HH:mm");
    });
    $("#end_time").datetimepicker({
      autoclose: true,
      language: 'zh-CN',
      startDate: new Date()
    }).on("changeDate",function (ev) {
      var dateUTC = new Date(ev.date.getTime() + (ev.date.getTimezoneOffset() * 60000));
      $scope.template.endTime = moment(dateUTC).format("YYYY-MM-DD HH:mm");
      $('#start_time').datetimepicker('setEndDate', dateUTC);
      $('#deadline').datetimepicker('setEndDate', dateUTC);
    });

    // 地图
  $scope.mapCtrl = {};
  $scope.hasSearch = false;
  $scope.search = function() {
    $scope.mapCtrl.search($scope.template.location).then(function(res) {
      $scope.hasSearch = true;
      var lnglat = res.location;
      $scope.template.latitude = lnglat.getLat();
      $scope.template.longitude = lnglat.getLng();
    }, function(err) {
      console.log(err);
    });
    $scope.mapCtrl.onRemark(function(e) {
      var lnglat = e.lnglat;
      $scope.template.latitude = lnglat.getLat();
      $scope.template.longitude = lnglat.getLng();
    });
  };

  var cropper = $('#image_cropper').cropit({
    onFileChange: function () {
      console.log(111)
      $scope.isUploading = true;
      $scope.$digest();
    },
    imageBackground: true
  });

  $scope.isUploading = false;
  var cropitImageInput = $('#cropit_image_input');
  $scope.selectLogo = function () {
    cropitImageInput.click();
  };
  $scope.save = function() {
    var opt = {
      method: 'POST',
      url: '/interaction/template',
      data: $scope.template
    }
    var dataURI = cropper.cropit('export');
    if(dataURI) {
      opt.headers ={
        'Content-Type': 'multipart/form-data'
      }
      opt.transformRequest =function (data, headersGetter) {
        var formData = new FormData();
        angular.forEach(data, function (value, key) {
            formData.append(key, value);
        });
        var blob = imageService.dataURItoBlob(dataURI);
        formData.append('photo', blob);
        var headers = headersGetter();
        delete headers['Content-Type'];
        return formData;
      }
    }
    $http(opt)
    .success(function (data) {
      alert('成功');
      // window.location.reload();
    })
    .error(function (data, status) {
      alert(data.msg);
    });
  }
  })
  
  
}]);
// adminApp.controller('DashboardController', ['$http','$scope',
//   function ($http, $scope) {
//     $scope.dashboard = function() {
//       //----------- BEGIN SPARKLINE CODE -------------------------*/
//       // required jquery.sparkline.min.js*/

//       /** This code runs when everything has been loaded on the page */
//       /* Inline sparklines take their values from the contents of the tag */
//       $('.inlinesparkline').sparkline();

//       /* Sparklines can also take their values from the first argument
//       passed to the sparkline() function */
//       var myvalues = [10, 8, 5, 7, 4, 4, 1];
//       $('.dynamicsparkline').sparkline(myvalues);

//       /* The second argument gives options such as chart type */
//       $('.dynamicbar').sparkline(myvalues, {type: 'bar', barColor: 'green'});

//       /* Use 'html' instead of an array of values to pass options
//       to a sparkline with data in the tag */
//       $('.inlinebar').sparkline('html', {type: 'bar', barColor: 'red'});


//       $(".sparkline.bar_week").sparkline([5, 6, 7, 2, 0, -4, -2, 4], {
//         type: 'bar',
//         height: '40',
//         barWidth: 5,
//         barColor: '#4d6189',
//         negBarColor: '#a20051'
//       });

//       $(".sparkline.line_day").sparkline([5, 6, 7, 9, 9, 5, 4, 6, 6, 4, 6, 7], {
//         type: 'line',
//         height: '40',
//         drawNormalOnTop: false
//       });

//       $(".sparkline.pie_week").sparkline([1, 1, 2], {
//         type: 'pie',
//         width: '40',
//         height: '40'
//       });

//       $('.sparkline.stacked_month').sparkline(['0:2', '2:4', '4:2', '4:1'], {
//         type: 'bar',
//         height: '40',
//         barWidth: 10,
//         barColor: '#4d6189',
//         negBarColor: '#a20051'
//       });
//       //----------- END SPARKLINE CODE -------------------------*/


//       //----------- BEGIN FULLCALENDAR CODE -------------------------*/

//       var date = new Date();
//       var d = date.getDate();
//       var m = date.getMonth();
//       var y = date.getFullYear();

//       var calendar = $('#calendar').fullCalendar({
//         header: {
//             left: 'prev,today,next,',
//             center: 'title',
//             right: 'month,agendaWeek,agendaDay'
//         },
//         selectable: true,
//         selectHelper: true,
//         select: function(start, end, allDay) {
//             var title = prompt('Event Title:');
//             if (title) {
//                 calendar.fullCalendar('renderEvent',
//                         {
//                             title: title,
//                             start: start,
//                             end: end,
//                             allDay: allDay
//                         },
//                 true // make the event "stick"
//                         );
//             }
//             calendar.fullCalendar('unselect');
//         },
//         editable: true,
//         events: [
//             {
//                 title: 'All Day Event',
//                 start: new Date(y, m, 1),
//                 className: 'label label-success'
//             },
//             {
//                 title: 'Long Event',
//                 start: new Date(y, m, d - 5),
//                 end: new Date(y, m, d - 2),
//                 className: 'label label-info'
//             },
//             {
//                 id: 999,
//                 title: 'Repeating Event',
//                 start: new Date(y, m, d - 3, 16, 0),
//                 allDay: false,
//                 className: 'label label-warning'
//             },
//             {
//                 id: 999,
//                 title: 'Repeating Event',
//                 start: new Date(y, m, d + 4, 16, 0),
//                 allDay: false,
//                 className: 'label label-inverse'
//             },
//             {
//                 title: 'Meeting',
//                 start: new Date(y, m, d, 10, 30),
//                 allDay: false,
//                 className: 'label label-important'
//             },
//             {
//                 title: 'Lunch',
//                 start: new Date(y, m, d, 12, 0),
//                 end: new Date(y, m, d, 14, 0),
//                 allDay: false
//             },
//             {
//                 title: 'Birthday Party',
//                 start: new Date(y, m, d + 1, 19, 0),
//                 end: new Date(y, m, d + 1, 22, 30),
//                 allDay: false
//             },
//             {
//                 title: 'Click for Google',
//                 start: new Date(y, m, 28),
//                 end: new Date(y, m, 29),
//                 url: 'http://google.com/'
//             }
//           ]
//       });
//       /*----------- END FULLCALENDAR CODE -------------------------*/



//       /*----------- BEGIN CHART CODE -------------------------*/
//       var sin = [], cos = [];
//       for (var i = 0; i < 14; i += 0.5) {
//         sin.push([i, Math.sin(i)]);
//         cos.push([i, Math.cos(i)]);
//       }

//       var plot = $.plot($("#trigo"),
//             [
//                 {
//                     data: sin,
//                     label: "sin(x)",
//                     points: {
//                         fillColor: "#4572A7",
//                         size: 5
//                     },
//                     color: '#4572A7'
//                 },
//                 {
//                     data: cos,
//                     label: "cos(x)",
//                     points: {
//                         fillColor: "#333",
//                         size: 35
//                     },
//                     color: '#AA4643'
//                 }
//             ], {
//         series: {
//             lines: {
//                 show: true
//             },
//             points: {
//                 show: true
//             }
//         },
//         grid: {
//             hoverable: true,
//             clickable: true
//         },
//         yaxis: {
//             min: -1.2,
//             max: 1.2
//         }
//       });

//       function showTooltip(x, y, contents) {
//         $('<div id="tooltip">' + contents + '</div>').css({
//             position: 'absolute',
//             display: 'none',
//             top: y + 5,
//             left: x + 5,
//             border: '1px solid #fdd',
//             padding: '2px',
//             'background-color': '#000',
//             color: '#fff'
//         }).appendTo("body").fadeIn(200);
//       }

//       var previousPoint = null;
//       $("#trigo").bind("plothover", function(event, pos, item) {
//         $("#x").text(pos.x.toFixed(2));
//         $("#y").text(pos.y.toFixed(2));

//         if (item) {
//             if (previousPoint !== item.dataIndex) {
//                 previousPoint = item.dataIndex;

//                 $("#tooltip").remove();
//                 var x = item.datapoint[0].toFixed(2),
//                         y = item.datapoint[1].toFixed(2);

//                 showTooltip(item.pageX, item.pageY,
//                         item.series.label + " of " + x + " = " + y);
//             }
//         }
//         else {
//             $("#tooltip").remove();
//             previousPoint = null;
//         }
//       });
//       /*----------- END CHART CODE -------------------------*/

//       /*----------- BEGIN TABLESORTER CODE -------------------------*/
//       /* required jquery.tablesorter.min.js*/
//       $(".sortableTable").tablesorter();
//       /*----------- END TABLESORTER CODE -------------------------*/
//     }
//     $scope.dashboard();
// }]);