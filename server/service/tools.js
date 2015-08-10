'use strict';

exports.arrayObjectIndexOf = function (myArray, searchTerm, property) {
  var _property = property.split('.');
  try {
    for (var i = 0, len = myArray.length; i < len; i++) {
      var item = myArray[i];
      _property.forEach(function (_pro) {
        item = item[_pro];
      });
      if (item.toString() === searchTerm.toString()) return i;
    }
  }
  catch (e){
    console.log(e)
    return -1;
  }
  return -1;
};

/**
 * 随机生成一串只含字母和数字的字符串
 * @param  {Number} len 要生成的字符串的长度
 * @return {String}
 */
exports.randomAlphaNumeric = function (len) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomMax = possible.length;
  for(var i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * randomMax));
  }
  return text;
}
exports.unique = function(arr) {
  var ret = []
  var hash = {}
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i]
    var key = typeof(item) + item
    if (hash[key] !== 1) {
      ret.push(item)
      hash[key] = 1
    }
  }
  return ret
}

