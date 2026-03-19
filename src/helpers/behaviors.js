import { ViewType, CellUnit } from '../config/constants';

/**
 * @callback GetSummaryFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @param {Array} headerEvents - events for a header cell
 * @param {Object} slotId - resource slot identifier
 * @returns {{ text: string, color: string, fontSize: string }|undefined}
 */

/**
 * @callback GetCustomDateFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @param {number} num - navigation offset (0 = current, positive = forward, negative = backward)
 * @param {string} [date] - base date string (defaults to schedulerData.startDate)
 * @returns {{ startDate: string, endDate: string, cellUnit: number }}
 */

/**
 * @callback GetNonAgendaViewBodyCellBgColorFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @param {string} slotId - resource slot identifier
 * @param {Object} header - header item with { start, end, nonWorkingTime, ... }
 * @returns {string|undefined} CSS color string, or undefined for default
 */

/**
 * @callback GetScrollSpecialDayjsFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @returns {import('dayjs').Dayjs} the dayjs moment to scroll to
 */

/**
 * @callback GetDateLabelFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @param {number} viewType - current ViewType value
 * @param {string} startDate - formatted start date
 * @param {string} endDate - formatted end date
 * @returns {string} human-readable date range label
 */

/**
 * @callback GetEventTextFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @param {Object} event - event object with { id, title, resourceId, start, end, ... }
 * @returns {string} display text for the event
 */

/**
 * @callback IsNonWorkingTimeFunc
 * @param {import('../models/SchedulerData').default} schedulerData
 * @param {string} time - datetime string to check
 * @returns {boolean} true if the time falls outside working hours
 */

// Default implementations — used when no override is provided via behaviors config.
// Consumers can override any slot by passing a behaviors object to SchedulerData.

const getDateLabel = (schedulerData, viewType, startDate, endDate) => {
  const { localeDayjs } = schedulerData;
  const start = localeDayjs(new Date(startDate));
  const end = localeDayjs(endDate);
  let dateLabel = '';

  if (
    viewType === ViewType.Week ||
    (start !== end && (viewType === ViewType.Custom || viewType === ViewType.Custom1 || viewType === ViewType.Custom2))
  ) {
    dateLabel = `${start.format('MMM D')}-${end.format('D, YYYY')}`;
    if (start.month() !== end.month()) dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
    if (start.year() !== end.year()) dateLabel = `${start.format('MMM D, YYYY')}-${end.format('MMM D, YYYY')}`;
  } else if (viewType === ViewType.Month) {
    dateLabel = start.format('MMMM YYYY');
  } else if (viewType === ViewType.Quarter) {
    dateLabel = `${start.format('MMM D')}-${end.format('MMM D, YYYY')}`;
  } else if (viewType === ViewType.Year) {
    dateLabel = start.format('YYYY');
  } else {
    dateLabel = start.format('MMM D, YYYY');
  }

  return dateLabel;
};

const getEventText = (schedulerData, event) =>
  schedulerData.isEventPerspective
    ? schedulerData.resources.find(item => item.id === event.resourceId)?.name || event.title
    : event.title;

const getScrollSpecialDayjs = schedulerData => {
  const { localeDayjs } = schedulerData;
  return localeDayjs(new Date());
};

const isNonWorkingTime = (schedulerData, time) => {
  const { localeDayjs, cellUnit } = schedulerData;
  if (cellUnit === CellUnit.Hour) {
    const hour = localeDayjs(new Date(time)).hour();
    return hour < 9 || hour > 18;
  }
  const dayOfWeek = localeDayjs(new Date(time)).day();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Default behavior callbacks for the scheduler.
 *
 * Each slot is either `undefined` (consumer must provide) or a built-in default.
 * Override any slot by passing a `newBehaviors` object to the SchedulerData constructor.
 *
 * @type {{
 *   getSummaryFunc: GetSummaryFunc|undefined,
 *   getCustomDateFunc: GetCustomDateFunc|undefined,
 *   getNonAgendaViewBodyCellBgColorFunc: GetNonAgendaViewBodyCellBgColorFunc|undefined,
 *   getScrollSpecialDayjsFunc: GetScrollSpecialDayjsFunc,
 *   getDateLabelFunc: GetDateLabelFunc,
 *   getEventTextFunc: GetEventTextFunc,
 *   isNonWorkingTimeFunc: IsNonWorkingTimeFunc,
 * }}
 */
export default {
  /** @type {GetSummaryFunc|undefined} Return summary info for a cell. Optional — no default. */
  getSummaryFunc: undefined,
  /** @type {GetCustomDateFunc|undefined} Compute date range for custom view types. Optional — no default. */
  getCustomDateFunc: undefined,
  /** @type {GetNonAgendaViewBodyCellBgColorFunc|undefined} Return cell background color. Optional — no default. */
  getNonAgendaViewBodyCellBgColorFunc: undefined,
  /** @type {GetScrollSpecialDayjsFunc} Return the dayjs to auto-scroll to. Has a built-in default (now). */
  getScrollSpecialDayjsFunc: getScrollSpecialDayjs,
  /** @type {GetDateLabelFunc} Format the header date label. Has a built-in default. */
  getDateLabelFunc: getDateLabel,
  /** @type {GetEventTextFunc} Return display text for an event. Has a built-in default. */
  getEventTextFunc: getEventText,
  /** @type {IsNonWorkingTimeFunc} Determine if a time is non-working. Has a built-in default. */
  isNonWorkingTimeFunc: isNonWorkingTime,
};
