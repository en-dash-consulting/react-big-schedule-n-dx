import PropTypes from 'prop-types';
import { getHeaderDimensions } from './headerHelper';
import AgendaResourceEvents from './AgendaResourceEvents';

function AgendaView(props) {
  const {
    schedulerData,
    subtitleGetter,
    eventItemClick,
    viewEventClick,
    viewEventText,
    viewEvent2Click,
    viewEvent2Text,
    slotClickedFunc,
    slotItemTemplateResolver,
    eventItemTemplateResolver,
    eventItemPopoverTemplateResolver,
  } = props;
  const { config, renderData } = schedulerData;

  const agendaResourceTableWidth = schedulerData.getResourceTableWidth();
  const { totalHeaderHeight, headerBorderStyle } = getHeaderDimensions(config);
  const resourceName = schedulerData.isEventPerspective ? config.taskName : config.resourceName;
  const { agendaViewHeader } = config;

  const resourceEventsList = renderData.map(item => (
    <AgendaResourceEvents
      key={item.slotId}
      schedulerData={schedulerData}
      resourceEvents={item}
      subtitleGetter={subtitleGetter}
      eventItemClick={eventItemClick}
      viewEventClick={viewEventClick}
      viewEventText={viewEventText}
      viewEvent2Click={viewEvent2Click}
      viewEvent2Text={viewEvent2Text}
      slotClickedFunc={slotClickedFunc}
      slotItemTemplateResolver={slotItemTemplateResolver}
      eventItemTemplateResolver={eventItemTemplateResolver}
      eventItemPopoverTemplateResolver={eventItemPopoverTemplateResolver}
    />
  ));

  return (
    <tr>
      <td>
        <table className="scheduler-table">
          <thead>
            <tr style={{ height: totalHeaderHeight, borderBottom: headerBorderStyle }}>
              <th style={{ width: agendaResourceTableWidth }} className="header3-text">
                {resourceName}
              </th>
              <th className="header3-text">{agendaViewHeader}</th>
            </tr>
          </thead>
          <tbody>{resourceEventsList}</tbody>
        </table>
      </td>
    </tr>
  );
}

AgendaView.propTypes = {
  schedulerData: PropTypes.object.isRequired,
  subtitleGetter: PropTypes.func,
  eventItemClick: PropTypes.func,
  viewEventClick: PropTypes.func,
  viewEventText: PropTypes.string,
  viewEvent2Click: PropTypes.func,
  viewEvent2Text: PropTypes.string,
  slotClickedFunc: PropTypes.func,
  slotItemTemplateResolver: PropTypes.func,
  eventItemTemplateResolver: PropTypes.func,
  eventItemPopoverTemplateResolver: PropTypes.func,
};

export default AgendaView;
