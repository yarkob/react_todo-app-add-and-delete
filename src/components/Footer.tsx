import React, { Dispatch, SetStateAction } from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import cs from 'classnames';
import { filterTodos } from '../utils/filterTodos';
import { client } from '../utils/fetchClient';
import { Error } from '../App';

interface Props {
  setFilterBy: Dispatch<SetStateAction<FilterType>>;
  filterBy: FilterType;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError?: Dispatch<SetStateAction<Error | null>>;
  setProcessingTodos: Dispatch<SetStateAction<Todo['id'][]>>;
}

export const Footer: React.FC<Props> = ({
  setFilterBy,
  filterBy,
  todos,
  setTodos,
  setError,
  setProcessingTodos,
}) => {
  const clearCompletedHandler = () => {
    filterTodos(FilterType.Completed, todos).forEach(todo => {
      setProcessingTodos(prevProcessingTodos => [
        ...prevProcessingTodos,
        todo.id,
      ]);

      client
        .delete(`/todos/${todo?.id}`)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
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
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${filterTodos(FilterType.Active, todos).length} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cs('filter__link', {
            selected: filterBy === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterBy(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cs('filter__link', {
            selected: filterBy === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterBy(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cs('filter__link', {
            selected: filterBy === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!filterTodos(FilterType.Completed, todos).length}
        onClick={clearCompletedHandler}
      >
        Clear completed
      </button>
    </footer>
  );
};
