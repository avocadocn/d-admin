'use strict';

var regionApp = angular.module('region', ['ngRoute']);



regionApp.controller('regionController', ['$scope', '$http', function($scope, $http) {
    $http.get('/region/province').success(function(data,status){
        $scope.provinces = data;
    }).error(function(data,status) {
        //TODO:更改对话框
        alert('省获取失败！');
    });

    $scope.getCity = function (_province) {
      $http({
        method: 'post',
        url: '/region/city',
        data:{
          province : _province
        }
      }).success(function(data, status) {
        $scope.cities = data;
      }).error(function(data, status) {
        //TODO:更改对话框
        alert('数据发生错误！');
      });
    }

    $scope.getDistrict = function(_province,_city) {
       $http({
        method: 'post',
        url: '/region/city',
        data:{
          province : _province,
          city : _city
        }
      }).success(function(data, status) {
        $scope.districts = data;
      }).error(function(data, status) {
        //TODO:更改对话框
        alert('数据发生错误！');
      });
    }

    $scope.getCompany = function(_province,_city,_district) {
       $http({
        method: 'post',
        url: '/region/city',
        data:{
          province : _province,
          city : _city,
          district : _district
        }
      }).success(function(data, status) {
        $scope.companies = data;
      }).error(function(data, status) {
        //TODO:更改对话框
        alert('数据发生错误！');
      });
    }
}]);

