(function () {
  'use strict';

  angular.module('noterious.common')
    .service('MemberModel', ['$http', 'Backand', 'extractData', MemberModel]);

  function MemberModel($http, Backand, extractData) {
    var self = this;

    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/users_boards';
    }

    function getUsersBoardsForId(usersBoardsId) {
      return Backand.getApiUrl() + '/1/objects/users_boards/' + usersBoardsId;
    }

    self.create = function (boardId, userId) {
      return $http.post(
        getUrl() + '?returnObject=true',
        {
          "member": userId,
          "board": boardId
        })
        .then(extractData);
    };

    self.destroy = function (usersBoardsId) {
      return $http.delete(getUsersBoardsForId(usersBoardsId))
        .then(extractData);
    };
  }

})();