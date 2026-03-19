import { Col, Modal, Row, Typography } from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';
import { DnDSource, Scheduler, SchedulerData, ViewType, WrapperFun } from '../../../index';
import DemoData from '../../sample-data/sample1';
import DraggableList from '../../components/DraggableList';
import { ExampleDnDTypes } from '../../helpers/ExampleDnDTypes';

const initialState = {
  showScheduler: false,
  viewModel: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'INITIALIZE':
      return { showScheduler: true, viewModel: action.payload };
    case 'UPDATE_SCHEDULER':
      return { ...state, viewModel: action.payload };
    default:
      return state;
  }
}

function DragAndDrop() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [taskDndSource, setTaskDndSource] = useState(new DnDSource(props => props.task, true, ExampleDnDTypes.TASK));
  const [resourceDndSource, setResourceDndSource] = useState(
    new DnDSource(props => props.resource, true, ExampleDnDTypes.RESOURCE)
  );
  const schedulerDataRef = useRef(null);

  useEffect(() => {
    const schedulerData = new SchedulerData('2022-12-18', ViewType.Month, false, false, {
      schedulerMaxHeight: 500,
      besidesWidth: window.innerWidth <= 1600 ? 400 : 500,
      views: [
        { viewName: 'Agenda View', viewType: ViewType.Month, showAgenda: true, isEventPerspective: false },
        { viewName: 'Resource View', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
        { viewName: 'Task View', viewType: ViewType.Month, showAgenda: false, isEventPerspective: true },
      ],
    });
    schedulerData.localeDayjs.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.eventsForTaskView);

    schedulerDataRef.current = schedulerData;
    dispatch({ type: 'INITIALIZE', payload: schedulerData });
    setTaskDndSource(new DnDSource(props => props.task, true, ExampleDnDTypes.TASK));
    setResourceDndSource(new DnDSource(props => props.resource, true, ExampleDnDTypes.RESOURCE));

    return () => {
      schedulerDataRef.current = null;
    };
  }, []);

  const prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(DemoData.eventsForTaskView);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(DemoData.eventsForTaskView);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.config.creatable = !view.isEventPerspective;
    schedulerData.setEvents(DemoData.eventsForTaskView);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.eventsForTaskView);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const eventClicked = (schedulerData, event) => {
    Modal.info({ title: 'Info', content: `You just clicked an event: {id: ${event.id}, title: ${event.title}}` });
  };

  const ops1 = (schedulerData, event) => {
    Modal.info({ title: 'Info', content: `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}` });
  };

  const ops2 = (schedulerData, event) => {
    Modal.info({ title: 'Info', content: `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}` });
  };

  const newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, ` +
        `start: ${start}, end: ${end}, type: ${type}, item: ${item}}`,
      onOk: () => {
        let newFreshId = 0;
        schedulerData.events.forEach(item => {
          if (item.id >= newFreshId) newFreshId = item.id + 1;
        });

        let newEvent = {
          id: newFreshId,
          title: 'New event you just created',
          start,
          end,
          resourceId: slotId,
          bgColor: 'purple',
        };

        if (type === ExampleDnDTypes.RESOURCE) {
          newEvent = {
            ...newEvent,
            groupId: slotId,
            groupName: slotName,
            resourceId: item.id,
          };
        } else if (type === ExampleDnDTypes.TASK) {
          newEvent = {
            ...newEvent,
            groupId: item.id,
            groupName: item.name,
          };
        }

        schedulerData.addEvent(newEvent);
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
    });
  };

  const updateEventStart = (schedulerData, event, newStart) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to adjust the start of the event? {eventId: ${event.id}, ` +
        `eventTitle: ${event.title}, newStart: ${newStart}}`,
      onOk: () => {
        schedulerData.updateEventStart(event, newStart);
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
      onCancel: () => {
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
    });
  };

  const updateEventEnd = (schedulerData, event, newEnd) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to adjust the end of the event? {eventId: ${event.id}, ` +
        `eventTitle: ${event.title}, newEnd: ${newEnd}}`,
      onOk: () => {
        schedulerData.updateEventEnd(event, newEnd);
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
      onCancel: () => {
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
    });
  };

  const moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, ` +
        `newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}}`,
      onOk: () => {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
    });
  };

  const movingEvent = () => {};

  const subtitleGetter = (schedulerData, event) =>
    schedulerData.isEventPerspective ? schedulerData.getResourceById(event.resourceId).name : event.groupName;

  const toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  return (
    <>
      {state.showScheduler && (
        <>
          <Row align="middle" justify="center">
            <Typography.Title level={4}>
              {state.viewModel?.isEventPerspective
                ? 'Drag a resource from outside and drop to the resource view.'
                : 'Drag a task from outside and drop to the resource view'}
            </Typography.Title>
          </Row>
          <Row>
            <Col span={20}>
              <Scheduler
                schedulerData={state.viewModel}
                prevClick={prevClick}
                nextClick={nextClick}
                onSelectDate={onSelectDate}
                onViewChange={onViewChange}
                eventItemClick={eventClicked}
                viewEventClick={ops1}
                viewEventText="Ops 1"
                viewEvent2Text="Ops 2"
                viewEvent2Click={ops2}
                updateEventStart={updateEventStart}
                updateEventEnd={updateEventEnd}
                moveEvent={moveEvent}
                movingEvent={movingEvent}
                newEvent={newEvent}
                subtitleGetter={subtitleGetter}
                dndSources={[taskDndSource, resourceDndSource]}
                toggleExpandFunc={toggleExpandFunc}
              />
            </Col>
            <Col span={4}>
              {state.viewModel.isEventPerspective ? (
                <DraggableList
                  items={state.viewModel.resources}
                  itemKey="resource"
                  schedulerData={state.viewModel}
                  newEvent={newEvent}
                  dndSource={resourceDndSource}
                />
              ) : (
                <DraggableList
                  items={state.viewModel.eventGroups}
                  itemKey="task"
                  schedulerData={state.viewModel}
                  newEvent={newEvent}
                  dndSource={taskDndSource}
                />
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default WrapperFun(DragAndDrop);
