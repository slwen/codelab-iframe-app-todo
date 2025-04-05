import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TodoItem from './TodoItem';
import './App.css';

// Main TodoApp component
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const nextId = useRef(0);
  const contentRef = useRef(null); // Reference to the content container

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

  const moveTodo = (fromIndex, toIndex) => {
    const newTodos = [...todos];
    const [movedTodo] = newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, movedTodo);
    setTodos(newTodos);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={contentRef}
        id={"draggable-element"}
        style={{
          padding: '20px',
          background: '#f2f2f2',
          borderRadius: 8
        }}>
        <h1>Todo App</h1>
        <button
          onClick={addTodo}
          style={{
              marginBottom: '20px',
              background: 'dodgerblue',
              color: 'white'
            }}>
          Add Todo
        </button>
        <div>
          {todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              moveTodo={moveTodo}
              updateDescription={updateDescription}
              deleteTodo={deleteTodo}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default TodoApp;