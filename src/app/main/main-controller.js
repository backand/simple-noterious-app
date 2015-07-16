(function () {
 'use strict';

  angular.module('noterious')
    .controller('MainCtrl', ['UserModel', MainCtrl]);

  function MainCtrl (UserModel) {
    var main = this;
    main.currentColor = 'blue';

    main.colors = [
      'blue',
      'green',
      'orange',
      'red',
      'yellow'
    ];

    main.setCurrentColor = function(color) {
      main.currentColor = color;
    };

    main.logout = function () {
      UserModel.logout();
    };
  }

})();