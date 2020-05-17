<img src="https://github.com/haron68/favr-frontend/blob/master/src/assets/brand/favr_logo_rd.png" alt="FAVR logo" height="40" width="140">

# FAVR Frontend


## Table of Contents
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [App Preview](#app-preview)
- [Deploying](#deploying)
  - [Progressive Web App](#progressive-web-app)
  - [Android](#android)
  - [iOS](#ios)


## Getting Started
* Recommended to [use NVM](https://github.com/nvm-sh/nvm)
* [Download the installer](https://nodejs.org/) use the latest stable LTS.
* Install the ionic CLI globally: `npm install -g @ionic/cli`
* Clone this repository: `git clone https://github.com/FAVR-Inc/app.git`.
* Run `npm install` from the project root.
* Run `npm run start` in a terminal from the project root.

_Note: See [How to Prevent Permissions Errors](https://docs.npmjs.com/getting-started/fixing-npm-permissions) if you are running into issues when trying to install packages globally._

### Building
* Run `ionic build` for testing environment
* Run `ionic build --prod` for production environment

### Progressive Web App
1. Un-comment [these lines](https://github.com/ionic-team/ionic2-app-base/blob/master/src/index.html#L21)
2. Run `npm run ionic:build --prod`
3. Push the `www` folder to your hosting service

### Android
1. Run `npx cap copy` or `npx cap sync`
2. Run `npx cap open android`

### iOS
1. Run `npx cap copy` or `npx cap sync`
2. Run `npx cap open ios`
