import React, { useRef, memo, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend'; // Correct import

const ItemType = 'todo';

const TodoItem = memo(
  ({ todo, index, moveTodo, updateDescription, deleteTodo, draggedId, setDraggedId }) => {
    const itemRef = useRef(null);
    const dragRef = useRef(null);

    const [{ isOver }, drop] = useDrop({
      accept: ItemType,
      hover(item, monitor) {
        if (!itemRef.current) return;
        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) return;

        const hoverBoundingRect = itemRef.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

        moveTodo(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    // Correctly destructure useDrag to include the preview ref
    const [{ isDragging }, drag, preview] = useDrag({
      type: ItemType,
      item: () => {
        setDraggedId(todo.id);
        return { id: todo.id, index, description: todo.description };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        setDraggedId(null);
      },
    });

    // Suppress default drag preview
    useEffect(() => {
      preview(getEmptyImage(), { captureDraggingState: true });
    }, [preview]);

    drag(dragRef);
    drop(itemRef);

    const isItemDragged = draggedId === todo.id;

    return (
      <div
        ref={itemRef}
        className="todo-item"
        style={{
          opacity: isItemDragged ? 0 : 1,
        }}
      >
        <span ref={dragRef} className="drag-handle">☰</span>
        <input
          value={todo.description}
          onChange={(e) => updateDescription(todo.id, e.target.value)}
          className="todo-input"
        />
        <button
          className="todo-delete"
          onClick={() => deleteTodo(todo.id)}
        >
          ✗
        </button>
      </div>
    );
  }
);

TodoItem.displayName = 'TodoItem';

export default TodoItem;