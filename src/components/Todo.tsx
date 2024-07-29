import React, { Dispatch, SetStateAction } from 'react';
import cs from 'classnames';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Error } from '../App';

interface Props {
  title: string;
  completed: boolean;
  tempTodo?: Todo | null;
  todo: Todo;
  todos?: Todo[];
  setTodos?: Dispatch<SetStateAction<Todo[]>>;
  setError?: Dispatch<SetStateAction<Error | null>>;
  setProcessingTodos: Dispatch<SetStateAction<Todo['id'][]>>;
  processingTodos: Todo['id'][];
}

export const TodoItem: React.FC<Props> = ({
  title,
  completed,
  tempTodo,
  todo,
  todos,
  setTodos,
  setError,
  setProcessingTodos,
  processingTodos,
}) => {
  const deleteClickHandler = (deleteTodo: Todo | null) => () => {
    setProcessingTodos(prevProcessingTodos => [
      ...prevProcessingTodos,
      todo.id,
    ]);

    client
      .delete(`/todos/${deleteTodo?.id}`)
      .then(() => {
        if (todos && setTodos) {
          const filteredTodos = todos.filter(
            checkTodo => checkTodo.id !== deleteTodo?.id,
          );

          setTodos(filteredTodos);
        }
      })
      .catch(error => {
        if (error) {
          if (setError) {
            setError(Error.DeleteTodo);

            window.setTimeout(() => {
              setError(null);
            }, 3000);
          }

          return error;
        }
      })
      .finally(() =>
        setProcessingTodos(prev => prev.filter(prevId => prevId !== todo.id)),
      );
  };

  return (
    <div
      data-cy="Todo"
      className={cs('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        {/* This comment is made because it fixes
          "A form label must be associated with a control" error */}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={deleteClickHandler(todo)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cs('modal overlay', {
          'is-active': tempTodo || processingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
