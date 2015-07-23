(function () {
  'use strict';

  angular.module('noterious.common')
    .service('BoardsModel', ['$http', 'Backand', 'MemberModel', 'extractData', BoardsModel]);

  function BoardsModel($http, Backand, MemberModel, extractData) {
    var self = this;

    self._init = function () {
      self.boards = [];
    };

    function getUrl() {
      return Backand.getApiUrl() + '/1/objects/boards';
    }

    function getUrlForId(boardId) {
      return Backand.getApiUrl() + '/1/objects/boards/' + boardId;
    }

    function updateBoards(boards) {
      return angular.copy(boards, self.boards);
    }

    self.all = function () {
      return $http.get(getUrl())
          .then(extractData)
          .then(updateBoards);
          //.then(addBoardMembers);
    };

    self.getUsersBoards = function () {
      //call the query to get only for current user or active
      return $http.get(Backand.getApiUrl() +
        '/1/query/data/GetBoardsBasedOnCurrentUser',
        {
          params: {
            parameters: {
              isPublic: 1}
          }
        }
      )
        .then(extractData)
        .then(updateBoards)
        .then(addBoardMembers);
    };

    //Update the users members for each board
    function addBoardMembers() {
      self.boards.forEach(function (board) {
        reformatBoardData(board);
        self.getBoardMembers(board.id)
          .then(function (result) {
            board.allMembers = result;
            return board;
          });
      });
      return self.boards;
    }

    self.getBoardMembers = function (boardId) {
      return $http.get(Backand.getApiUrl() +
        '/1/query/data/GetBoardsMembers',
        {
          params: {
            parameters: {
              board: boardId
            }
          }
        }
      )
        .then(extractData)
    };

    function reformatBoardData (board) {
      board.isPublic = !!board.isPublic;
    }

    self.fetch = function (boardId) {
      return $http.get(getUrlForId(boardId) + '?deep=true').then(extractData);
    };

    self.create = function (board) {
      return $http.post(getUrl() + '?returnObject=true', board)
        .then(extractData)
        .then(createDefaultMember)
        //.then(updateBoards);
        .then(self.getUsersBoards);
    };

    function createDefaultMember (board) {
      return $http.get(Backand.getApiUrl() + '/1/objects/action/boards/' + board.id +'?name=AddDefaultMember')
        .then(extractData);
    }

    self.update = function (boardId, board) {
      return $http.put(getUrlForId(boardId), board).then(extractData);
    };

    self.destroy = function (boardId) {
      return $http.delete(getUrlForId(boardId)).then(extractData)
        .then(self.getUsersBoards);
    };

    self.addMemberToBoard = function (boardId, member) {
      return MemberModel.create(boardId, member.id)
    };

    self._init();

  }

})();