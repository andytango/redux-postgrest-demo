import { pick } from "ramda";

export const EDIT_TODO_FORM_CHANGE = "EDIT_TODO_FORM_CHANGE";

const initialState = { todo_id: -1, content: "" };

export default function editTodo(state = initialState, { type, ...action }) {
  if (isSubmitResponse(type, action)) {
    return initialState;
  } 

  if (type === EDIT_TODO_FORM_CHANGE) {
    return handleFormChange(action);
  }

  return state;
}

function isSubmitResponse(type, action) {
  return (
    type === "todos" &&
    action.meta.method === "PATCH" &&
    action.meta.kind === "RESPONSE"
  );
}

const handleFormChange = pick(["todo_id", "content"]);