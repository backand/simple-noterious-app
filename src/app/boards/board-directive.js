(function () {
  'use strict';

  angular.module('noterious')
    .directive('board', ['BoardsModel', 'MemberModel', BoardDirective]);

  function BoardDirective() {
    return {
      scope: {
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

    self._init = function () {
      self.loading = false;
    };

    self.updateBoard = function () {
      self.loading = true;
      BoardsModel.update(self.board.id, self.board)
        .catch(function (reason) {
          // alert and revert
        })
        .finally(function () {
          self.loading = false;
        });
    };

    self.deleteBoard = function () {
      BoardsModel.destroy(self.board.id)
        .catch(function (reason) {
          //
        })
        .finally(function () {
          self.cancelEditing();
        });
    };

    self.updateMember = function (member) {
      return member.isMember ? addMemberToBoard(member) : removeMemberFromBoard(member);
    };

    function addMemberToBoard(member) {
      return BoardsModel.addMemberToBoard(self.board.id, member)
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