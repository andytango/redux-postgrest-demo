import {createPgRestActions} from 'redux-postgrest'

export const createTodoAction = createPgRestActions("todos");