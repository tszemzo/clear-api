# Clear - Clients Dashboard API

## Getting started

There are a few things that you need in order to setup the project:

### Pre-requisites

- **[Docker](https://www.docker.com/)** (required for running our Mongo DB service)
- **[NVM](https://github.com/nvm-sh/nvm)** (not mandatory, nvm allows you to quickly install and use different versions of node via the command line)

* If you aren't using NVM, be sure to have a version of Node higher than +12.

After we've got the above installed, you should follow a few steps:

Clone this repository 

```
git clone https://github.com/tszemzo/clear-api.git
```

`cd` in to created directory

```
cd clear-api
```

Create the .env file and install all the modules with the following command:
```
cp .env.sample .env && npm install
```

Run Docker Compose so we set up our Mongo DB service
```
npm run docker:up
```

Finally we need to run the API with `npm start`.

To run the tests just use the command `npm run test`.

## Additional comments

A few improvals that may be added in the future:
- More testing
- More logging
- Middleware for permissions and permissions/roles (e.g. who can edit/remove/create a member, etc...)
- Better and customizable Error / Error messages
