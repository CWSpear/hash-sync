;(function () {
  angular.module('HashSync', [])

  .directive('hashSync', ['$parse', 'hashSyncHelper', function ($parse, helper) {
    return {
      require: 'ngModel',
      link: function postLink(scope, elem, attrs, ngModel) {
        var replaceHistory = ($parse(attrs.replaceHistory)({}) === false) ? false : true;

        // keeping it DRY
        var hashToModel = function () {
          var obj = helper.getHash();
          ngModel.$setViewValue(obj[attrs.ngModel]);
          ngModel.$render();
        };

        // on directive creation, set value of model to hash value
        if (!ngModel.$viewValue) hashToModel();

        // on model change, update the hash
        scope.$watch(attrs.ngModel, function (val) {
          var obj = helper.getHash();
          obj[attrs.ngModel] = ngModel.$viewValue;
          helper.setHash(obj, replaceHistory);
        });
        
        // on hashchange, update the model
        window.addEventListener('hashchange', function () {
          scope.$apply(hashToModel);
        });
      }
    };
  }])

  .factory('hashSyncHelper', ['$location', '$parse', '$rootScope', function ($location, $parse, $rootScope) {
    var service = {
      getHash: function () {
        return parseKeyValue($location.hash());
      },

      setHash: function (obj, replaceHistory) {
        if (!isDefined(replaceHistory)) replaceHistory = true;

        var obj2 = {};
        // strip out blank values
        angular.forEach(obj, function (v, k) { if (v) obj2[k] = v; });
        $location.hash(toKeyValue(obj2));
        if (replaceHistory) {
          $location.replace();
        }
      },

      sync: function (expr, scope, replaceHistory) {
        if (!scope) scope = $rootScope;

        var setHash = function (val, old) {
          var obj = service.getHash();
          obj[expr] = val;
          service.setHash(obj, replaceHistory);
        };

        setHash($parse(expr)(scope));

        scope.$watch(expr, setHash);

        window.addEventListener('hashchange', function () {
          scope.$apply(function () {
            var obj = service.getHash();
            var val = obj[expr];
            $parse(expr).assign(scope, val);
          });
        });
      }
    };

    return service;
  }]);

  // all these `function _______` fns are cuz Angular
  // doesn't expose most of it's helper functions!

  function isDefined(value) {
    return typeof value !== 'undefined';
  }

  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch(e) {
      // Ignore any invalid uri component
    }
  }

  function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).
               replace(/%40/gi, '@').
               replace(/%3A/gi, ':').
               replace(/%24/g, '$').
               replace(/%2C/gi, ',').
               replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
  }

  function parseKeyValue(keyValue) {
    var obj = {}, key_value, key;
    angular.forEach((keyValue || "").split('&'), function(keyValue){
      if ( keyValue ) {
        key_value = keyValue.split('=');
        key = tryDecodeURIComponent(key_value[0]);
        if ( angular.isDefined(key) ) {
          var val = angular.isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
          if (!obj[key]) {
            obj[key] = val;
          } else if(angular.isArray(obj[key])) {
            obj[key].push(val);
          } else {
            obj[key] = [obj[key],val];
          }
        }
      }
    });
    return obj;
  }

  function toKeyValue(obj) {
    var parts = [];
    angular.forEach(obj, function(value, key) {
      if (angular.isArray(value)) {
        angular.forEach(value, function(arrayValue) {
          parts.push(encodeUriQuery(key, true) +
                     (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
        });
      } else {
      parts.push(encodeUriQuery(key, true) +
                 (value === true ? '' : '=' + encodeUriQuery(value, true)));
      }
    });
    return parts.length ? parts.join('&') : '';
  }
})();
