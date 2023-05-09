RM Panel
=====

RM Panel is a web control panel for managing your RM Shopify apps.

#### Contributors
> [itsmistad](https://github.com/itsmistad/) - Derek Williamson

## Development
### Requirements

1. bash (for Windows users, this can be obtained from GitBash or cmder)
2. [Node.js](https://nodejs.org/en/download/)
3. [MongoDB](https://www.mongodb.com/download-center/community)

## Setup

#### npm Packages

Download and install [Node.js](https://nodejs.org/en/download/) (which comes packaged with npm).
Run this command in the base directory of the repository:
> `npm install`

Your local repository should now be up-to-date with all the required packages for the application.

#### MongoDB

Download and install [MongoDB Community Server](https://www.mongodb.com/download-center/community).
Keep all settings as default during installation.

Your local database should now be up-and-running with the following connection string:
`mongodb://localhost:27017`

## Testing

From the base directory of the repo, run this to execute all tests:
> `npm test`

## Executing

Navigate to `./scripts/` and execute this script to (1) run any necessary migrations, (2) run all unit tests, and (3) start a local app instance:
> `./start.sh`

Execute this script to start gulp with the BrowserSync and Sass tasks:
> `./watch.sh`

Your local instance should be running and accessible at the following address:
`http://localhost:3000/`
