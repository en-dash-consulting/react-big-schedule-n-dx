import { Col, Modal, Row, Typography } from 'antd';
import { Component } from 'react';
import { DnDSource, Scheduler, SchedulerData, ViewType, WrapperFun } from '../../../index';
import DemoData from '../../sample-data/sample1';
import DraggableList from '../../components/DraggableList';
import { ExampleDnDTypes } from '../../helpers/ExampleDnDTypes';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);

    const schedulerData = new SchedulerData('2022-12-18', ViewType.Month, false, false, {
      schedulerMaxHeight: 500,
      besidesWidth: window.innerWidth <= 1600 ? 400 : 500,
      views: [
        { viewName: 'Resource View', viewType: ViewType.Month, showAgenda: false, isEventPerspective: false },
        { viewName: 'Task View', viewType: ViewType.Month, showAgenda: false, isEventPerspective: true },
      ],
    });
    schedulerData.localeDayjs.locale('en');
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.eventsForTaskView);
    this.state = {
      viewModel: schedulerData,
      taskDndSource: new DnDSource(props => props.task, true, ExampleDnDTypes.TASK),
      resourceDndSource: new DnDSource(props => props.resource, true, ExampleDnDTypes.RESOURCE),
    };
  }

  render() {
    const { viewModel, taskDndSource, resourceDndSource } = this.state;

    return (
      <div>
        <Row align="middle" justify="center">
          <Typography.Title level={4}>
            {viewModel.isEventPerspective
              ? 'Drag a resource from outside and drop to the resource view.'
              : 'Drag a task from outside and drop to the resource view'}
          </Typography.Title>
        </Row>
        <Row>
          <Col span={20}>
            <Scheduler
              CustomResourceHeader={() => <div>Custom Header</div>}
              schedulerData={viewModel}
              prevClick={this.prevClick}
              nextClick={this.nextClick}
              onSelectDate={this.onSelectDate}
              onViewChange={this.onViewChange}
              eventItemClick={this.eventClicked}
              viewEventClick={this.ops1}
              viewEventText="Ops 1"
              viewEvent2Text="Ops 2"
              viewEvent2Click={this.ops2}
              updateEventStart={this.updateEventStart}
              updateEventEnd={this.updateEventEnd}
              moveEvent={this.moveEvent}
              movingEvent={this.movingEvent}
              newEvent={this.newEvent}
              subtitleGetter={this.subtitleGetter}
              dndSources={[taskDndSource, resourceDndSource]}
              toggleExpandFunc={this.toggleExpandFunc}
            />
          </Col>
          <Col span={4}>
            {viewModel.isEventPerspective ? (
              <DraggableList
                items={viewModel.resources}
                itemKey="resource"
                schedulerData={viewModel}
                newEvent={this.newEvent}
                dndSource={resourceDndSource}
              />
            ) : (
              <DraggableList
                items={viewModel.eventGroups}
                itemKey="task"
                schedulerData={viewModel}
                newEvent={this.newEvent}
                dndSource={taskDndSource}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }

  prevClick = schedulerData => {
    schedulerData.prev();
    schedulerData.setEvents(DemoData.eventsForTaskView);
    this.setState({
      viewModel: schedulerData,
    });
  };

  nextClick = schedulerData => {
    schedulerData.next();
    schedulerData.setEvents(DemoData.eventsForTaskView);
    this.setState({
      viewModel: schedulerData,
    });
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    schedulerData.config.creatable = !view.isEventPerspective;
    schedulerData.setEvents(DemoData.eventsForTaskView);
    this.setState({
      viewModel: schedulerData,
    });
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);
    schedulerData.setEvents(DemoData.eventsForTaskView);
    this.setState({
      viewModel: schedulerData,
    });
  };

  eventClicked = (schedulerData, event) => {
    Modal.info({ title: 'Info', content: `You just clicked an event: {id: ${event.id}, title: ${event.title}}` });
  };

  ops1 = (schedulerData, event) => {
    Modal.info({ title: 'Info', content: `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}` });
  };

  ops2 = (schedulerData, event) => {
    Modal.info({ title: 'Info', content: `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}` });
  };

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
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
        this.setState({
          viewModel: schedulerData,
        });
      },
    });
  };

  updateEventStart = (schedulerData, event, newStart) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to adjust the start of the event? {eventId: ${event.id}, ` +
        `eventTitle: ${event.title}, newStart: ${newStart}}`,
      onOk: () => {
        schedulerData.updateEventStart(event, newStart);
        this.setState({
          viewModel: schedulerData,
        });
      },
    });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to adjust the end of the event? {eventId: ${event.id}, ` +
        `eventTitle: ${event.title}, newEnd: ${newEnd}}`,
      onOk: () => {
        schedulerData.updateEventEnd(event, newEnd);
        this.setState({
          viewModel: schedulerData,
        });
      },
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    Modal.confirm({
      title: 'Confirm',
      content:
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, ` +
        `newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}}`,
      onOk: () => {
        schedulerData.moveEvent(event, slotId, slotName, start, end);
        this.setState({
          viewModel: schedulerData,
        });
      },
    });
  };

  movingEvent = () => {};

  subtitleGetter = (schedulerData, event) =>
    schedulerData.isEventPerspective ? schedulerData.getResourceById(event.resourceId).name : event.groupName;

  toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId);
    this.setState({
      viewModel: schedulerData,
    });
  };
}

export default WrapperFun(DragAndDrop);
