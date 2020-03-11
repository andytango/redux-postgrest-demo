const initialState = { show: false, todo_idx: -1 };

export const SHOW_TODO_IMAGE = "SHOW_TODO_IMAGE";
export const HIDE_TODO_IMAGE = "HIDE_TODO_IMAGE"

export default function todoImage(state = initialState, { type, ...action }) {
  if (type === SHOW_TODO_IMAGE) {
    return {show: true, ...action};
  }

  if(type === HIDE_TODO_IMAGE) {
    return initialState
  }

  return state;
}
