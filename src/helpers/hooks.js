import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { todosFromState } from "./selectors";
import { makePgRestHooks } from "redux-postgrest";
import { processImageContent } from "../helpers/images";

const {
  useDispatchGet,
  useDispatchPost,
  useDispatchPatch,
  useDispatchDelete
} = makePgRestHooks("todos");

export function useGetTodos() {
  const dispatch = useDispatchGet();
  const todos = useSelector(todosFromState);
  const [isDispatching, setIsDispatching] = useState();

  const dispatchLoadAction = useCallback(() => {
    setIsDispatching(true);
    dispatch();
  }, [setIsDispatching, dispatch]);

  useEffect(() => {
    if (!todos && !isDispatching) {
      dispatchLoadAction();
    }
  }, [dispatchLoadAction, todos, isDispatching]);

  return todos;
}

export function useCreateTodo() {
  const dispatch = useDispatchPost();
  return useCallback(
    (content, imageContent) =>
      processImageContent(imageContent).then(image =>
        dispatch({ content, content_image: image })
      ),
    [dispatch]
  );
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
  const dispatch = useDispatchPatch();
  return useCallback(
    (todo_id, content) => dispatch({ todo_id: `eq.${todo_id}` }, { content }),
    [dispatch]
  );
}

export function useDeleteTodos() {
  const dispatch = useDispatchDelete();
  return useCallback(todo_id => dispatch({ todo_id: `eq.${todo_id}` }), [
    dispatch
  ]);
}
