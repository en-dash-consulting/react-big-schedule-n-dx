/**
 * Compute header dimensions from scheduler config.
 *
 * Shared between agenda and non-agenda views so that header-related
 * config properties (tableHeaderHeight, showWeekNumber, weekNumberRowHeight,
 * headerBorderColor) are consumed from a single code path.
 *
 * @param {import('../types').SchedulerConfig} config
 * @returns {{
 *   tableHeaderHeight: number,
 *   totalHeaderHeight: number,
 *   showWeekNumber: boolean,
 *   weekNumberRowHeight: number,
 *   headerBorderColor: string,
 *   headerBorderStyle: string,
 * }}
 */
export function getHeaderDimensions(config) {
  const tableHeaderHeight = config.tableHeaderHeight;
  const showWeekNumber = !!config.showWeekNumber;
  const weekNumberRowHeight = config.weekNumberRowHeight ?? 24;
  const headerBorderColor = config.headerBorderColor ?? '#e9e9e9';
  const totalHeaderHeight = tableHeaderHeight + (showWeekNumber ? weekNumberRowHeight : 0);
  const headerBorderStyle = `1px solid ${headerBorderColor}`;

  return {
    tableHeaderHeight,
    totalHeaderHeight,
    showWeekNumber,
    weekNumberRowHeight,
    headerBorderColor,
    headerBorderStyle,
  };
}
