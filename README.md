# Noterious 

Welcome to the Noterious app. It is built using AngularJS with Backand serving as the back end. If you would just like to see the app in action, visit http://noterious.backand.net. If you would like to run the app yourself, read on!

## Prerequisites
Before you start, you will need to install the following:
* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node.js and Node Package Manager (NPM)](https://nodejs.org/download/)

## Getting started

First, we'll create an account with Backand and create our base app:

* Navigate to [backand.com](https://www.backand.com/) and click `Sign Up`
* Create an app (named whatever you want)
* Click on your new app's URL. Don't navigate away from the next page.

Once an account has been created, we're ready to start building out the back end. In the "New Hosted Database" tab paste the following JSON into the "Custom Model" text box and click 'Next' :

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

Next, we'll pull down the application's AngularJS source code. First, open a command prompt on your machine. Then, navigate to the base directory for your source code. Once you are in the desired directory, enter the following commands:

```
git clone https://github.com/backand/simple-noterious-app.git
cd simple-noterious-app/src
```

After the code has been pulled down, we'll install additional dependencies using [Bower](http://bower.io/). From the command line used in the previous step, enter the following commands:

```
bower install
```

Once the app's dependencies have been installed, we need to install Node's Serve package in order to run the code. Execute the following from your command line window:

```
npm install -g serve
```

Before running the app, we need to change a few items in the app's code. Open the file **app/Noterious.js** in a text editor, and make the following changes:

  * Replace **'Your-App-Name'** with the new app name you chose when creating your Backand account
  * Replace **'Your-SignUp-Token'** with the SignUp token for your Backand application. This is found in the Backand dashboard under "Security & auth --> Configuration".
  * Replace **'Your-Anonymous-Token'** with your application's Anonymous token:
    1. In Backand dashboard, under "Security & auth --> Configuration," enable Anonymous Access by clicking on the toggle on the right side of the page.
    2. Set the Anonymous users assigned role to 'ReadOnly' in the provided drop down box.
    3. Copy the Anonymous Token from the text box in the Anonymous access section.
    4. Replace **Your-Anonymous-Token** with the value copied from the Backand dashboard.
  

Now we're ready to run the app! In your terminal window, simply type:

```
serve
```

And that's it - your Noterious app is now running on [http://localhost:3000](http://localhost:3000). Navigate to that URL and view the majesty and glory of Noterious!

* **Note:** Backand automatically adds your username and password for the Backand dashboard as the first registered user of any app you create. Use this information to log in to the Noterious app and explore.*

## Configuring the Application

Next, we're going to make some changes to the Noterious app. Let's start by opening the Noterious admin dashboard:

1. Log in to [Backand](https://www.backand.com) using your admin login information
2. Open the application that you created in the previous section.


### Add new Board

Boards in the demo app can be set to either be public or to be restricted to specific application users. If a board is marked as 'public,' then any user that can log in to the application can see that board. Otherwise, only specific assigned members can view the board. Below we will build out functionality that allows you to add the current user to a new viewable board. We'll do this with Backand's Server Side JavaScript Code action. We will add this action to the boards object by performing the following tasks:

#### Add the current user as a member of the board

1. Open the Action tab for the boards object (which can be found under the "Objects" menu in the Backand dashboard.)
2. Click "+New Action" and enter the following details in the fields provided. Note that some fields won't be available until the prior step has been completed:
  1. Name: AddDefaultMember
  2. Event Trigger: 'On Demand - Execute via REST API'
  3. Type: Server Side JavaScript Code
  4. JavaScript Code: Past this code under the `// write your code here` comment, and before the `return {}` command

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

  5. Save
3. Test the action by clicking on 'Test Action' on the right side of the web page. You should see response '200 - OK' and the Debug Console should contain `[{"Key":"member","Value":1},{"Key":"board","Value":null}]`

  **NOTE:** let's review the existing code:
  In the file `app/common/models/boards-model.js`, the `create` function, after a successful $http.post, calls the `createDefaultMember` function to perform a `$http.get` call to the 'AddDefaultMember' action with the specified board id.
  
  The control flow for this code segment is:
  ``` create (Angular function) --> createDefaultMember (Angular function) --> AddDefaultMember (Backand Action) ```
  
Now you can add the first board to your app! From the main application page at [http://localhost:3000](http://localhost:3000), create a new board using the provided box. Enter the board's title in the "Board title" field, and the board's description in the "Board Description" field (note: both fields are required). Finally, hit the "+" icon in the app to create your new board!
  
#### Add validation upon creating new board

Next, we'll add a due date to the board. The due date, which in this example will be 7 days after the current date, will be calculated on the server as a server side Action. This prevents users from hacking the code to obtain an earlier due date. To add the due date:

1. Open the `boards` object from the `Objects` menu.
2. Open the Action tab.
3. Click +New Action and enter the following information:
  1. Name: Update due date
  2. Event Trigger: 'Create - Before adding data'
  3. Type: Server Side JavaScript Code
  4. JavaScript Code: Past this code under the `// write your code here` comment, and before the `return {}` command

    ```javascript         
    var today = new Date();
    var newDate = new Date();
    newDate.setDate(today.getDate() + 7);
    userInput.dueDate = newDate;
    console.log(userInput); 
    ```

  5. Press `Save`
  6. Test the action by clicking on 'Test Action'. You should see the response '200 - OK'

And we're finished! We were able to add a due date to our boards object, and we didn't need to write any Angular code to do so! To test this new functionality, load your local application instance at [http://localhost:3000](http://localhost:3000) and create a new board. Once the board is created, you should see a due date property that is set to 7 days in the future.

#### Send email when new board is created

Now we're going to add the ability to send an email when a new board is created. To do so, we'll make use of the `Send Email` action. To create the new action:

1. Open the `boards` object from the `Objects` menu.
2. Open the Action tab.
3. Click "+New Action" and enter the following information:
  1. Name: Send email
  2. Event Trigger: 'Create - After data saved and committed'
  3. Type: Send Email
  4. Build the email to send:
    1. Click on the anchor icon above the 'To:' text box and select 'Username' from the 'userProfile' group. The text box should now contain the value `{{sys::username}}`
    2. In the Subject text box, type 'New board was added:', and then click on the anchor icon. Select 'Title' from the 'userInput' group. The text box should now contain the value `New board was added: {{title}}`
    3. (Optional) Add text to the Message field. This will appear in the email's body.
  5. Save the action
  6. Test the action by clicking on 'Test Action'. You should see the response '200 - OK'

You should now have a new email in your inbox, demonstrating the action at work! This runs after every new board is created and saved. To test locally, open your application instance at [http://localhost:3000](http://localhost:3000) and create a new board. Once the board has been created, you should receive an email with the subject "New board was added: {board name}"!

## Configure the boards list and select members

While we have a powerful note management app, we can make it more flexible by adding the ability to restrict note boards that are created to specific app users. To do so, we need to first add the ability to select board members from our app's pool of users, and then we need to restrict the user's view to only show those boards of which the user is a member. Well accomplish this by both modifying the app's Angular code and by adding a new custom query to the app's Backand dashboard.

#### Enable member selection

To enable member selection, we first need to create a new Backand query. To create a new query:

1. Log in to your app's Backand dashboard
2. Select 'Queries' from the menu on the left side of the page
3. Click `+ New Query`
4. Enter the following information into the provided fields:
  1. Query Name: GetBoardsMembers
  2. Input Parameters: board
  3. Query: Enter the query below. This query performs a join between the users and the users_boards tables, and returns all users that are marked as members of the current board:

    ```sql
    SELECT DISTINCT users.*,
          users_boards.id as users_boards_id, 
          NOT ISNULL(users_boards.board) as isMember
      FROM users LEFT JOIN users_boards ON users.id = users_boards.member 
          AND users_boards.board = {{board}}   
    ```

5. Save the query
6. Test the query by entering a board id and clicking "Test Query". You can get a board's id from the "Data" tab in the "boards" object.

The query should return a single row that contains the current user's email and first name. Note that the 'isMember' column contains 1 for 'true'. Now, let's update the app's Angular code to include the new query:

1. Open the file 'app/common/models/boards-model.js' 
2. In the self.all function, uncomment the call to addBoardMembers (`.then(addBoardMembers)`) and delete the semicolon on the prior line (`.then(updateBoards);`). The resulting code will look like the following:
 
  ```javascript
  self.all = function () {
    return $http.get(getUrl())
      .then(extractData)
      .then(updateBoards)
      .then(addBoardMembers);
  };
  ```
3. Go back to the browser [http://localhost:3000/](http://localhost:3000/) and hit 'refresh'. 

You should now see a drop-down menu on each board item with the value "(1)", indicating that 1 member has been selected for that board. Let's add some more users to really test the functionality!

1. Open the Backand dashboard for your app.
2. Open the `users` object from the `Object` menu.
3. Select the "Data" tab.
4. Click on "+ New Row" and add a user. You should provide the following data:
  * Email address
  * First name
  * Last name

Now, when you refresh the main application page on your local machine, you should see more than one user listed in each drop down!

#### Show boards based on members

Next, we'll restrict the boards list to only display boards that are marked public and boards of which the current user is a member. We will accomplish this by creating a new query to fetch the appropriate boards, and changing the method we currently use to obtain the board list for the current user. To implement access restrictions:

1. Log in to your app's Backand dashboard
2. Select 'Queries' from the menu on the left side of the page
3. Click `+ New Query`
4. Enter the following information into the provided fields:
  1. Query Name: GetBoardsBasedOnCurrentUser
  2. Input Parameters: isPublic
  3. Query:  Enter the query below. This query will join users with boards and users_boards, then filter the records based on whether or not the user is a member of the board or if the board is marked 'public':

    ```sql
    SELECT DISTINCT boards.* from boards
    LEFT JOIN users_boards ON boards.id = users_boards.board
    LEFT JOIN users ON users_boards.member = users.id
    WHERE users.email = '%1' OR isPublic=%2
    ```
  4. The query entered in the previous step used a couple placeholders - `%1` and `%2`. For this query to work properly, we need to replace these placeholders with the correct values from the database. Replace the placeholders with the following values (obtained by clicking on the 'anchor' icon above the 'Query' dialog):
    * Replace %1 with the current user username (email) by selecting 'username' from the "Query Parameters" popup
    * Replace %2 with with the input parameter value (isPublic) by selecting 'isPublic' from the 'Parameters' group in the "Query Parameters" popup
  5. The query should now look like the following:

    ```sql
    SELECT DISTINCT boards.* from boards
    LEFT JOIN users_boards ON boards.id = users_boards.board
    LEFT JOIN users ON users_boards.member = users.id
    WHERE users.email = '{{sys::username}}' OR isPublic={{isPublic}}
    ```
  6. Save the query
  8. Test the query by entering the 1 in the isPublic and clicking "Test Query".

The test results should list all boards of which the current user is a member, as well as all boards marked 'Public'. Now, let's update the app's Angular code to use this new query:

1. Open the file 'app/boards/boards-controller.js'
2. Locate the `self.getBoards` function.
3. Modify the getBoards method to use the "getUsersBoards" function by uncommenting the `BoardsModel.getUsersBoards();` line.
4. Comment out the `BoardsModel.all();) line. The code should now look like the following:

  ```javascript
  self.getBoards = function () {
    BoardsModel.getUsersBoards();
    //BoardsModel.all();
  };
  ```
5. Save the file

Now, go back to your browser and refresh your local app's page ([http://localhost:3000/](http://localhost:3000/)). Your view should now be restricted to only show those boards of which you are a member, and those boards that are marked "public". To test this thoroughly, we can modify the board membership settings directly from the app's dashboard:

1. Open your app's Backand dashboard.
2. Click 'Objects'
3. Click 'users_boards'
4. Click on the 'trash can' icon at the beginning of one of the rows and confirm the deletion of that row
5. Refresh your local app's instance

You should now see one fewer board on your local app's home page!

#### Keep track of changes

Backand gives you the ability to automatically track any changes to any object in your application. You can enable this in the "Settings" tab for any of the objects present in your system. Simply click the toggle next to "Track Changes," and future actions will be tracked on that table. In this example, however, we'll implement a server-side action that updates an internal history object, keeping track of changes to a board's title parameter.

We already created the "history" object when we first created the application, by specifying its structure in the initial database schema. We simply need to add a server side action that triggers off the appropriate event in order to populate the data. This trigger will insert a new record into the "history" table every time a board is modified, providing the old title and the new in a single row. To implement this action:


1. Open the `boards` object from the `Objects` menu.
2. Open the Action tab.
3. Click "+New Action" and enter the following information:
  1. Name: Update history
  2. Event Trigger: 'Update - During data saved before it committed'
  3. Type: Transactional sql script
  4. Sql Script:

    ```sql
    INSERT INTO history (board, oldData, newData) 
           VALUES(%1,'%2','%3');
    ```

  5. Replace the placeholder values in the query (%1, %2, and %3) with the following fields from the Query Parameters dialog (triggered by clicking on the 'anchor' icon):
    * Replace %1 with the current board id by selecting 'id' from the 'userInput' group
    * Replace %2 with the old title by selecting 'title' from the 'dbRow' group
    * Replace %3 with the new title entered by the user by selecting 'title' from the 'userInput' group
  6. The SQL query should now look like the following::

    ```sql
    INSERT INTO history (board, oldData, newData) 
           VALUES({{id}},'{{boards.title}}','{{title}}');
    ```
9. Save the query

Now we can test our query directly in our local app instance! Open your local app ([http://localhost:3000/](http://localhost:3000/)) and change the name of one of your note boards. Now, open the Backand dashboard for your app and open the 'history' object. Under the 'data' tab you should see a new row containing a record of the change you just made.

#### Restrict access to boards object

We have almost fully secured our application. At this point, any user can still create a board and will have access to the full board object. However, this is not always desirable. Below we'll look at an alternative way of using the `boards` object that is more secure, but still allows users to create and modify their own boards. To further restrict access to the `boards` object:

1. Open the `boards` object from the `Objects` menu.
2. Open the Seurity tab.
3. In the 'Pre-defined Filter' section we can add more restrictions that will be part of query Backand run on the database. Because the Pre-defined Filter is done in the server side it can't be overwrite which make it most secure.
4. Add SQL to make sure we bring the boards that user is member in or public. The code is similar to the 'GetBoardsBasedOnCurrentUser' query (you can also simply use the pre-defined filter instead of the query). The SQL should look like the following:

  ```
  EXISTS (select users_boards.id from users_boards
    LEFT JOIN users ON users_boards.member = users.id
  WHERE users_boards.board = boards.id AND 
        (users.email = '{{sys::username}}' OR isPublic=1))
  ```

Now we are ready to test! To test the query, modify the `self.getBoards` function in file 'app/boards/boards-controller.js' so that it uses `BoardsModel.all()`. After this change, refresh your local instance and notice how the code is still pulling in the correct, restricted boards.


## Manage users

Once the main functionality is completed, we need to configure the users portion of our application. Below we'll look at two ways to manage use of the app: via user sign-up, and via public anonymous access.

#### Sign-up

In the previous steps, we updated our API Sign-Up token in the Angular code to match the value provided in our application's Backand dashboard. First, let's verify that that token is still valid.

1. In Backand dashboard under "Security & auth --> Configuration," copy the API Sign-up Token provided.
2. Open your local copy of Noterious.js (located in the app's 'src' folder under 'app/Noterious.js').
3. In the .config section of Noterious.js, make sure you have this line: BackandProvider.setSignUpToken('##########');
4. Ensure the value provided in this function matches the value you recorded in step 1.

Now, in order to enable user registration, we need to make our app public. To do this:

1. Open the application's Backand dashboard.
2. Navigate to 'Security & Auth --> Configuration'
3. Click the toggle next to "Public App" to enable any user to register for your application

Once this is done, users can now register for your application through the login page. To test this in your local application, log out of the app by clicking on the "logout" option in the upper right corner. Next, sign in to your application with a new email address and password, making sure to check the "New user?" checkbox.

The code to manage user registration has already been written for you! You can see how this is done by examining the code in the following locations:
* User registration is handled in file 'src/app/common/models/user-model.js' - search for the call to **Backand.signup**(firstName, lastName, email, password, confirmPassword) in function `self.register`
* Social networking login functionality is handled in the same file ('src/app/common/models/user-model.js') with the function **Backand.socialSignUp**(provider). At the moment the options are: 'google', 'github', 'facebook'. This can be found in the function `self.socialLogin

#### Public access with Anonymous

In addition to registered users, you can also configure your Backand application to allow anyone to access your site - without any need to register or log in. We did this during the initial application setup, so we should only need to verify that this is already done. To enable anonymous acess:
* Open the 'Security & Auth --> Configuration' section of the Backand dashboard.
* Enable anonymous access by clicking the toggle next to "Anonymous Access"
* Select the role for anonymous users by picking a role from the "Anonymous users assigned role" dropdown (in the example above we selected 'ReadOnly') access for anonymous users. This setting determines what anonymous users can see and do in your application. We recommend restricting anonymous users to a read-only level role, but you can of course select any role you desire.
* Copy the 'Anonymous Token' and make sure it matches the value recorded in the .config section of the 'app/Noterious.js' file we worked with in the previous step.

## Upload to AWS S3

Backand Actions allow you to integrate with any RESTful API, either by directly calling the API from an Action via an HTTP request or by building custom node.js code and calling it. In this section, we'll work with some useful functionality provided by Backand that allows you to upload data into Amazon's AWS S3 service.
 
To implement this functionality, we'll use a server-side JavaScript action - the application code to handle images has already been written for you! We simply need to tie it into Backand using the following steps:

(**NOTE:** In order to upload data to Amazon S3, you will need to create an account with Amazon. Once you have created your account, replace the "key", "secret", and "bucket" values in the JavaScript code below with the values for your account)

1. Navigate to the Backand dashboard for your application
2. Open the Action tab for the `notes` object (which can be found under the "Objects" menu in the Backand dashboard.)
2. Click "+New Action" and enter the following details in the fields provided:
  1. Name: upload2s3
  2. Event Trigger: 'On Demand - Execute via REST API'
  3. Type: Server Side JavaScript Code
  4. JavaScript Code: Paste this code under the `// write your code here` comment, and replace the `return {}` command:
  
  
    ```javascript

    var data = 
		{
		    // enter your aws key
            "key" : "AKIAIJX26SY3COIWV4FQ", 
            
            // enter your aws secret key
            "secret" : "ogun3pSOyw8FtP5i17s2STBPO9jQ8cs+lnpxwg82", 

            // this should be sent in post body
            "filename" : parameters.filename, 
            "filedata" : parameters.filedata,         

            "region" : "US Standard",
        	"bucket" : "backand-free-upload"
        	
		}
    var response = $http({method:"PUT",url:CONSTS.apiUrl + "/1/file/s3" , 
                   data: data, headers: {"Authorization":userProfile.token}});

	return response;

    ```

5. Modify the code above to incorporate your personal AWS account's data - replace `secret`, `key`, and `bucket` with the correct values for your account.
6. Save the action


Now we are ready to add images to our notes. To test the new AWS S3 upload functionality, add a new note to any board in your local app, and upload a new image to that note. Once you've done so, you should be able to see the new image file in your Amazon AWS S3 account!

