# redux-postgrest demo

This is a usable demo that illustrates how redux-postgrest, along with websockets, can be used to build an entire CRUD application by way of TodoMVC.

## Key Features

- Dispatching actions to call the Postgrest API
- Using selectors to retrieve API responses from the provided redux-postgrest store
- Using a simple websocket implementation along with pg_websocket to keep front end data in sync - try using two browser windows side by side

## Files to look at

- [docker-compose.yaml](https://github.com/andytango/redux-postgrest-demo/blob/master/docker-compose.yml)
- [db/ddl.sql](https://github.com/andytango/redux-postgrest-demo/blob/master/db/ddl.sql)
- [src/App.js](https://github.com/andytango/redux-postgrest-demo/blob/master/src/App.js)
- [src/actions.js](https://github.com/andytango/redux-postgrest-demo/blob/master/src/actions.js)
- [src/ws.js](https://github.com/andytango/redux-postgrest-demo/blob/master/src/ws.js)

That's it!

## How to run it

*You will need to install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/).*

As per usual:

```sh
yarn install
```
Then:
```sh
yarn start
```
Then:
```sh
yarn run db:setup
```

For fun, try adding some todos then, while the app is open in your browser:
```sh
yarn run db:clean
```
