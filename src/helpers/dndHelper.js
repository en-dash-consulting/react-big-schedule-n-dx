import { DnDTypes, ViewType, DATETIME_FORMAT } from '../config/constants';

/**
 * Compute adjusted start/end times and slot info for a dragged event.
 *
 * Shared between DnDContext (hover) and DnDSource (endDrag) to keep
 * the time-offset logic in a single place.
 *
 * @param {Object} params
 * @param {Object} params.schedulerData - SchedulerData instance
 * @param {Object} params.item - the dragged item from react-dnd monitor
 * @param {string} params.type - DnD item type (DnDTypes.EVENT or external)
 * @param {string} params.newStart - raw cell start time
 * @param {string} params.newEnd - raw cell end time
 * @param {string|null} params.initialStart - initial drag start time (for relativeMove)
 * @param {string} params.slotId - target resource slot id
 * @param {string} params.slotName - target resource slot name
 * @returns {{ newStart: string, newEnd: string, slotId: string, slotName: string, action: string }}
 */
export function computeEventDropTimes({ schedulerData, item, type, newStart, newEnd, initialStart, slotId, slotName }) {
  const { config, viewType, localeDayjs } = schedulerData;
  let action = 'New';
  let adjustedStart = newStart;
  let adjustedEnd = newEnd;
  let adjustedSlotId = slotId;
  let adjustedSlotName = slotName;

  const isEvent = type === DnDTypes.EVENT;
  if (isEvent) {
    const event = item;
    if (config.relativeMove) {
      adjustedStart = localeDayjs(event.start)
        .add(localeDayjs(newStart).diff(localeDayjs(new Date(initialStart))), 'ms')
        .format(DATETIME_FORMAT);
    } else if (viewType !== ViewType.Day) {
      const tmpDayjs = localeDayjs(newStart);
      adjustedStart = localeDayjs(event.start)
        .year(tmpDayjs.year())
        .month(tmpDayjs.month())
        .date(tmpDayjs.date())
        .format(DATETIME_FORMAT);
    }
    adjustedEnd = localeDayjs(adjustedStart)
      .add(localeDayjs(event.end).diff(localeDayjs(event.start)), 'ms')
      .format(DATETIME_FORMAT);

    if (config.crossResourceMove === false) {
      adjustedSlotId = schedulerData._getEventSlotId(item);
      adjustedSlotName = undefined;
      const slot = schedulerData.getSlotById(adjustedSlotId);
      if (slot) adjustedSlotName = slot.name;
    }

    action = 'Move';
  }

  return {
    newStart: adjustedStart,
    newEnd: adjustedEnd,
    slotId: adjustedSlotId,
    slotName: adjustedSlotName,
    action,
  };
}
