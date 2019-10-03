import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "react-calendar";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { Preloader } from "../components/preloader-container";
import { theCurrentDateTime, theMonths } from "./Tasks";
import {
  Input,
  Label,
  TabContent,
  TabPane,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";
import "../styles/tasks.scss";

class TaskDetail extends Component {
  state = {
    actionModalIsOpen: true,
    taskEditItem: null,
    filterType: "tasks",
    filterTypeView: "all",
    headerData: [
      {
        type: "tasks",
        leftheader: "back",
        centerheader: {
          type: "list",
          title: "My Tasks",
          subtitle: "List",
          list: [
            {
              icon: "list",
              action: this.props.changeTheView,
              label: "List",
              viewchange: "list-vew"
            },
            {
              icon: "calendar",
              action: this.props.changeTheView,
              label: "Calendar",
              viewchange: "calendar-view"
            }
          ]
        },
        rightheader: [
          {
            type: "icon",
            icon: "check",
            action: this.props.toggleTaskStatus,
            filterModalLink: true
          },
          {
            type: "icon",
            icon: "thumbs-up",
            action: this.props.toggleActionModal,
            filterModalLink: true
          },
          {
            type: "icon",
            icon: "filter",
            action: this.props.toggleActionModal,
            filterModalLink: true
          }
        ],
        actionsModalItems: {
          listType: "tasks",
          listItems: [
            {
              label: "Incomplete Tasks",
              filterTypeView: "open",
              action: this.props.changeFilterType
            },
            {
              label: "Complete Tasks",
              filterTypeView: "resolved",
              action: this.props.changeFilterType
            },
            {
              label: "All Tasks",
              filterTypeView: "all",
              action: this.props.changeFilterType
            },
            {
              label: "Sort",
              action: null,
              filterTypeView: "date",
              rightIcon: "angle-right"
            }
          ]
        }
      }
    ],
    currentTask: {},
    currentTaskActions: [],
    taskMetaModalIsOpen: false,
    taskActionModalIsOpen: false,
    showMoreDatesOptionsIsOpen: false,
    actionModalTab: "dates-tab",
    taskMetaModalTab: "title-pane"
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  getHeaderType = (theType, theHeaderData) => {
    let theIndex = theHeaderData.findIndex((item, index) => {
      return item.type === theType;
    });
    let theHeader = null;
    if (theIndex !== -1) {
      theHeader = this.state.headerData[theIndex]
        ? this.state.headerData[theIndex]
        : null;
    }

    return theHeader;
  };

  onInputChange = event => {
    let fieldKey = event.currentTarget.getAttribute("name");
    let fieldValue = event.currentTarget.value;
    let theFieldArray = [fieldValue];
    let initUpdateForm = { ...this.state.currentTask };

    switch (fieldKey) {
      case "title":
      case "content":
        initUpdateForm[fieldKey]["rendered"] = fieldValue;
        break;
      default:
        initUpdateForm[fieldKey] = fieldValue;
        break;
    }
    this.setState(prevState => ({
      taskEditItem: { ...initUpdateForm }
    }));
  };

  presentFormattedDate = theDate => {
    let returnDateLabel = "";

    if (theDate) {
      let date = new Date(theDate);
      if (date != "Invalid Date") {
        let theMonthIndex = date.getMonth();
        let theDayIndex = date.getDate();
        let theMonthLabel = theMonths[theMonthIndex];
        returnDateLabel = theMonthLabel.month + " " + theDayIndex;
      }
    }
    return returnDateLabel;
  };

  formatAllTaskDates = theTask => {
    let tempTask = { ...theTask };

    let newDueDate = new Date(tempTask.due_date),
      newStartDate = new Date(tempTask.start_date);

    if (theTask.start_date) {
      tempTask["start_date_label"] = this.presentFormattedDate(
        theTask.start_date
      );
    }
    if (theTask.due_date) {
      tempTask["due_date_label"] = this.presentFormattedDate(theTask.due_date);
    }

    tempTask["due_date_official"] =
      newDueDate != "Invalid Date" ? newDueDate : tempTask.due_date;
    tempTask["start_date_official"] =
      newDueDate != "Invalid Date" ? newStartDate : tempTask.start_date;

    // console.log("Formated Date Task - ", tempTask);
    return tempTask;
  };

  closeTaskDateModal = () => {
    this.setState({
      actionModalTab: "dates-tab",
      taskActionModalIsOpen: false
    });
  };

  toggleOpenTaskDateModal = () => {
    this.setState({
      taskActionModalIsOpen: !this.state.taskActionModalIsOpen
    });
  };

  closeTaskMetaModal = () => {
    this.setState({
      taskMetaModalTab: "title-pane",
      taskMetaModalIsOpen: false
    });
  };

  toggleOpenTaskMetaModalTab = tab => {
    this.setState({
      taskEditItem: { ...this.state.currentTask },
      taskMetaModalTab: tab,
      taskMetaModalIsOpen: !this.state.taskMetaModalIsOpen
    });
  };

  clickDay_DateModal = event => {
    console.log("clickDay_DateModal", event);
  };

  changeActionModalTab = tab => {
    this.setState({
      actionModalTab: tab
    });
  };

  showMoreDatesOptions = () => {
    this.setState({
      showMoreDatesOptionsIsOpen: !this.state.showMoreDatesOptionsIsOpen
    });
  };

  submitUpdatePost = theForm => {
    let beforeSendForm = { ...theForm };
    let theTitle = beforeSendForm.title.rendered;
    let theContent = beforeSendForm.content.rendered;
    delete beforeSendForm.title;
    delete beforeSendForm.content;
    beforeSendForm["title"] = theTitle;
    beforeSendForm["content"] = theContent;
    this.props.updateAppItem(beforeSendForm, "tasks");
  };

  componentDidMount = () => {
    let theTaskID = parseInt(window.location.pathname.replace("/task/", ""));
    let theHeaderData = [...this.state.headerData];
    let theCurrentTask = {};
    let currentTaskActions = [];
    if (this.props.appData.tasks) {
      let theIndex = this.props.appData.tasks.findIndex(task => {
        return task.id === theTaskID;
      });
      theHeaderData[0]["centerheader"]["title"] = this.props.appData.tasks[
        theIndex
      ].title.rendered;
      theCurrentTask = { ...this.props.appData.tasks[theIndex] };
      theCurrentTask = this.formatAllTaskDates(theCurrentTask);
    }
    if (this.props.appData.actions) {
      let theIndex = this.props.appData.actions.map(action => {
        if (parseInt(action.itemid) === theTaskID) {
          currentTaskActions.push(action);
        }
      });
    }
    console.log("theCurrentTask - ", theCurrentTask);
    this.setState({
      headerData: [...theHeaderData],
      currentTask: { ...theCurrentTask },
      currentTaskActions: [...currentTaskActions]
    });
  };

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("tasks", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          toggleTaskStatus={this.props.toggleTaskStatus}
          history={this.props.history}
        />
        <main className="app-body" id="task-detail-app-body">
          <div className="app-body-inner">
            <Preloader
              isLoading={this.props.appData && this.props.appData.isLoading}
            />

            <div className="task-detail-wrap">
              <div className="task-header">
                <h3
                  onClick={() => this.toggleOpenTaskMetaModalTab("title-pane")}
                >
                  {this.state &&
                    this.state.currentTask &&
                    this.state.currentTask.title &&
                    this.state.currentTask.title.rendered}
                </h3>

                <div className="task-header-inner">
                  <div className="task-assignees">
                    <div>
                      <span></span>
                    </div>
                    <div>
                      {this.state.currentTask &&
                      this.state.currentTask.assigneeid ? (
                        <Fragment>
                          <span>Assigned to</span>
                          <span>{this.state.currentTask.assigneeid}</span>
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div
                    className="task-date"
                    onClick={() => this.toggleOpenTaskDateModal()}
                  >
                    <FontAwesomeIcon icon="calendar-alt" />
                    <div>
                      <span className="color-gray">Due Date</span>
                      <span>
                        {this.state.currentTask &&
                          this.state.currentTask.due_date_label}
                      </span>
                    </div>
                  </div>
                </div>
                <h6
                  onClick={() =>
                    this.toggleOpenTaskMetaModalTab("content-pane")
                  }
                >
                  Description
                </h6>
                <div className="description">
                  {this.state.currentTask &&
                    this.state.currentTask.content &&
                    this.state.currentTask.content.rendered}
                </div>
              </div>

              <div className="task-action-feed">
                <ul>
                  {this.state.currentTaskActions
                    ? this.state.currentTaskActions.map((item, index) => (
                        <li key={index}>
                          <div>{item.title.rendered}</div>
                          <div>{item.date}</div>
                        </li>
                      ))
                    : null}
                </ul>
              </div>

              <div className="task-comments">
                <Input
                  type="text"
                  placeholder="Ask a question or post an update..."
                />
                <div className="task-comments-inner">
                  <div className="left-side">
                    <FontAwesomeIcon icon="images" />
                    <FontAwesomeIcon icon="paperclip" />
                    <FontAwesomeIcon icon="images" />
                  </div>
                  <div
                    className="right-side"
                    onClick={() =>
                      this.toggleOpenTaskMetaModalTab("assignees-pane")
                    }
                  >
                    <span className="user">
                      {" "}
                      <img src="https://via.placeholder.com/24" />
                    </span>
                    <span>
                      <FontAwesomeIcon icon="plus" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* TASK DATES MODAL */}
        <Modal isOpen={this.state.taskActionModalIsOpen} id="task-dates-modal">
          <ModalHeader>
            <span onClick={() => this.closeTaskDateModal()}>Cancel</span>
            <span>Due Date</span>
            <span>Done</span>
          </ModalHeader>
          <ModalBody>
            <TabContent activeTab={this.state.actionModalTab}>
              <TabPane tabId="dates-tab">
                <Calendar
                  value={
                    this.state.currentTask &&
                    this.state.currentTask.due_date_official
                      ? this.state.currentTask.due_date_official
                      : theCurrentDateTime
                  }
                  onClickDay={this.clickDay_DateModal}
                />
                <div
                  className={
                    this.state.showMoreDatesOptionsIsOpen
                      ? "more-options-link active"
                      : "more-options-link"
                  }
                  onClick={() => this.showMoreDatesOptions()}
                >
                  <div className="inner">
                    <FontAwesomeIcon icon="plus" />
                    <span>More Options</span>
                  </div>
                  <div className="popup">
                    <ul>
                      <li
                        onClick={() =>
                          this.changeActionModalTab("start-date-tab")
                        }
                      >
                        <FontAwesomeIcon icon="clock" />
                        <span>Add Start Time</span>
                      </li>
                      <li
                        onClick={() => this.changeActionModalTab("repeat-tab")}
                      >
                        <FontAwesomeIcon icon="plus" />
                        <span>Set to Repeat</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId="repeat-tab">
                <p>Repeat Tab</p>
              </TabPane>
              <TabPane tabId="start-date-tab">
                <p>Start Date Tab</p>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>

        {/* TASK META MODAL */}
        <Modal isOpen={this.state.taskMetaModalIsOpen} id="task-meta-modal">
          <ModalHeader>
            <span onClick={() => this.closeTaskMetaModal()}>Cancel</span>
            <span
              onClick={() => this.submitUpdatePost(this.state.taskEditItem)}
            >
              Save
            </span>
          </ModalHeader>
          <ModalBody>
            <TabContent activeTab={this.state.taskMetaModalTab}>
              <TabPane tabId="title-pane">
                <Input
                  type="text"
                  placeholder="Title..."
                  name="title"
                  value={
                    this.state.taskEditItem &&
                    this.state.taskEditItem.title &&
                    this.state.taskEditItem.title.rendered
                      ? this.state.taskEditItem.title.rendered
                      : ""
                  }
                  onChange={this.onInputChange}
                />
              </TabPane>
              <TabPane tabId="content-pane">
                <Input
                  type="textarea"
                  placeholder="Description..."
                  name="content"
                  value={
                    this.state.taskEditItem &&
                    this.state.taskEditItem.content &&
                    this.state.taskEditItem.content.rendered
                      ? this.state.taskEditItem.content.rendered
                      : ""
                  }
                  onChange={this.onInputChange}
                />
              </TabPane>
              <TabPane tabId="assignees-pane">
                <Input
                  type="select"
                  placeholder="Description..."
                  name="assigneeid"
                  value={
                    this.state.taskEditItem &&
                    this.state.taskEditItem.assigneeid
                      ? this.state.taskEditItem.assigneeid
                      : ""
                  }
                  onChange={this.onInputChange}
                />
              </TabPane>
            </TabContent>
          </ModalBody>
        </Modal>
        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

export default TaskDetail;
