import DraggableItem from './DraggableItem';

function DraggableList({ items, itemKey, schedulerData, newEvent, dndSource }) {
  return (
    <ul>
      {items?.map(item => (
        <DraggableItem
          key={item.id}
          item={item}
          itemKey={itemKey}
          newEvent={newEvent}
          schedulerData={schedulerData}
          dndSource={dndSource}
        />
      ))}
    </ul>
  );
}

export default DraggableList;
