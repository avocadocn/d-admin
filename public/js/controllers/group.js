//组件列表控制器
'use strict';


var groupApp = angular.module('group', []);
groupApp.directive('formatdrag', [ function() {
        return {
            restrict: 'A',
            link: function(scope, el, attrs, controller) {
              $(el).attr("draggable", "true");
              el.bind("dragstart",function(e){
                e.dataTransfer.setData("member_id",e.target.id);
                e.dataTransfer.setData("nowx",e.pageX);
                e.dataTransfer.setData("nowy",e.pageY);
              });

              el.bind("dragend", function(e){
                var _id = e.target.id;
                if(_id.indexOf('on_')==0){
                  var field = $('#formatField');
                  var _left = field.offset().left;
                  var _top = field.offset().top;
                  var _right = _left + field.width();
                  var _bottom = _top +field.height();
                  var _nowx = e.pageX;
                  var _nowy = e.pageY;
                  if (_nowx < _left || _nowx > _right || _nowy > _bottom || _nowy < _top) {
                    $(e.target).remove();
                    var _newid = _id.substr(3);
                    $('#'+_newid).attr('draggable',true);
                  };
                }
              });
            }
        }
    }]);

groupApp.directive('formatdrop', [function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs, controller) {
      el.bind("dragover", function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        return false;
      });
      el.bind("drop", function(e) {
        e.preventDefault();
        console.log(scope.ngcompetition);
        var data=e.dataTransfer.getData("member_id");
        var _newEle ={};
        var _x = $(e.target).offset().left;
        var _y = $(e.target).offset().top;
        var _width = $(e.target).width();
        var _height = $(e.target).height();
        var _offsetX = e.pageX - _x - 10;
        var _offsetY = e.pageY - _y -10;
        var _percentX = _offsetX / _width;
        var _percentY = _offsetY / _height;
        if(_offsetX > _width / 2){
          return false;
        };
        if(data.indexOf('on_')!=0){
          _newEle = $('#'+data).clone(true);
          _newEle.attr('id','on_'+data);
          _newEle.css('top',_offsetY > 0 ? _offsetY : 0);
          _newEle.css('left',_offsetX > 0 ? _offsetX : 0);
          $(e.target).parent().append(_newEle);
          $('#'+data).attr('draggable',false);
        }
        else{
          _newEle = $('#'+data);
          var _top= _newEle.position().top;
          var _left= _newEle.position().left;
          var datax=e.dataTransfer.getData("nowx");
          var datay=e.dataTransfer.getData("nowy");
          var _newX = _left + e.pageX - datax;
          var _newY = _top +e.pageY - datay;
          _newEle.css('top',_newY > 0 ? _newY : 0);
          _newEle.css('left',_newX > 0 ? _newX : 0);
        };
      });
      }
  }
    }]);
groupApp.controller('competitionController', ['$rootScope', '$http', function($scope, $http) {
  }]
);
(function(){
  $(function(){
    var _conetent = $('#competition_content');
    _conetent.find('.onemberA').each(function(){
      var _id = $(this).attr('id');
      var _newid = _id.substr(3);
      $('#'+_newid).attr('draggable',false);
    });
  });
}());
