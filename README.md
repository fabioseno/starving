# Starving App

## Description

Every day Pragma team spends 30 minutes trying to decide where to go for lunch. The Starving app was built to help them overcome this problem.


### 1. Pre-requisites

Make sure you have the following tools installed on your machine in order to run or test the aplication:

- [NodeJS](https://nodejs.org/en/)
- [Git](https://git-scm.com/downloads)

### 2. Setting up environment

On the computer's Terminal (Mac) or CommandPrompt (Windows), git clone the repository below to have a copy of both frontend and backend source files.

```
git clone https://github.com/fabioseno/starving
```


## App project (Ionic with AngularJS)

### 1. Setup

Once you have NodeJS installed, run the following commands to install proper utilities:

- **[Bower](https://bower.io/)** (package manager commonly used for frontend libraries)
```
npm install -g bower
```

- **[Karma](https://karma-runner.github.io/1.0/index.html)** (task runner that executes Jasmine tests on the app)
```
npm install -g karma-cli
```

- **[Ionic](http://ionicframework.com/)** (mobile platform that generates hybrid mobile apps)
```
npm install -g cordova ionic
```

- Install application packages 
```
npm install
```

- Install application libraries
```
bower install
```

### 2. Considerations

Mobile app generation with Ionic won't be covered on this document. For further details see [http://ionicframework.com/getting-started/](http://ionicframework.com/getting-started/).

For the present project, it will be possible to preview the functional application on a browser.

An additional login/logout feature was added to the project as it is important to forbid users to vote more than once on the same day (User Story 1).

### 3. Running the application

Execute the following command to run the mobile application on a browser:
```
ionic serve
```

### 4. Testing the application

Execute the following command to run all the automated tests:
```
gulp test
```
```
PhantomJS 2.1.1 (Mac OS X 0.0.0): Executed 10 of 11 SUCCESS (0 secs / 0.087 secs
PhantomJS 2.1.1 (Mac OS X 0.0.0): Executed 11 of 11 SUCCESS (0 secs / 0.093 secs
PhantomJS 2.1.1 (Mac OS X 0.0.0): Executed 11 of 11 SUCCESS (0.006 secs / 0.093 secs)
[13:58:21] Finished 'test' after 1.82 s
```

## Server Project (NodeJS)

### 1. Setup

Once the entire respository has been cloned, navigate to the **server** folder on your Terminal or CommandPrompt and run the command:
```
npm install
```

### 2. Considerations

1. Due to the dificulty of the server to be tested, some application routes were slightly changed to allow the input of the option datetime parameter, which simulates the current date and time.

    **Routes**
    ```javascript
    // Get poll status
    router.get('/poll/status/:userId/:datetime?', pollController.getStatus);

    // Vote
    router.get('/poll/vote/:userId/:restaurantId/:datetime?', pollController.vote);
    ```

    **Example of invocation**

    Simulating a vote for user [4], restaurant [2] on [2017-04-01 08:03:29]
    ```
    http://localhost:3000/poll/vote/4/2/1491033809136
    ```

    **Production code**

    On production environment you may not want to expose these optional parameters so you can change the above routes and the application will then consider the server date and time instead.

    ```javascript
    // Get poll status
    router.get('/poll/status/:userId', pollController.getStatus);

    // Vote
    router.get('/poll/vote/:userId/:restaurantId', pollController.vote);
    ```

2. [IMPROVEMENT] Couldn't get the server to clear its state (past polls) between tests so I used different dates to avoid data collision.

### 3. Running the server

Execute the following command to start the server:
```
node app.js
```

An alternative solution to improve productivity during NodeJS application development is to use **[Nodemon](https://nodemon.io/)**, a package that automatically reloads the server if any modifications is made to the source code files. 


### 4. Testing the server

Execute the following command to run the server automated tests:
```
npm test
```

This will result in the following metrics:
```
14 tests, 17 assertions, 0 failures, 0 skipped
```

It is important to remind that the server should not be running at this time.

## Technical Considerations

As a requirement, the application was developed using AngularJS (yet on version 1.x) and wrapped with the Ionic platform, that relies on Cordova to have access to the mobile device as a hybrid mobile application.

### Improvements

The project was designed to run automated tests on both mobile application (frontend) and API (backend), which increases the quality of the application overall.

On a real project, more could have been done, such as adopting a documentation tool that reads JSDoc notation inside the source code to generate HTML files ([see YUIDoc](http://yui.github.io/yuidoc/)) with all documentation on a readable and structured way. This brings the eager of keeping the source code documentation always up-to-date for new incomers.

Another great tool that is quite simple to implement and adopt is the **Code Coverage Report** ([see Instambul](https://github.com/gotwarlost/istanbul)), which visually highlights  all source code lines that were executed by the automated tests.

On the app side, no additional Gulp taks was included to concatenate/minify Javascript and CSS files in order to reduce the overal application size.

### Code Considerations

#### Folder Structure

##### App (AngularJS)

It was adopted the feature-oriented folder structure instead of the default component-type folder structure (which is common in MVC projects). This approach is better suited for large applications that have many source files and demand a high level of file organization ([see this article](https://scotch.io/tutorials/angularjs-best-practices-directory-structure).

######Relevant file and folder structure
```
app
│
├───gulpfile.js   (Gulp configuration file)
├───karma.conf.js (test configuration file)
├───platforms     (cordova folder containing platform specific code and build packages)
├───plugins       (cordova folder for plugins. Contains only plugins added by Ionic by default)
├───tests         (test scripts)
└───www           (source code)
```

- **gulpfile.js** was modified to only copy necessary javascript files to the cordova www folder. It dramarically reduces the size of the application that needs to be upload to the stores (App Store, Google Play) and downloaded by the final users.

##### Server (NodeJS)

######Relevant file and folder structure
```
app
│
├───app.js        (Main server file that starts the web server)
├───controllers   (source code with all business logics)
├───routes        (source code with all routes - API definition)
└───spec          (test scripts)
```

#### Poll data structure

To allow all requirements to be developed on an organized way, the following data structure was designed:

```
Poll object
│
├───weekNumber1
│   ├──date1
│   │   ├──restaurant1
│   │   │    ├─voter1
│   │   │    └─voter2
│   │   │
│   │   └──restaurant2
│   │        ├─voter3
│   │        └─voter4
│   └──date2
│       ├──restaurant3
│       │    ├─voter5
│       │    └─voter6
│       │
│       └──restaurant2
│            ├─voter3
│            └─voter4
│
└───weekNumber2
    └──date1
        ├──restaurant1
        │    ├─voter1
        │    └─voter2
        │
        └──restaurant2
             ├─voter3
             └─voter4
```

``` javascript
var inMemoryPoll = {
    "8": { // weekNumber
        "2017-03-29": [ // for each day, list of restaurants voted
            {
                id: 1,
                votes: [1, 2, 3] // user votes
            },
            {
                id: 2,
                votes: [4, 5] // user votes
            }
        ],
        "2017-03-30": [ // for each day, list of restaurants voted
            {
                id: 1,
                votes: [3, 4] // user votes
            },
            {
                id: 2,
                votes: [1] // user votes
            }
        ]
    },
    "9": {
        ...
    }
}
```
#### REST API

##### Users

###### ListUsers
Retrieve a list of six pre-defined users from the server used to log into the mobile application.
```
GET http://localhost:3000/users
```

##### Poll

###### Get status of a poll
Asks the server about the current poll.

```
GET http://localhost:3000/status/:userId/:datetime?
```

As said before, ":datetime?" parameter is optional and was added to help testing the application.

It returns the following structures:

- The user hasn't yet voted and it's before noon.
```
var result = {
    status: 'open',
    restaurants: [{}, {}, {}]
}
```

- The user has already voted.
```
var result = {
    status: 'inProgress',
    restaurants: [{restaurant1}, {restaurant3}, {restaurant3}]
}
```

- The  poll has ended (everybody voted or time has past noon).
```
var result = {
    status: 'ended',
    restaurant: [{winner-restaurant}]
}
```

###### Choose a restaurant
Asks the server about the current poll.

```
GET http://localhost:3000/vote/:userId/:restaurantId/:datetime?
```

As said before, ":datetime?" parameter is optional and was added to help testing the application.

It computes the user vote and returns the same structure explained above.

#### Patterns and guidelines

- both app and server application codes were developed having in mind a modularized approach, which helps organization for medium/large projects on a multi-developer scenario.

- the server structure is straight-forward and does the basic. There are no middlewares, logging mechanism, database, and advanced exception handling.

- CORS is enabled on the server side and all poll data (votes) is stored in memory. To clean up all data it's only necessary to restart the server.

- all source code files are Linted on both App and Server projects. It decreases the time to find errors as well as provide a more readable code to other developers.

- on the app project, view logic and common code were developed on different files. The first were built using AngularJS controllers and the latter using AngularJS services.