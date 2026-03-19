import { Modal } from 'antd';
import { useEffect, useReducer, useRef, useState } from 'react';
import { AddMorePopover, Scheduler, SchedulerData, ViewType, WrapperFun } from '../../../index';
import DemoData from '../../sample-data/sample1';

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

function AddMore() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const schedulerDataRef = useRef(null);

  const [popoverState, setPopoverState] = useState({
    headerItem: undefined,
    left: 0,
    top: 0,
    height: 0,
  });

  useEffect(() => {
    const schedulerData = new SchedulerData('2022-12-18', ViewType.Week, false, false, {
      besidesWidth: 350,
      dayMaxEvents: 2,
      weekMaxEvents: 4,
      monthMaxEvents: 4,
      quarterMaxEvents: 4,
      yearMaxEvents: 4,
    });
    schedulerData.localeDayjs.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);

    schedulerDataRef.current = schedulerData;
    dispatch({ type: 'INITIALIZE', payload: schedulerData });

    return () => {
      schedulerDataRef.current = null;
    };
  }, []);

  const prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(DemoData.events);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(DemoData.events);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.setEvents(DemoData.events);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  const onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.events);
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

        const newEvent = {
          id: newFreshId,
          title: 'New event you just created',
          start,
          end,
          resourceId: slotId,
          bgColor: 'purple',
        };
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
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, ` +
        `newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}}`,
      onOk: () => {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
      },
    });
  };

  const onSetAddMoreState = newState => {
    if (newState === undefined) {
      setPopoverState({
        headerItem: undefined,
        left: 0,
        top: 0,
        height: 0,
      });
    } else {
      setPopoverState({
        ...newState,
      });
    }
  };

  const toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    dispatch({ type: 'UPDATE_SCHEDULER', payload: schedulerData });
  };

  let popover = <div />;
  if (popoverState.headerItem !== undefined) {
    popover = (
      <AddMorePopover
        headerItem={popoverState.headerItem}
        eventItemClick={eventClicked}
        viewEventClick={ops1}
        viewEventText="Ops 1"
        viewEvent2Click={ops2}
        viewEvent2Text="Ops 2"
        schedulerData={state.viewModel}
        closeAction={onSetAddMoreState}
        left={popoverState.left}
        top={popoverState.top}
        height={popoverState.height}
        moveEvent={moveEvent}
      />
    );
  }

  return (
    <>
      {state.showScheduler && (
        <div>
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
            newEvent={newEvent}
            onSetAddMoreState={onSetAddMoreState}
            toggleExpandFunc={toggleExpandFunc}
          />
          {popover}
        </div>
      )}
    </>
  );
}

export default WrapperFun(AddMore);
