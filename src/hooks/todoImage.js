import { prop } from "ramda";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useListTodos } from "../helpers/hooks";
import { HIDE_TODO_IMAGE, SHOW_TODO_IMAGE } from "../reducers/todoImage";

const selectImageTodoState = prop("todoImage");

export function useTodoImageState() {
  return useSelector(selectImageTodoState);
}

export function useDispatchHideTodoImage() {
  const dispatch = useDispatch();
  return useCallback(() => dispatch({ type: HIDE_TODO_IMAGE }), [dispatch]);
}

export function useDispatchShowTodoImage(todo_idx) {
  const dispatch = useDispatch();
  return useCallback(() => dispatch({ type: SHOW_TODO_IMAGE, todo_idx }), [
    todo_idx,
    dispatch
  ]);
}

export function useSelectTodoImage() {
  const todos = useListTodos()
  const {todo_idx} = useTodoImageState()
  
  return useMemo(() => {
    if(Array.isArray(todos) && todo_idx > -1) {
      return `data:*/*;base64,${todos[todo_idx].content_image}`
    }

    return ''
  }, [todos, todo_idx])
}