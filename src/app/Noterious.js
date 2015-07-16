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
    BackandProvider.setAnonymousToken('anonymous-token');
    BackandProvider.setSignUpToken('sign-up-token');
    BackandProvider.setAppName('app-name');

    $httpProvider.interceptors.push('httpInterceptor');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.tmpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'loginCtrl'
      })
      .state('boards', {
        url: '/boards',
        templateUrl: 'app/boards/boards.tmpl.html',
        controller: 'BoardsCtrl',
        controllerAs: 'boardsCtrl'
      })
      .state('notes', {
        url: '/boards/:boardId/notes',
        templateUrl: 'app/notes/notes.tmpl.html',
        controller: 'NotesCtrl',
        controllerAs: 'notesCtrl'
      });
  });
