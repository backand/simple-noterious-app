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

    //BackandProvider.setAppName('Your-App-Name');
    //BackandProvider.setSignUpToken('Your-SignUp-Token');
    //BackandProvider.setAnonymousToken('Your-Anonymous-Token');

    BackandProvider.setAppName('noterious2');
    BackandProvider.setSignUpToken('84b8ca6d-e0f1-4377-b5f5-4db1960d872e');
    BackandProvider.setAnonymousToken('690d47ca-9fa0-4ec8-83ee-3d770042ba10');

    $httpProvider.interceptors.push('httpInterceptor');
    $urlRouterProvider.otherwise('/login');

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
