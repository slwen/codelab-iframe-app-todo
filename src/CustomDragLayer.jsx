import { useDragLayer } from 'react-dnd';

function CustomDragLayer() {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),              // The dragged item's data
    isDragging: monitor.isDragging(),     // Whether dragging is happening
    currentOffset: monitor.getSourceClientOffset(), // Position of the dragged item
  }));

  // If not dragging or no offset, don’t render anything
  if (!isDragging || !currentOffset) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none', // Ensures the preview doesn’t interfere with dragging
        zIndex: 100,           // Keeps it above other elements
        left: currentOffset.x,
        top: currentOffset.y,
        opacity: 0.8,          // Slightly transparent to indicate dragging
      }}
      className="drag-layer"
    >
      {/* Render the full todo item as the preview */}
      <div className="todo-item">
        <span className="drag-handle">☰</span>
        <input className="todo-input" value={item.description} disabled  />
        <button className="todo-delete" disabled>✗</button>
      </div>
    </div>
  );
}

export default CustomDragLayer;