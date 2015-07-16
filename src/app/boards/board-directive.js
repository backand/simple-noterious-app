(function () {
  'use strict';

  angular.module('noterious')
    .directive('board', ['BoardsModel', 'MemberModel', BoardDirective]);

  function BoardDirective() {
    return {
      scope: {
        boardId: '@',
        board: '=',
        remove: '&'
      },
      templateUrl: 'app/boards/board.tmpl.html',
      controller: BoardController,
      controllerAs: 'boardCtrl',
      bindToController: true
    }
  }

  function BoardController(BoardsModel, MemberModel) {
    var self = this;

    self.board.isPublic = !!self.board.isPublic;
    self.loading = false;

    self.updateBoard = function () {
      self.loading = true;
      BoardsModel.update(self.boardId, self.board)
        .catch(function (reason) {
          // alert and revert
        })
        .finally(function () {
          self.loading = false;
        });
    };

    self.deleteBoard = function () {
      self.remove({boardId: self.boardId});
    };

    self.updateMember = function (member) {
      return member.isMember ? addMemberToBoard(member) : removeMemberFromBoard(member);
    };

    function addMemberToBoard(member) {
      return BoardsModel.addMemberToBoard(self.boardId, member)
        .then(function (data) {
          member.users_boards_id = data.id;
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
  }

})();