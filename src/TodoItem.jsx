import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = 'todo';

function TodoItem({ todo, index, moveTodo, updateDescription, deleteTodo }) {
  const ref = useRef(null); // Reference for the entire todo item (drop target)
  const dragRef = useRef(null); // Reference for the drag handle

  // Drop logic to detect hover and reorder
  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveTodo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Drag logic to track dragging state
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Attach drag functionality to the drag handle only
  drag(dragRef);
  drop(ref);

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.3 : 1,
        transition: 'all 0.3s ease',
        marginBottom: '1px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: isOver ? '2px solid blue' : 'none',
        background: 'white',
        padding: 8
      }}
    >
      <span
        ref={dragRef}
        style={{
          cursor: 'move',
          marginRight: '10px',
          userSelect: 'none',
          display: 'block',
          padding: 4
        }}
      >
        ☰
      </span>
      <input
        value={todo.description}
        onChange={(e) => updateDescription(todo.id, e.target.value)}
        style={{ marginRight: '10px', flexGrow: 1 }}
      />
      <button
        style={{ background: 'firebrick', color: 'white' }}
        onClick={() => deleteTodo(todo.id)}>
          ⌫
        </button>
    </div>
  );
}

export default TodoItem;