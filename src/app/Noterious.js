'use strict';

angular.module('noterious', [
  'ui.router',
  'ngAnimate',
  'backand',
  'noterious.common',
  'isteven-multi-select'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, BackandProvider) {

    //BackandProvider.setAppName('Your-App-Name');
    //BackandProvider.setSignUpToken('Your-SignUp-Token');
    //BackandProvider.setAnonymousToken('Your-Anonymous-Token');

      BackandProvider.setAppName('bkndnoterious');
      BackandProvider.setSignUpToken('e1cff5d5-031e-414c-b492-ad76611cac56');
      BackandProvider.setAnonymousToken('f588ee75-09fb-419d-bc06-a14045815c97');


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
