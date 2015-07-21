(function () {
 'use strict';

  angular.module('noterious')
    .controller('MainCtrl', ['UserModel', '$state','$scope', MainCtrl]);

  function MainCtrl (UserModel, $state, $scope) {
    var self = this;

    function _init() {
      self.currentUserEmail = UserModel.getCurrentUser();
    };

    $scope.$on('userLogin', _init);

    self.logout = function () {
      UserModel.logout()
        .then(function () {
            self.currentUserEmail = null;
            $state.go('login');
        });
    };

    _init();
  }

})();