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
    BackandProvider.setAppName('Your-App-Name');

    BackandProvider.setAnonymousToken('Your-Anonymous-Token');
    BackandProvider.setSignUpToken('Your-SignUp-Token');

    $httpProvider.interceptors.push('httpInterceptor');
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('root', {
        url: '/',
        abstract: true,
        templateUrl: 'app/main/main.tmpl.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .state('login', {
        url: 'login',
        parent: 'root',
        templateUrl: 'app/login/login.tmpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'loginCtrl'
      })
      .state('boards', {
        url: '',
        parent: 'root',
        templateUrl: 'app/boards/boards.tmpl.html',
        controller: 'BoardsCtrl',
        controllerAs: 'boardsCtrl'
      })
      .state('notes', {
        url: 'boards/:boardId/notes',
        parent: 'root',
        templateUrl: 'app/notes/notes.tmpl.html',
        controller: 'NotesCtrl',
        controllerAs: 'notesCtrl'
      });
  });
