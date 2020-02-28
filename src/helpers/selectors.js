import { path } from "ramda";

export const todosFromState = path(["api", "todos", "GET", "body"]);
