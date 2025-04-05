import React, { useState, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import TodoItem from './TodoItem';
import CustomDragLayer from './CustomDragLayer';
import './App.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [draggedId, setDraggedId] = useState(null); // Track the dragged item's ID
  const nextId = useRef(0);

  const addTodo = () => {
    const newTodo = { id: nextId.current++, description: '' };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateDescription = (id, description) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, description } : todo)));
  };

  const moveTodo = useCallback((dragIndex, hoverIndex) => {
    setTodos((prevTodos) =>
      update(prevTodos, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTodos[dragIndex]],
        ],
      })
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ background: '#f2f2f2', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: 8 }}>
          <h1>Todo App</h1>
          <button
            onClick={addTodo}
            style={{ background: 'dodgerblue', color: 'white', padding: "12px 16px" }}
          >
            Add Todo
          </button>
        </div>
        <div style={{ padding: '32px 16px' }}>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id} // Ensure key is stable and unique
              todo={todo}
              index={index}
              moveTodo={moveTodo}
              updateDescription={updateDescription}
              deleteTodo={deleteTodo}
              draggedId={draggedId}
              setDraggedId={setDraggedId}
            />
          ))}
        </div>
      </div>
      <CustomDragLayer />
    </DndProvider>
  );
}

export default TodoApp;