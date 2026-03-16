import { DnDTypes } from '../config/constants';
import { computeEventDropTimes } from '../helper/dndHelper';

export default class DnDSource {
  constructor(resolveDragObjFunc, DnDEnabled, dndType = DnDTypes.EVENT) {
    this.resolveDragObjFunc = resolveDragObjFunc;
    this.dndType = dndType;
    this.DnDEnabled = DnDEnabled;
  }

  getDragSpec = () => ({
    // beginDrag: (props, monitor, component) => this.resolveDragObjFunc(props),
    beginDrag: props => this.resolveDragObjFunc(props),
    // endDrag: (props, monitor, component) => {
    endDrag: (props, monitor) => {
      if (!monitor.didDrop()) return;

      const { moveEvent, newEvent, schedulerData } = props;
      const { events, config, localeDayjs } = schedulerData;
      const item = monitor.getItem();
      const type = monitor.getItemType();
      const dropResult = monitor.getDropResult();
      const { initialStart } = dropResult;

      const drop = computeEventDropTimes({
        schedulerData,
        item,
        type,
        newStart: dropResult.start,
        newEnd: dropResult.end,
        initialStart,
        slotId: dropResult.slotId,
        slotName: dropResult.slotName,
      });

      const { newStart, newEnd, slotId, slotName, action } = drop;
      const isEvent = type === DnDTypes.EVENT;

      let hasConflict = false;
      if (config.checkConflict) {
        const start = localeDayjs(newStart);
        const end = localeDayjs(newEnd);

        events.forEach(e => {
          if (schedulerData._getEventSlotId(e) === slotId && (!isEvent || e.id !== item.id)) {
            const eStart = localeDayjs(e.start);
            const eEnd = localeDayjs(e.end);
            if (
              (start >= eStart && start < eEnd) ||
              (end > eStart && end <= eEnd) ||
              (eStart >= start && eStart < end) ||
              (eEnd > start && eEnd <= end)
            )
              hasConflict = true;
          }
        });
      }

      if (hasConflict) {
        const { conflictOccurred } = props;
        if (conflictOccurred !== undefined) {
          conflictOccurred(schedulerData, action, item, type, slotId, slotName, newStart, newEnd);
        } else {
          console.log('Conflict occurred, set conflictOccurred func in Scheduler to handle it');
        }
      } else if (isEvent) {
        if (moveEvent !== undefined) {
          moveEvent(schedulerData, item, slotId, slotName, newStart, newEnd);
        }
      } else if (newEvent !== undefined) newEvent(schedulerData, slotId, slotName, newStart, newEnd, type, item);
    },

    canDrag: props => {
      const { schedulerData, resourceEvents } = props;
      const item = this.resolveDragObjFunc(props);
      if (schedulerData._isResizing()) return false;
      const { config } = schedulerData;
      return (
        config.movable &&
        (resourceEvents === undefined || !resourceEvents.groupOnly) &&
        (item.movable === undefined || item.movable !== false)
      );
    },
  });

  // Returns the drag specification for use with useDrag hook
  // This should be called with props from the component using the hook
  getDragOptions = props => {
    const spec = this.getDragSpec();
    return {
      type: this.dndType,
      item: () => spec.beginDrag(props),
      end: (item, monitor) => spec.endDrag(props, monitor),
      canDrag: () => spec.canDrag(props),
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    };
  };
}
