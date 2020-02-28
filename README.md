# redux-postgrest demo

This is a usable demo that illustrates how we can use just `React`, `Postgres` and friends to build an entire CRUD application by way of TodoMVC, *without writing a  back-end.*

So no Rails, Django, Laravel, Spring, Koa, Play et cetera.

## Key Features

- Dispatching actions to call the Postgrest API
- Using selectors to retrieve API responses from the provided redux-postgrest store
- Using a simple websocket implementation along with pg_websocket to keep front end data in sync - try using two browser windows side by side
- Using clientside base64 encoding to upload and persist images in a Postgres `BYTEA` column

## How does it work?

Mainly down to these rather fabulous packages and their authors:
- [PostgREST](https://github.com/PostgREST/postgrest)
- [pg_listen](https://github.com/begriffs/pg_listen)
- [Websocketd](https://github.com/joewalnes/websocketd/)

This demo just glues everything together and adds some convenience features to make development as *effortless as possible*.

![data flows](https://raw.githubusercontent.com/andytango/redux-postgrest-demo/master/redux-postgrest.png "data flows")

We also use:
- [redux-postgrest](https://github.com/andytango/redux-postgrest) to translate redux actions into HTTP requests and responses
- A really simple [docker container](https://github.com/andytango/pg_websocket/) to plug `pg_listen` into `websocketd`.

## How much code are we talking about, exactly?

### Setup
- [Backend Stack](https://github.com/andytango/redux-postgrest-demo/blob/master/docker-compose.yml)
- [Database Schema](https://github.com/andytango/redux-postgrest-demo/blob/master/db/setup.sql)
- [Websocket Client](https://github.com/andytango/redux-postgrest-demo/blob/master/src/ws.js)

### Redux Store, Actions and Selectors
- [Store](https://github.com/andytango/redux-postgrest-demo/blob/master/src/store.js)
```js
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectPgRest } from "redux-postgrest";
import connectPgWebsocket from "./helpers/ws";

const { reducer, middleware } = connectPgRest({
  url: "http://localhost:8000"
});

const store = createStore(
  combineReducers({ api: reducer }),
  composeWithDevTools(
    connectPgWebsocket({ url: "ws://localhost:8080" }),
    applyMiddleware(middleware)
  )
);

export default store;
```

- [Actions](https://github.com/andytango/redux-postgrest-demo/blob/master/src/helpers/actions.js):
```js
import {createPgRestActions} from 'redux-postgrest'

export const createTodoAction = createPgRestActions("todos");
```

- [Selectors](https://github.com/andytango/redux-postgrest-demo/blob/master/src/helpers/selectors.js)
```js
import { path } from "ramda";

export const todosFromState = path(["api", "todos", "GET", "body"]);
```

### React 
- [Hooks](https://github.com/andytango/redux-postgrest-demo/blob/master/src/helpers/hooks.js)
- [Create Todo Form](https://github.com/andytango/redux-postgrest-demo/blob/master/src/components/TodoForm.js)
- [Todo List](https://github.com/andytango/redux-postgrest-demo/blob/master/src/components/TodoList.js)


That's it!

## How do I run it?

*You will need to install [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/).*

1. Clone this repo:
```sh
git clone git@github.com:andytango/redux-postgrest-demo.git
```

2. As per usual:

```sh
yarn install
```
3. Then:
```sh
yarn start
```
4. Then:
```sh
yarn run db:setup
```
5. Add/edit/delete some todos

6. For fun, try running this while the app is open in your browser:
```sh
yarn run db:clean
```

## But why?

Over the past decade, browsers and databases like Postgres have grown in their sophistication and capabilities to the extent that simple, stateful applications can be built without a back-end server. 

So why build and maintain three subsystems when you can get away with two?

### Doesn't this mean writing lots of SQL?
Yep.

### And can it scale?
[Absolutely](http://postgrest.org/en/v6.0/#in-production). 

*For a large number of concurrent users (above say 10,000 depending on hardware), you'll want something more efficient than websocketd for your websockets, as it relies on forking UNIX processes.*

### And what about the things that Postgres can't do, like working with external APIs?
For that you can go straight to [microservices](https://martinfowler.com/articles/microservices.html).

This isn't as hard as it sounds. The cost of developing in this way has been reduced by serverless products from cloud vendors, like AWS Lambda and GCP Run. 

Outside of the cloud, there's docker and docker-compose which have relatively shallow learning curves.

In fact, if you take a look at this project's [docker-compose file](https://github.com/andytango/redux-postgrest-demo/blob/master/docker-compose.yml), you'll see that this backend is essentially just a small suite of microservices.
