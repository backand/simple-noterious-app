'use strict';

angular.module('noterious', [
  'ui.router',
  'ngAnimate',
  'backand',
  'noterious.common',
  'isteven-multi-select'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, BackandProvider) {
    //BackandProvider.manageDefaultHeaders();

    //BackandProvider.setAppName('bkndnoterious');
    //BackandProvider.setSignUpToken('e1cff5d5-031e-414c-b492-ad76611cac56');
    //BackandProvider.setAnonymousToken('f588ee75-09fb-419d-bc06-a14045815c97');

    BackandProvider.setAppName('noteriousver2');
    BackandProvider.setSignUpToken('403bdb84-bc39-4e03-bb9f-7674c9887225');
    BackandProvider.setAnonymousToken('9e49e396-53a3-4951-8f01-d07f703f449b');

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
