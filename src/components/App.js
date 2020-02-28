import React from "react";
import { Provider } from "react-redux";
import store from "../store";
import TodoForm from "./TodoForm";
import TodoHeader from "./TodoHeader";
import Todos from "./TodoList";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="App-container">
          <TodoHeader />
          <div>
            <TodoForm />
            <hr />
            <Todos />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
