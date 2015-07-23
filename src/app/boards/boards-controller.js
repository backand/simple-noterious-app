(function () {
'use strict';

angular.module('noterious')
  .controller('BoardsCtrl', ['BoardsModel','MemberModel', BoardsCtrl]);

  function BoardsCtrl (BoardsModel, MemberModel) {
    var self = this;

    self._init = function() {
      self.boards = BoardsModel.boards;
      self.resetForm();
      self.getBoards();
    };

    self.getBoards = function () {
      //BoardsModel.getUsersBoards();
      BoardsModel.all();
    };

    self.updateBoard = function (boardId, board) {
      return BoardsModel.update(boardId, board)
          .catch(function (reason) {
            // alert and revert
          })
    };

    self.deleteBoard = function (boardId) {
      return BoardsModel.destroy(boardId)
          .catch(function (reason) {
            //alert and revert
          })
    };

    self.resetForm = function () {
      self.newBoard = {
        title: '',
        description: '',
        isPublic: false
      };
    };

    self.createBoard = function (board, isValid) {
      if (isValid) {
        BoardsModel.create(board)
          .then(function (result) {
            //
          })
          .then(function () {
              self.resetForm();
              self.getBoards();
          })
          .catch(function (reason) {
            // alert
          });
      }
    };

    self.updateMember = function (member, boardId) {
      return member.isMember ? addMemberToBoard(member, boardId) : removeMemberFromBoard(member);
    };

    function addMemberToBoard(member, boardId) {
      return BoardsModel.addMemberToBoard(boardId, member)
          .then(function (users_boards_item) {
            member.users_boards_id = users_boards_item.id;
          }, function (error) {
            member.users_boards_id = null;
            member.isMember = false;
          })
    }

    function removeMemberFromBoard(member) {
      return MemberModel.destroy(member.users_boards_id)
          .then(function (data) {
            member.users_boards_id = null;
          }, function (error) {
            member.isMember = true;
          })
    }

    self._init();
  }

})();