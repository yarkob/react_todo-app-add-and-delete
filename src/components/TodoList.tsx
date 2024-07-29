import { TodoItem } from './Todo';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';
import { Dispatch, SetStateAction } from 'react';
import { Error } from '../App';
import { filterTodos } from '../utils/filterTodos';
export { filterTodos } from '../utils/filterTodos';

interface Props {
  filterBy: FilterType;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setError: Dispatch<SetStateAction<Error | null>>;
  setProcessingTodos: Dispatch<SetStateAction<Todo['id'][]>>;
  processingTodos: Todo['id'][];
}

export const TodoList: React.FC<Props> = ({
  filterBy,
  todos,
  setTodos,
  tempTodo,
  setError,
  setProcessingTodos,
  processingTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(filterBy, todos).map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          title={todo.title}
          completed={todo.completed}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setProcessingTodos={setProcessingTodos}
          processingTodos={processingTodos}
        />
      ))}
      {!!tempTodo && (
        <TodoItem
          title={tempTodo.title}
          completed={tempTodo.completed}
          tempTodo={tempTodo}
          todo={tempTodo}
          setProcessingTodos={setProcessingTodos}
          processingTodos={processingTodos}
        />
      )}
    </section>
  );
};
