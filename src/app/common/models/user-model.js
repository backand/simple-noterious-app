(function () {
  'use strict';

  angular.module('noterious.common')
    .service('UserModel', ['Backand', '$state', UserModel]);

  function UserModel (Backand, $state) {
    var self = this;

    var currentUser = null;

    function _init () {
      currentUser = Backand.getUsername();
    };

    self.getCurrentUser = function(){
      return currentUser;
    }

    self.login = function (user) {
      return Backand.signin(user.email, user.password)
        .then(function (response) {
          self.error = '';
          _init();
        }, function (error) {
          self.error = error && error.error_description || 'Unknown error from server';
          console.log(self.error);
        }
      );
    };

    self.register = function(user) {
      return Backand.signup(user.email, 'last', user.email, user.password, user.password)
        .then(function(userData) {
          _init();
          self.error= '';
          console.log('User ' + userData.username + ' created successfully!');
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
          _init();
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
      return Backand.signout()
          .then(_init);
    };

    _init();
  }

})();