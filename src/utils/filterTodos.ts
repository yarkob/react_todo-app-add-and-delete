import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (todoState: FilterType, todos: Todo[]) => {
  if (todoState === FilterType.Active) {
    return todos.filter(todo => !todo.completed);
  }

  if (todoState === FilterType.Completed) {
    return todos.filter(todo => todo.completed);
  }

  return todos;
};
