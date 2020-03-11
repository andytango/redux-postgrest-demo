import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makePgRestHooks } from "redux-postgrest";
import { processImageContent } from "../helpers/images";
import { todosFromState } from "./selectors";

const {
  useDispatchGet,
  useDispatchPost,
  useDispatchPatch,
  useDispatchDelete
} = makePgRestHooks("todos");

export function useListTodos() {
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
  const [content, setContent] = useState("");
  const [imageContent, setImageContent] = useState(null);
  const submitTodo = useCallback(
    () =>
      processImageContent(imageContent).then(image =>
        dispatch({ content, content_image: image })
      ),
    [dispatch, content, imageContent]
  );

  return { content, setContent, setImageContent, submitTodo };
}

export function useEditTodo() {
  const [editState, setEditState] = useState({});
  const dispatch = useDispatchPatch();
  const submitTodo = useCallback(
    (todo_id, content) => {
      setEditState({})
      dispatch({ todo_id: `eq.${todo_id}` }, { content });
    },
    [dispatch]
  );

  return { editState, setEditState, submitTodo };
}

export function useDeleteTodo() {
  const dispatch = useDispatchDelete();
  return useCallback(todo_id => dispatch({ todo_id: `eq.${todo_id}` }), [
    dispatch
  ]);
}
