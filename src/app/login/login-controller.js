(function () {
  'use strict';

  angular.module('noterious')
    .controller('LoginCtrl', ['UserModel', 'Backand', '$state', LoginCtrl]);

  function LoginCtrl(UserModel, Backand, $state) {
    var self = this;

    self._init = function () {
      self.reset();
      self.providers = Backand.getSocialProviders();
    };

    self.submit = function () {
      self.loading = true;
      self.user.register ? register() : login();
    };

    function register() {
      UserModel.register({
        email: self.user.email,
        password: self.user.password
      })
        .then(function () {
          $state.go('boards');
        })
        .finally(function () {
          self.error = UserModel.error;
          self.reset();
        });
    }

    function login() {
      UserModel.login({
        email: self.user.email,
        password: self.user.password
      })
        .then(function () {
          UserModel.error ? self.error = UserModel.error : $state.go('boards');
        }, function (error) {
          self.error = UserModel.error;
        })
        .finally(function (reason) {
          self.reset();
        });
    }

    self.reset = function () {
      self.loading = false;
      self.user = {
        email: '',
        password: '',
        register: false
      };
    };

    self.socialLogin = function (provider) {
      UserModel.socialLogin(provider.name, self.user.register)
        .then(function () {
          UserModel.error ? self.error = UserModel.error : $state.go('boards');
        }, function () {
          self.error = UserModel.error;
        }
      );
    };

    self._init();
  }

})();