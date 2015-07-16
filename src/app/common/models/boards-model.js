'use strict';

angular.module('noterious.common')
  .service('BoardsModel', function ($http, $q, Backand, MemberModel) {
    var self = this;

    self.boards = [];

    function extract(result) {
      if(angular.isDefined(result.data.data))
        return result.data.data;
      else
        return result.data;
    }



    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/boards';
    }

    function getUrlForId(boardId) {
      return Backand.getApiUrl() + '/1/objects/boards/' + boardId;
    }

    function updateBoards (boards) {
      return angular.copy(boards, self.boards);
    }

    self.all = function () {
      //return $http.get(getUrl()).then(extract);
      //call the query to get only for current user or active
      return $http.get(Backand.getApiUrl() + '/1/query/data/GetBoardsBasedOnCurrentUser', {params:{parameters: {isPublic: 1}}})
        .then(extract)
        .then(updateBoards)
        .then(addBoardMembers);
    };

    //Update the users members for each board
    function addBoardMembers () {
      var promises = [];
      angular.forEach(self.boards, function (board) {
        var response = $q.all([self.getBoardMembers(board.id)])

            .then(function (results) {
              board.allMembers = results[0];
              return board;
            });

        promises.push(response);
      });

      return $q.all(promises);
    }

    self.getBoardMembers = function (boardId) {
      return $http.get(Backand.getApiUrl() + '/1/query/data/GetBoardsMemebers',{params:{parameters: {board: boardId}}})
        .then(extract)
    };

    self.fetch = function (boardId) {
      return $http.get(getUrlForId(boardId)+'?deep=true').then(extract);
    };

    self.create = function (board) {
      return $http.post(getUrl(), board).then(extract);
    };

    self.update = function (boardId, board) {
      return $http.put(getUrlForId(boardId), board).then(extract);
    };

    self.destroy = function (boardId) {
      return $http.delete(getUrlForId(boardId)).then(extract);
    };

    self.addMemberToBoard = function (boardId, member) {
      return MemberModel.create(boardId, member.id)
    }
  });