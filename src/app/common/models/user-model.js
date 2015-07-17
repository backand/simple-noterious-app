(function () {
  'use strict';

  angular.module('noterious.common')
    .service('UserModel', ['Backand', '$state', UserModel]);

  function UserModel (Backand, $state) {
    var self = this;

    var currentUser = null;

    self._init = function () {
      currentUser = Backand.getUsername();
    };

    self.getCurrentUser = function(){
      return currentUser;
    }

    self.login = function (user) {
      return Backand.signin(user.email, user.password)
        .then(function (response) {
          self.error = '';
          currentUser = Backand.getUsername();
        }, function (error) {
          self.error = error && error.error_description || 'Unknown error from server';
          console.log(self.error);
        }
      );
    };

    self.register = function(user) {
      return Backand.signup(user.email, 'last', user.email, user.password, user.password)
        .then(function(userData) {
          self.error= '';
          console.log('User ' + userData.data.username + ' created successfully!');
          return self.login(user);
        }, function (error) {
          self.error = error.error_description || 'Unknown error from server';
        }
      );
    };

    self.socialLogin = function (provider, newUser) {
      var socialSignIn = newUser ? Backand.socialSignUp(provider) : Backand.socialSignIn(provider);
      return socialSignIn
        .then(function (userData) {
          self.error = '';
          if (newUser) {
            console.log('User ' + userData.username + ' created successfully!');
          }
        }, function (error) {
          self.error = error && error.error_description || 'Unknown error from server';
          console.log(self.error);
        }
      )
    };

    self.logout = function () {
      return Backand.signout();
    };

    self._init();
  }

})();