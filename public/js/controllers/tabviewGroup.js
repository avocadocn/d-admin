'use strict';

var tabViewGroup = angular.module('tabViewGroup', ['ngRoute']);

tabViewGroup.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/group_message', {
        templateUrl: '/views/group_message_list.html',
        controller: 'GroupMessageController',
        controllerAs: 'messages'
      })
      .when('/group_campaign', {
        templateUrl: '/views/campaign_list.html',
        controller: 'CampaignListController',
        controllerAs: 'campaign'
      })
      .when('/group_member', {
        templateUrl: '/views/member_list.html',
        controller: 'MemberListController',
        controllerAs: 'member'
      })
      .when('/group_info', {
        templateUrl: '/group/info',
        controller: 'infoController',
        controllerAs: 'account'
      }).
      otherwise({
        redirectTo: '/group_message'
      });
  }]);

tabViewGroup.controller('GroupMessageController', ['$http',
  function($http) {
    var that = this;
    $http.get('/group/getGroupMessages?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.group_messages = data;
    });
}]);

tabViewGroup.controller('CampaignListController', ['$http', '$scope',
  function($http, $scope) {
    var that = this;
    $http.get('/group/getCampaigns?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.campaigns = data;
    });

    $scope.join = function(campaign_id) {
        try {
            $http({
                method: 'post',
                url: '/users/joinCampaign',
                data:{
                    campaign_id : campaign_id
                }
            }).success(function(data, status) {
                alert("成功加入该活动!");
            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e) {
            console.log(e);
        }
    };

    $scope.quit = function(campaign_id) {
        try {
            $http({
                method: 'post',
                url: '/users/quitCampaign',
                data:{
                    campaign_id : campaign_id
                }
            }).success(function(data, status) {
                alert("您已退出该活动!");
            }).error(function(data, status) {
                alert("数据发生错误！");
            });
        }
        catch(e) {
            console.log(e);
        }
    };
}]);

tabViewGroup.controller('MemberListController', ['$http', function($http) {
    var that = this;
    $http.get('/group/getGroupMembers?' + Math.round(Math.random()*100)).success(function(data, status) {
      that.group_members = data;
      console.log(that.group_members);
    });
}]);

tabViewGroup.controller('infoController', ['$http', '$scope',function($http, $scope) {
    $scope.unEdit = true;
    $scope.buttonStatus = "编辑>";
    $scope.editToggle = function() {
        $scope.unEdit = !$scope.unEdit;
        if($scope.unEdit) {
            try{
                $http({
                    method : 'post',
                    url : '/group/saveInfo',
                    data : {
                        'companyGroup' : $scope.companyGroup
                    }
                }).success(function(data, status) {
                    //TODO:更改对话框
                    if(data.result === 1)
                        alert("信息修改成功！");
                    else
                        alert(data.msg);
                }).error(function(data, status) {
                    //TODO:更改对话框
                    alert("数据发生错误！");
                });
            }
            catch(e) {
                console.log(e);
            }
            $scope.buttonStatus = "编辑>";
        }
        else {
            $scope.buttonStatus = "保存";
        }
  };
}]);
