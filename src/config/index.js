// Shared config barrel — constants, defaults, and i18n
export { CellUnit, DATE_FORMAT, DATETIME_FORMAT, DnDTypes, SummaryPos, ViewType } from './constants';
export { default as defaultConfig } from './defaults';
export { getLabel, setLabelsProvider, getDefaultLabels, resetLabelsProvider } from './i18n';
