'use strict';

angular.module('noterious.common')
  .service('UserModel', function (Backand, $state) {
    var service = this,
      currentUser = null;

    service.getCurrentUser = function () {
      return currentUser;
    };

    service.setCurrentUser = function(user){
      currentUser = user;
    };

    service.login = function (user) {
      return Backand.signin(user.email, user.password)
        .then(
        function (response) {
          service.error = '';
          return;
        },
        function (data) {
          service.error = data && data.error_description || 'Unknown error from server';
          console.log(service.error);

        }
      );
    };

    service.register = function(user) {
      return Backand.signup(user.email, 'last', user.email, user.password, user.password)
        .then(
        function(userData) {
          service.error= '';
          console.log('User ' + userData.data.username + ' created successfully!');
          return service.login(user);
        },
        function (data) {
          service.error = data.error_description || 'Unknown error from server';
        }
      );
    };

    service.socialLogin = function (provider, newUser) {
      var socialSignIn = newUser ? Backand.socialSignUp(provider) : Backand.socialSignIn(provider);
      return socialSignIn
        .then(function (userData) {
          service.error = '';
          if (newUser) {
            console.log('User ' + userData.username + ' created successfully!');
          }
          return;
        }, function (data) {
          service.error = data && data.error_description || 'Unknown error from server';
          console.log(service.error);
        }
      )
    };

    service.logout = function () {
      Backand.signout();
      $state.go('login');
    };
  });
