'use strict';

angular.module('pcselector', [])
  .factory('PCSelector', function(){

    var provinces = [
      {name: '上海', cities: [{name: '宝山'}, {name: '黄浦'}]},
      {name: '广西', cities: [{name: '南宁'}, {name: '梧州'}]}
    ];

    var PCSelector = function() {
      this.provinces = provinces;
      this.cities = provinces[0].cities;
      this.province = this.provinces[0];
      this.city = this.cities[0];
    };

    PCSelector.prototype.change = function() {
      this.cities = this.province.cities;
      this.city = this.cities[0];
    };
    
    return {
      PCSelector: PCSelector
    };

  });