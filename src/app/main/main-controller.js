(function () {
 'use strict';

  angular.module('noterious')
    .controller('MainCtrl', ['UserModel', '$state', MainCtrl]);

  function MainCtrl (UserModel, $state) {
    var self = this;

    self._init = function () {
      self.currentUserEmail = UserModel.getCurrentUser();
    };

    self.logout = function () {
      UserModel.logout()
        .then(function () {
            self.currentUserEmail = null;
            $state.go('login');
        });
    };

    self._init();
  }

})();