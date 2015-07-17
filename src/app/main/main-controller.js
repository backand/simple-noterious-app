(function () {
 'use strict';

  angular.module('noterious')
    .controller('MainCtrl', ['UserModel','$state', MainCtrl]);

  function MainCtrl (UserModel,$state) {
    var self = this;

    self._init = function () {
      self.currentColor = 'blue';
      self.currentUserEmail = UserModel.getCurrentUser();
    };

    self.colors = [
      'blue',
      'green',
      'orange',
      'red',
      'yellow'
    ];

    self.setCurrentColor = function(color) {
      self.currentColor = color;
    };

    self.logout = function () {
      UserModel.logout()
        .then(function(){
            self.currentUserEmail = '';
            $state.go('login');
        });
    };

    self._init();
  }

})();