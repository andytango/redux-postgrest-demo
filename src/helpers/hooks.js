import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTodoAction } from "./actions";
import { todosFromState } from "./selectors";

export function useGetTodos() {
  const dispatch = useDispatch();
  const todos = useSelector(todosFromState);
  const [isDispatching, setIsDispatching] = useState();

  const dispatchLoadAction = useCallback(() => {
    setIsDispatching(true);
    dispatch(createTodoAction.get());
  }, [setIsDispatching, dispatch]);

  useEffect(() => {
    if (!todos && !isDispatching) {
      dispatchLoadAction();
    }
  }, [dispatchLoadAction, todos, isDispatching]);

  return todos;
}

export function useEditTodos() {
  const [editState, setEditState] = useState({});

  const editRow = useCallback(
    (todo_id, content) => setEditState({ todo_id, content }),
    [setEditState]
  );

  return { editRow, editState };
}

export function usePatchTodos() {
  const dispatch = useDispatch();
  return useCallback(
    (todo_id, content) =>
      dispatch(createTodoAction.patch({ todo_id: `eq.${todo_id}` }, {content})),
    [dispatch]
  );
}

export function useDeleteTodos() {
  const dispatch = useDispatch();
  return useCallback(
    todo_id => dispatch(createTodoAction.delete({ todo_id: `eq.${todo_id}` })),
    [dispatch]
  );
}
