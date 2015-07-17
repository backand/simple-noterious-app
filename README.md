# Noterious 


Welcome to the Noterious app. It is built using AngularJS with Backand as the backend. If you would like to see it in action, visit http://noterio.backand.net; if you want to run it locally, read on!

## Prerequisites
Before you start, you will need:
* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node.js and Node Package Manager (NPM)](https://nodejs.org/download/)

## Setting up Backand

To start off, you will need to set up an account with Backand:
* Navigate to [backand.com](https://www.backand.com/) and click `Sign Up`
* Create an app (named whatever you want)
* Click on your new app's URL
* Continue with the following instructions:

#### Build the model
After app creation, paste the following JSON into the "Custom Model" text box on the "New Hosted Database" tab:
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
      "join_date": {
        "type": "datetime"
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





## Run the App

You need to install all of your dependencies.
```
bower install
```
And install and run the serve package so you can build the app.

```
npm install -g serve
serve src/
```

Navigate to http://localhost:3000 and view the gloriousness that is Noterious!
