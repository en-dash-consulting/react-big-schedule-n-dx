/**
 * Shared type definitions for react-big-schedule.
 *
 * These JSDoc typedefs document the shapes of the core data objects
 * consumed by SchedulerData and the UI components. They serve as a
 * stable contract between the scheduler-core and view layers.
 *
 * @module types
 */

/**
 * A scheduler event.
 *
 * @typedef {Object} SchedulerEvent
 * @property {string|number} id - Unique event identifier
 * @property {string} start - Start datetime string (DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss")
 * @property {string} end - End datetime string (DATETIME_FORMAT)
 * @property {string|number} resourceId - ID of the resource this event belongs to
 * @property {string} title - Display title
 * @property {string} [bgColor] - Background color (CSS color string)
 * @property {boolean} [resizable=true] - Whether the event can be resized
 * @property {boolean} [movable=true] - Whether the event can be moved
 * @property {boolean} [startResizable] - Override for start-edge resizability
 * @property {boolean} [endResizable] - Override for end-edge resizability
 * @property {string} [rrule] - RFC 5545 RRULE string for recurring events
 * @property {boolean} [showPopover=true] - Whether to show the event popover
 * @property {string|number} [groupId] - Event group identifier
 * @property {string} [groupName] - Event group display name
 */

/**
 * A scheduler resource (row).
 *
 * @typedef {Object} SchedulerResource
 * @property {string|number} id - Unique resource identifier
 * @property {string} name - Display name
 * @property {string|number} [parentId] - Parent resource ID for nested/grouped resources
 * @property {string} [groupOnly] - If truthy, this row is a group header (not droppable)
 */

/**
 * A view configuration entry in `config.views`.
 *
 * @typedef {Object} ViewConfig
 * @property {string} viewName - Display name shown in the radio button
 * @property {number} viewType - ViewType enum value (0-7)
 * @property {boolean} showAgenda - Whether to render agenda mode
 * @property {boolean} isEventPerspective - Whether to render from event perspective
 */

