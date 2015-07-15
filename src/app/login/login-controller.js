'use strict';

angular.module('noterious')
  .controller('LoginCtrl', function (UserModel, $state) {
    var login = this;

    login.loading = false;

    login.user = {
      email: '',
      password: '',
      register: false
    };

    login.submit = function (user, isValid, isRegistering) {
      if (isValid) {
        login.loading = true;

        if (isRegistering) {

          UserModel.register({
            email: login.user.email,
            password: login.user.password
          })
          .then(function() {
              $state.go('boards');
          })
          .finally(function() {
            login.error = UserModel.error;
            login.reset();
          });

        } else {

          UserModel.login({
            email: login.user.email,
            password: login.user.password
          })
          .then(function() {
            if(!UserModel.error)
              $state.go('boards');
            else
              login.error = UserModel.error;
          },function(ee){
                login.error = UserModel.error;
              })
          .finally(function(reason) {

            login.reset();
          });

        }

      }
    };

    login.reset = function () {
      login.loading = false;
      login.user = {
        email: '',
        password: '',
        register: false
      };
    };

    login.providers = [
      {name: 'github', label: 'Github', url: 'www.github.com', css: 'github', id:1},
      {name: 'google', label: 'Google', url: 'www.google.com', css: 'google-plus', id:2},
      {name: 'facebook', label: 'Facebook', url: 'www.facebook.com', css: 'facebook', id:3}
    ];

    login.socialLogin = function (provider) {
      UserModel.socialLogin (provider.name, login.user.register)
        .then(function () {
          if (!UserModel.error) {
            $state.go('boards');
          }
        },
        function () {
          login.error = UserModel.error;
        }
      );
    }

  });
