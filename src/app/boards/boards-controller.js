(function () {
'use strict';

angular.module('noterious')
  .controller('BoardsCtrl', ['BoardsModel','MemberModel','$filter', BoardsCtrl]);

  function BoardsCtrl (BoardsModel, MemberModel, $filter) {
    var self = this;

    self._init = function() {
      self.boards = null;
      self.resetForm();
      self.getBoards();
    };

    self.getBoards = function () {
      BoardsModel.all()
        .then(function(data){
            self.boards = data;
            MemberModel.all()
                .then(addMembers);
          })
    };

    function addMembers(data){
      self.boards.forEach(function (board) {
        board.allMembers = angular.copy(data);

        BoardsModel.getUsers(board.id).then(function(users) {
          users.forEach(function (user) {
            var member = $filter('filter')(board.allMembers, {id: user.member});
            if (member.length == 1)
              member[0].isMember = true;
          });
        });
      });
    }

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

    self.updateMember = function (member, board) {
      return member.isMember ? addMemberToBoard(member, board) : removeMemberFromBoard(member, board);
    };

    function addMemberToBoard(member, board) {
      board.users.push({member: member.id, board:board.id});
      BoardsModel.update(board.id,board)
          .then(function(data){
            console.log(data);
          });
    }

    function removeMemberFromBoard(member, board) {
      var foundItem = $filter('filter')(board.users, { member:{ id: member.id}  }, true)[0];
      board.users.splice(board.users.indexOf(foundItem),1);

      BoardsModel.update(board.id,board);
    }


    self._init();
  }

})();