/**
 * Scheduler configuration object.
 *
 * Created by merging user-provided config over defaults (shallow merge).
 * See `src/config/defaults.js` for all default values.
 *
 * @typedef {Object} SchedulerConfig
 * @property {string|number} schedulerWidth - Width of the scheduler ("100%" or pixel number)
 * @property {number} besidesWidth - Horizontal padding/margin to subtract (px)
 * @property {number} underneathHeight - Vertical padding/margin to subtract (px)
 * @property {number} schedulerMaxHeight - Maximum scheduler height (0 = unlimited)
 * @property {number} tableHeaderHeight - Height of the column header row (px)
 * @property {string|number} schedulerContentHeight - Content area height ("500px" or number)
 *
 * @property {boolean} responsiveByParent - Size to parent container instead of document
 *
 * @property {number} agendaResourceTableWidth - Resource column width in agenda view (px)
 * @property {number} agendaMaxEventWidth - Max event width in agenda view (%)
 *
 * @property {number|string} dayResourceTableWidth - Resource column width for day view
 * @property {number|string} weekResourceTableWidth - Resource column width for week view
 * @property {number|string} monthResourceTableWidth - Resource column width for month view
 * @property {number|string} quarterResourceTableWidth - Resource column width for quarter view
 * @property {number|string} yearResourceTableWidth - Resource column width for year view
 * @property {number|string} customResourceTableWidth - Resource column width for custom views
 *
 * @property {number|string} dayCellWidth - Cell width for day view
 * @property {number|string} weekCellWidth - Cell width for week view
 * @property {number|string} monthCellWidth - Cell width for month view
 * @property {number|string} quarterCellWidth - Cell width for quarter view
 * @property {number|string} yearCellWidth - Cell width for year view
 * @property {number|string} customCellWidth - Cell width for custom views
 *
 * @property {number} dayMaxEvents - Max visible events per cell (day)
 * @property {number} weekMaxEvents - Max visible events per cell (week)
 * @property {number} monthMaxEvents - Max visible events per cell (month)
 * @property {number} quarterMaxEvents - Max visible events per cell (quarter)
 * @property {number} yearMaxEvents - Max visible events per cell (year)
 * @property {number} customMaxEvents - Max visible events per cell (custom)
 *
 * @property {string} eventItemPopoverTrigger - Popover trigger ("hover" | "click")
 * @property {string} eventItemPopoverPlacement - Popover placement
 * @property {number} eventItemPopoverWidth - Popover width (px)
 *
 * @property {number} eventItemHeight - Event bar height (px)
 * @property {number} eventItemLineHeight - Event bar line-height (px)
 * @property {number} nonAgendaSlotMinHeight - Minimum row height (px, 0 = auto)
 * @property {number} dayStartFrom - Start hour (0-23)
 * @property {number} dayStopTo - End hour (0-23)
 * @property {string} defaultEventBgColor - Default event background color
 * @property {string} selectedAreaColor - Selected area highlight color
 * @property {string} nonWorkingTimeHeadColor - Non-working-time header text color
 * @property {string} nonWorkingTimeHeadBgColor - Non-working-time header bg color
 * @property {string} nonWorkingTimeBodyBgColor - Non-working-time body bg color
 * @property {string} summaryColor - Summary text color
 * @property {number} summaryPos - SummaryPos enum value
 * @property {string} groupOnlySlotColor - Background color for group-only rows
 * @property {string} headerBorderColor - Header row border color
 * @property {number} weekNumberRowHeight - Week number row height (px)
 *
 * @property {boolean} showWeekNumber - Show week number row in header
 * @property {boolean} startResizable - Default start-edge resizability
 * @property {boolean} endResizable - Default end-edge resizability
 * @property {boolean} movable - Default movability
 * @property {boolean} creatable - Allow creating new events
 * @property {boolean} crossResourceMove - Allow moving events across resources
 * @property {boolean} checkConflict - Check for time conflicts on move/create
 * @property {boolean} scrollToSpecialDayjsEnabled - Auto-scroll to "special" dayjs
 * @property {boolean} eventItemPopoverEnabled - Show event item popovers
 * @property {boolean} eventItemPopoverShowColor - Show color in popover
 * @property {boolean} calendarPopoverEnabled - Show calendar popover on date click
 * @property {boolean} recurringEventsEnabled - Enable RRULE expansion
 * @property {boolean} viewChangeSpinEnabled - Show spinner on view change
 * @property {boolean} dateChangeSpinEnabled - Show spinner on date change
 * @property {boolean} headerEnabled - Render the scheduler header bar
 * @property {boolean} resourceViewEnabled - Render the resource column
 * @property {boolean} displayWeekend - Show weekend days
 * @property {boolean} relativeMove - Use relative offset when moving events
 * @property {boolean} defaultExpanded - Expand nested resources by default
 * @property {boolean} dragAndDropEnabled - Enable drag-and-drop
 *
 * @property {number} schedulerHeaderEventsFuncsTimeoutMs - Spinner delay (ms)
 *
 * @property {string} resourceName - Resource column header text
 * @property {string} taskName - Task column header text (event perspective)
 * @property {string} agendaViewHeader - Agenda column header text
 * @property {string} weekNumberLabel - Week number row label
 * @property {string} addMorePopoverHeaderFormat - "+N more" popover date format
 * @property {string} eventItemPopoverDateFormat - Popover date format
 * @property {string} nonAgendaDayCellHeaderFormat - Day cell header format
 * @property {string} nonAgendaWeekCellHeaderFormat - Week cell header format
 * @property {string} nonAgendaMonthCellHeaderFormat - Month cell header format
 * @property {string} nonAgendaYearCellHeaderFormat - Year cell header format
 * @property {string} nonAgendaOtherCellHeaderFormat - Other cell header format
 *
 * @property {number} minuteStep - Time grid granularity (minutes)
 *
 * @property {ViewConfig[]} views - Available view configurations
 */

// This file is intentionally empty at runtime — it exists solely to host
// JSDoc typedefs that are consumed by IDE tooling and documentation generators.
