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
* Get the code:
```
git clone https://github.com/backand/simple-noterious-app.git
cd simple-noterious-app/src
```

* You need to install all of your dependencies.
```
bower install
```
* Install and run the serve package so you can build the app.

```
npm install -g serve
serve src/
```




Navigate to [http://localhost:3000](http://localhost:3000) and view the gloriousness that is Noterious!

