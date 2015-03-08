# Paperbits
**Design inspiration and planning made easy!**

PaperBits is a full-stack JavaScript productivity app for creative people. The idea is to provide an interface similar to a digital scrap board, where user can create, store and refer to colors, images, urls, notes and todo tasks. This aggregates the common requirements on the inspiration and planning phases of design.

## About the app
PaperBits is created on top of the MEAN.JS Boilerplate, which uses Node.js, Express server, AngularJS and MongoDB.

## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Node.js - [Download & Install Node.js](http://www.nodejs.org/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:

```bash
$ npm install -g bower
```

* Grunt - You're going to use the [Grunt Task Runner](http://gruntjs.com/) to automate your development process. Make sure you've installed Node.js and npm first, then install grunt globally using npm:

```bash
$ npm install -g grunt-cli
```


## Install
After cloning this project, go to application root directory.

Install Node.js dependencies:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* If you're running in a development environment, it will then also install development dependencies needed for testing and running your application.
* Finally, when the install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application.

## Running the app
After the install process is over, run grunt default task:

```bash
$ grunt
```

Now the application will be running at [http://localhost:3000](http://localhost:3000)

## Live Example
Browse the live app on [http://paperbits.imagineer.in](http://paperbits.imagineer.in).

