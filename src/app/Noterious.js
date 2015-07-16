'use strict';

angular.module('noterious', [
  'ui.router',
  'ngAnimate',
  'backand',
  'ngCookies',
  'noterious.common',
  'isteven-multi-select'
])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider, BackandProvider) {
  BackandProvider.manageDefaultHeaders();
  BackandProvider.setAnonymousToken('690d47ca-9fa0-4ec8-83ee-3d770042ba10');
  BackandProvider.setSignUpToken('84b8ca6d-e0f1-4377-b5f5-4db1960d872e');
  //BackandProvider.setApiUrl('http://api.backand.co:8099');
  BackandProvider.setAppName('noterious2');

  $httpProvider.interceptors.push('httpInterceptor');
  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('login', {
      url:'/login',
      templateUrl: 'app/login/login.tmpl.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .state('boards', {
      url:'/boards',
      templateUrl: 'app/boards/boards.tmpl.html',
      controller: 'BoardsCtrl',
      controllerAs: 'ctrl'
    })
    .state('notes', {
      url:'/boards/:boardId/notes',
      templateUrl: 'app/notes/notes.tmpl.html',
      controller: 'NotesCtrl',
      controllerAs: 'ctrl'
    });
});
