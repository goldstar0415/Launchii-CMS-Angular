# Launchii

[![Build Status](https://circleci.com/gh/launchii/angular-admin/tree/master.svg?style=shield&circle-token=63f9be8fce16169cf5fec4b8c9b2c40497c381d0)](https://circleci.com/gh/launchii/angular-admin/tree/master)

## Getting started

### Install Node modules and Bower Components

First off, you will need to install the required modules:

```
    npm install
    bower install
```

*Please notify a team member if the specs are not passing.*

### Configuration

Set up api domain in `app/core/constants.js`. Make sure to add a trailing slash.

### Start up server:

Simple server setup:

For global install:

```
    npm install -g http-server
```
Go to Launchii Admin project directory and enter command:

```
    http-server -o
```

For local installation, go to Launchii Admin project directory and do command:

```
    npm install http-server
```

Then run server:

```
    node_modules/http-server/bin/http-server -o
```

### Open:

Navigate to the website via your browser:

```
    http://localhost:8080
```
