'use strict';

angular.module('noterious.common')
  .service('MemberModel', function ($http, $q, Backand) {
    var self = this;

    function extract(result) {
      return angular.isDefined(result.data.data) ? result.data.data : result.data;
    }

    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/users_boards';
    }

    function getUsersBoardsForId(usersBoarsdId) {
      return Backand.getApiUrl() + '/1/objects/users_boards/' + usersBoarsdId;
    }

    self.create = function (boardId, userId) {
      return $http.post(
        getUrl() + '?returnObject=true',
        {
          "member": userId,
          "board": boardId
        })
        .then(extract);
    };

    self.destroy = function (users_boards_id) {
      return $http.delete(getUsersBoardsForId(users_boards_id))
        .then(extract);
    };
  });