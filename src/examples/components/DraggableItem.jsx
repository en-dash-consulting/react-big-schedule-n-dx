import { useDrag } from 'react-dnd';

function DraggableItem({ item, itemKey, schedulerData, dndSource, newEvent }) {
  // Always call useDrag unconditionally (Rules of Hooks)
  // Disable functionality when dndSource is not provided
  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(() => {
    if (!dndSource) {
      return {
        type: '__NONE__',
        canDrag: () => false,
        collect: () => ({ isDragging: false }),
      };
    }

    return dndSource.getDragOptions({ [itemKey]: item, schedulerData, newEvent });
  }, [item, itemKey, schedulerData, dndSource, newEvent]);

  const dragContent = (
    <li ref={dragRef} style={{ color: 'red', fontWeight: 'bold', fontSize: '20px', listStyle: 'none' }}>
      {item.name}
    </li>
  );

  return isDragging ? null : <div ref={dragPreviewRef}>{dragContent}</div>;
}

export default DraggableItem;
