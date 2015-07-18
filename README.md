# Noterious 


Welcome to the Noterious app. It is built using AngularJS with Backand as the backend. If you would like to see it in action, visit http://noterious.backand.net; if you want to run it locally, read on!

## Prerequisites
Before you start, you will need:
* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node.js and Node Package Manager (NPM)](https://nodejs.org/download/)

## Getting started

To start off, you will need to set up an account with Backand:
* Navigate to [backand.com](https://www.backand.com/) and click `Sign Up`
* Create an app (named whatever you want)
* Click on your new app's URL
* After app creation, in the "New Hosted Database" tab paste the following JSON into the "Custom Model" text box and click 'Next' :
```
[
  {
    "name": "boards",
    "fields": {
      "users": {
        "collection": "users_boards",
        "via": "board"
      },
      "notes": {
        "collection": "notes",
        "via": "board"
      },
      "title": {
        "type": "string",
        "required": true
      },
      "description": {
        "type": "string",
        "required": true
      },
      "isPublic": {
        "type": "boolean"
      },
      "dueDate": {
        "type": "datetime"
      }
    }
  },
  {
    "name": "notes",
    "fields": {
      "title": {
        "type": "string",
        "required": true
      },
      "content": {
        "type": "string"
      },
      "image": {
        "type": "text"
      },
      "board": {
        "object": "boards"
      }
    }
  },
  {
    "name": "users",
    "fields": {
      "boards": {
        "collection": "users_boards",
        "via": "member"
      },
      "email": {
        "type": "string"
      },
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "title": {
        "type": "string"
      }
    }
  },
  {
    "name": "users_boards",
    "fields": {
      "member": {
        "object": "users"
      },
      "board": {
        "object": "boards"
      }
    }
  },
  {
    "name": "history",
    "fields": {
      "board": {
        "type": "float"
      },
      "oldData": {
        "type": "string"
      },
      "newData": {
        "type": "string"
      }
    }
  }
]
```
* Get the code:
```
git clone https://github.com/backand/simple-noterious-app.git
cd simple-noterious-app/src
```

* You need to install all of your dependencies.
```
bower install
```
* Install serve package so you can run the app.

```
npm install -g serve
```

* Update the your App's details in **app/Noterious.js** file for the example to work:

  * Replace **'Your-App-Name'** with the new app name
  * Replace **'Your-SignUp-Token'** with SignUp token. In Backand dashboard under Security & auth --> Configuration.
  * Replace **'Your-Anonymous-Token'** with Anonymous token:
   ** In Backand dashboard under Security & auth --> Configuration enable Anonymous
   ** Set the Anonymous users assigned role to 'ReadOnly'
   ** Copy the Anonymous Token
  

* Run the server package for the /src folder

```
server 
```
Navigate to [http://localhost:3000](http://localhost:3000) and view the gloriousness that is Noterious!

**To access the app on the first time use your Admin username and password. Backand always add the Admin as the first registered user of the app.**

## Configuring the Application

1. Log in to Backand
2. Open the application that you created in the previous section


### Add new Board

In this demo app boards are setup to have members or be public. 
Each board should have assigned members that will be able to view it unless it marked as public and then anyone can view it.
For the current user to view a new board we will add a server side code that add associate the user with the board. This required a new item in users_boards object.

#### Add current user as member of the board

1. Open Action tab for boards object (under the Objects menu)
2. Click +New Action
3. Name: AddDefaultMember
4. Event Trigger: 'On Demand - Execute via REST API'
5. Type: Server Side JavaScript Code
6. JavaScript Code: Past this code under the '// write your code here' before the return {}

```javascript

//Get the member id of the current user 
var members = $http({method:"GET",url:CONSTS.apiUrl + "/1/objects/users?filter=" + 
"[{\"fieldName\": \"email\",\"operator\": \"equals\",\"value\": \"" + 
userProfile.username + "\"}]", headers: {"Authorization":userProfile.token}});

// Add Default member by POST to users_boards
var ubObj = {member: members.data[0].id, board: dbRow.id};
console.log(ubObj); //debug
$http({method:"POST",url:CONSTS.apiUrl + "/1/objects/users_boards", data:ubObj, 
headers: {"Authorization":userProfile.token}});
  
```

7. Save
8. Test the action by clicking on 'Test Action'. You should see response '200 - OK' and in the Debug Console: ``` [{"Key":"member","Value":1},{"Key":"board","Value":null}] ```
9. Review the existing code - no action required:
  * In 'app/common/models/boards-model.js' the 'create' function, after successful $http.post, calls 'createDefaultMember' function to do $http.get call to the 'AddDefaultMember' action with the specific board id.
  * create (Angular function) --> createDefaultMember (Angular function) --> AddDefaultMember (backand Action)
  
10. Now go ahead and add the first board, type Title and Description (they are both required).
  
#### Add validation upon creating new board

We would like to and a due date that is calculated in the sever (in our example it will be + 7 days). The done to prevent users hacking the code we will do it in the server side Action.

1. Open Action tab for boards object (under the Objects menu)
2. Click +New Action
3. Name: Update due date
4. Event Trigger: 'Create - Before adding data'
5. Type: Server Side JavaScript Code
6. JavaScript Code: Past this code under the '// write your code here' before the return {}

```javascript
            
var today = new Date();
var newDate = new Date();
newDate.setDate(today.getDate() + 7);
userInput.dueDate = newDate;
console.log(userInput);
    
```

7. Save
8. Test the action by clicking on 'Test Action'. You should see response '200 - OK'
9. No Angular code for this
10. Add another board to see the due date is + 7 days.

#### Send email when new board is created

In order to send email when new board is created do the follow:

1. Open Action tab for boards object (under the Objects menu)
2. Click +New Action
3. Name: Send email
4. Event Trigger: 'Create - After data saved and committed'
5. Type: Send Email
6. To: Click on the anchor icon and select 'Username' under the 'userProfile'. The result: {{sys::username}}
7. Subject: type 'New board was added:' and click on the anchor to select Title under the 'userInput'. The result: New board was added: {{title}}
8. Optional: add text to the Message body
9. Save
10. Test the action by clicking on 'Test Action'. You should see response '200 - OK'
11. The result you should get an email (The email of the Admin).

## Configure boards list and select members

In the demo we would like to restrict boards to be viewed only by selected users. 
We would need to add functionality of selecting members (users) for each board and restrict the view to show only the boards the current user is member of.
In the Angular code we use module (isteven-multi-select) that creates a drop-down-like button with checkboxes.

#### Enable members selection

To enable members selection we would use Backand query, with the following steps:

1. Click + New Query under the Queries menu
2. Query Name: GetBoardsMembers
3. Input Parameters: board
4. Query: The query select all the users and join with users_boards to check who is member or not

```
  
SELECT DISTINCT users.*,
      users_boards.id as users_boards_id, 
      NOT ISNULL(users_boards.board) as isMember
  FROM users LEFT JOIN users_boards ON users.id = users_boards.member 
      AND users_boards.board = {{board}} 
    
```

5. Save
6. Test the query by entering the board id and click Test Query. (You can get board id from the Data tab under the boards object).
7. In the test results you should get 1 row with the current user email and first name. See the last column of Is Member is 1 (true). 

Update the Angular code to include the new query:

1. In 'app/common/models/boards-model.js' file under the self.all function uncomment the call to addBoardMembers.
2. The result should be:

```javascript

self.all = function () {
  return $http.get(getUrl())
    .then(extractData)
    .then(updateBoards)
    .then(addBoardMembers);
};
```
3. Go back to the browser 'http://localhost:3000/#/' and refresh. You should see a drop down selected users with 1 user selected.
4. Let's add more users in order to test this for real:
  * Open the Data tab under the users object
  * Click on + New Row and add user, provide: email, first and last name.
5. Refresh the browser page to see that now you have more users in the drop down list

#### Show boards based on members

Now we would like to change the boards list to display only the boards that the user is member in or the board is public.
To restrict the access we will stop using the default Get of the object and create new query, with the following steps:

1. Click + New Query under the Queries menu
2. Query Name: GetBoardsBasedOnCurrentUser
3. Input Parameters: isPublic
4. Query: The query select all the users and join with users_boards to check who is member or not

```
     
SELECT DISTINCT boards.* from boards
LEFT JOIN users_boards ON boards.id = users_boards.board
LEFT JOIN users ON users_boards.member = users.id
WHERE users.email = '%1' OR isPublic=%2
    
```

5. To replace the place holders %1, %2, %3 by real values click on the anchor icon:
  * Replace %1 with the current user username (email) by selecting 'username' at the top
  * Replace %2 with with the input parameter value (email) by selecting 'isPublic' under 'Parameters'  
6. The end result of the query:

```
     
SELECT DISTINCT boards.* from boards
LEFT JOIN users_boards ON boards.id = users_boards.board
LEFT JOIN users ON users_boards.member = users.id
WHERE users.email = '{{sys::username}}' OR isPublic={{isPublic}}
   
```
7. Save
8. Test the query by entering the 1 in the isPublic and click Test Query.
9. In the test results you should see all the boards you are member in or they're public.

Update the Angular code to include the new query:

1.In 'app/boards/boards-controller.js' file under self.getBoards function start using the getUsersBoards() function instead of all() function
2. The result should be:

```javascript

self.getBoards = function () {
  BoardsModel.getUsersBoards();
  //BoardsModel.all();
};

```
3. Go back to the browser 'http://localhost:3000/#/' and refresh.

#### Keep track of changes

In order to keep track of changes you can enable "Track changes" in any object in Backand (under the Settings tab). 
In this example we will implement it with internal history object that keep track of the changes in the title.

The history object is already exists, and we need to add event trigger in the server side action. 
The trigger will get the existing and the new title and insert new item to history object.

1. Open Action tab for boards object (under the Objects menu)
2. Click +New Action
3. Name: Update history
4. Event Trigger: 'Update - During data saved before it committed'
5. Type: Transactional sql script
6. Sql Script:

```

INSERT INTO history (board, oldData, newData) 
       VALUES(%1,'%2','%3');
```

7. To replace the place holders %1, %2, %3 by real values click on the anchor icon: 
  * Replace %1 with the current board id by selecting 'id' under 'userInput'
  * Replace %2 with the title before the change by selecting 'title' under 'dbRow'   
  * Replace %3 with the title that the user enter by selecting 'title' under 'userInput'   

8. The end result Sql script should be like this:

```

INSERT INTO history (board, oldData, newData) 
       VALUES({{id}},'{{boards.title}}','{{title}}');
```
9. Save
10. Test the query by providing new title
11. To view the actual data open the Data tab under the users_boards object.

#### Update the security
In order to prevent from Users to get access directly to the boards object we need to restrict it.

1. Under the Security Tan of the board object, click on OVERRIDE and un-mark the Read permission of the User Role and Read-only Role. 
   At this point only Admin can read the data.
2. Update the code in the create, because the user can't access the object any more we need another way to get the board new id.
  * Every object has metadata property that hold the primary id of the object.
  * In 'app/common/models/boards-model.js' in createDefaultMember function change the board.id to board.__metadata.id
  * The end result of the code:

```javascript

function createDefaultMember (board) {
  return $http.get(Backand.getApiUrl() + '/1/objects/action/boards/' + board.id + '?name=AddDefaultMember')
    .then(extractData);
}
```

## Manage users

#### Sign-up

In order to let others sign-up to your app, you would need to make sure the sign-up token is valid in the main app config section
* In Backand dashboard under Security & auth --> Configuration copy the API Sign-up Token
* In the 'app/Noterious.js' file in the .config section make sure you have this line BackandProvider.setSignUpToken('Your-SignUp-Token');
* Replace the token you copy with the 'Your-SignUp-Token'
 
- To test it in the demo, click the logout option at the upper right corner, and do sign in with 'new User?' checkbox is marked.

In the code:
* To make the sign-up in the Angular code need to call **Backand.signup**(firstName, lastName, email, password, confirmPassword) - see 'app/common/models/user-model.js' file.
* For social login just call **Backand.socialSignUp**(provider). At the moment the options are: 'google', 'github', 'facebook' 

#### Public access with Anonymous

You can configure Backand to allow anyone without registration or username/password to access the data.
* To enable public access enable 'Anonymous Access' under Security & auth --> Configuration page.
* Select the role of the anonymous user gets, this will determent what the user can do and view. We recommend no more then read-only access but you can select any role.
* In this example we selected 'Read-Only' role.
* Copy the 'Anonymous Token' and make sure it match the one in the .config section in 'app/Noterious.js' file.


## Upload to AWS S3

