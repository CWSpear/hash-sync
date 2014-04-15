var app = angular.module('HashSyncDemo', ['HashSync']);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
});

app.controller('MainCtrl', function ($scope, hashSyncHelper) {
  $scope.text = ['',''];

  $scope.synced = 'banana';
  hashSyncHelper.sync('synced', $scope);
});