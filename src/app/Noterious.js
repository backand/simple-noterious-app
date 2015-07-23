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

    BackandProvider.setAppName('bkndnoterious');
    BackandProvider.setSignUpToken('e1cff5d5-031e-414c-b492-ad76611cac56');
    BackandProvider.setAnonymousToken('f588ee75-09fb-419d-bc06-a14045815c97');

    //BackandProvider.setAppName('noterious3');
    //BackandProvider.setSignUpToken('34b63d4f-4936-403e-9546-dbde9c10d6cb');
    //BackandProvider.setAnonymousToken('28368428-cf14-4ba5-bb14-abc8b10f5fe7');


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
