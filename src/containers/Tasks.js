import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "react-calendar";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { Preloader } from "../components/preloader-container";
import { Input, Label, TabContent, TabPane } from "reactstrap";
import "../styles/tasks.scss";

export let theCurrentDateTime = new Date();

export let theWeek = [
  {
    day: "Sun"
  },
  {
    day: "Mon"
  },
  {
    day: "Tues"
  },
  {
    day: "Wed"
  },
  {
    day: "Thurs"
  },
  {
    day: "Fri"
  },
  {
    day: "Sat"
  }
];

export let theMonths = [
  {
    month: "Jan",
    label: "January"
  },
  {
    month: "Feb",
    label: "February"
  },
  {
    month: "Mar",
    label: "March"
  },
  {
    month: "Apr",
    label: "April"
  },
  {
    month: "May",
    label: "May"
  },
  {
    month: "Jun",
    label: "June"
  },
  {
    month: "Jul",
    label: "uly"
  },
  {
    month: "Aug",
    label: "August"
  },
  {
    month: "Sep",
    label: "September"
  },
  {
    month: "Oct",
    label: "October"
  },
  {
    month: "Nov",
    label: "November"
  },
  {
    month: "Dec",
    label: "December"
  }
];

export const diff_minutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};

export const getDaysAhead = (currDay, plusDays) => {
  let tempDay = null;
  if (currDay == 0) {
    switch (plusDays) {
      case 5:
        tempDay = theWeek[5];
        tempDay["theLabel"] = theWeek[5].day;
        break;
      default:
        tempDay = theWeek[currDay + plusDays];
        tempDay["theLabel"] = theWeek[currDay + plusDays].day;
        break;
    }
  }
  if (currDay == 1) {
    switch (plusDays) {
      case 5:
        tempDay = theWeek[6];
        tempDay["theLabel"] = theWeek[6].day;
        break;
      default:
        tempDay = theWeek[currDay + plusDays];
        tempDay["theLabel"] = theWeek[currDay + plusDays].day;
        break;
    }
  }
  if (currDay == 2) {
    switch (plusDays) {
      case 5:
        tempDay = theWeek[0];
        tempDay["theLabel"] = "Next " + theWeek[0].day;
        break;
      default:
        tempDay = theWeek[0];
        tempDay["theLabel"] = theWeek[0].day;
        break;
    }
  }
  if (currDay == 3) {
    switch (plusDays) {
      case 4:
        tempDay = theWeek[0];
        break;
      case 5:
        tempDay = theWeek[1];
        break;
      default:
        break;
    }
  }
  if (currDay == 4) {
    switch (plusDays) {
      case 3:
        tempDay = theWeek[0];
        break;
      case 4:
        tempDay = theWeek[1];
        break;
      case 5:
        tempDay = theWeek[2];
        break;
      default:
        break;
    }
  }
  if (currDay == 5) {
    switch (plusDays) {
      case 2:
        tempDay = theWeek[0];
        tempDay["theLabel"] = "Next " + theWeek[0].day;
        break;
      case 3:
        tempDay = theWeek[1];
        tempDay["theLabel"] = "Next " + theWeek[1].day;
        break;
      case 4:
        tempDay = theWeek[2];
        tempDay["theLabel"] = "Next " + theWeek[2].day;
        break;
      case 5:
        tempDay = theWeek[3];
        tempDay["theLabel"] = "Next " + theWeek[3].day;
        break;
      default:
        break;
    }
  }
  if (currDay == 6) {
    switch (plusDays) {
      case 1:
        tempDay = theWeek[0];
        break;
      case 2:
        tempDay = theWeek[1];
        break;
      case 3:
        tempDay = theWeek[2];
        break;
      case 4:
        tempDay = theWeek[3];
        break;
      case 5:
        tempDay = theWeek[4];
        break;
      default:
        break;
    }
  }

  return tempDay;
};

export const diff_minutes_display = (dt2, dt1) => {
  dt2 = new Date(dt2);
  dt1 = new Date(dt1);
  let theMinsDiff = diff_minutes(dt2, dt1);
  let theDisplayLabel = "";
  let theDaysAheadLabel = "";

  console.log("Mins Diff - ", theMinsDiff);

  if (theMinsDiff < 1440) {
    theDisplayLabel = "Today";
  } else if (theMinsDiff > 1439 && theMinsDiff < 2880) {
    theDisplayLabel = "Tomorrow";
  } else if (theMinsDiff > 2879 && theMinsDiff < 4320) {
    theDaysAheadLabel = 3;
    let theDayLabel = getDaysAhead(dt2.getDay(), theDaysAheadLabel);
    theDisplayLabel = theDayLabel
      ? `${theDayLabel.theLabel}`
      : `${theDaysAheadLabel} days`;
  } else if (theMinsDiff > 4319 && theMinsDiff < 5760) {
    theDaysAheadLabel = 4;
    let theDayLabel = getDaysAhead(dt2.getDay(), theDaysAheadLabel);
    theDisplayLabel = theDayLabel
      ? `${theDayLabel.theLabel}`
      : `${theDaysAheadLabel} days`;
  } else if (theMinsDiff > 5759 && theMinsDiff < 7200) {
    theDaysAheadLabel = 5;
    let theDayLabel = getDaysAhead(dt2.getDay(), theDaysAheadLabel);
    theDisplayLabel = theDayLabel
      ? `${theDayLabel.theLabel}`
      : `${theDaysAheadLabel} days`;
  } else if (theMinsDiff > 7199) {
    theDisplayLabel = theMonths[dt1.getUTCMonth()].month + " " + dt1.getDate();
  } else {
    theDisplayLabel = "Past Due";
  }

  return theDisplayLabel;
};

export const getDaysAfterArray = (start, end) => {
  let newDisplayDate = start;
  let oldDisplayDate = start;
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    let shortMonth = new Date(dt).toString().split(" ")[1],
      fullMonthIndex = theMonths.findIndex(item => {
        return item.month === shortMonth;
      }),
      fullMonth = "";
    fullMonth = fullMonthIndex !== -1 ? theMonths[fullMonthIndex].label : "";
    let newTempItem = {
      date: new Date(dt),
      string: new Date(dt).toLocaleString().split(", ")[0],
      display: fullMonth + " " + new Date(dt).toString().split(" ")[2]
    };
    newDisplayDate = dt;
    arr.push(newTempItem);
  }
  return arr;
};

export const getFilterAfterDateList = (daysAfterList, taskFilterList) => {
  let tempList = [];
  const DaysListPromise = new Promise((resolve, reject) => {
    daysAfterList &&
      daysAfterList.map((globalItem, index) => {
        let newGlobalItem = new Date(globalItem.string);
        let newGlobalItemObj = {
          string: newGlobalItem.toLocaleString().split(", ")[0],
          stringLabel: newGlobalItem
        };

        if (tempList) {
          taskFilterList &&
            taskFilterList.map((theTask, theTaskIndex) => {
              if (
                theTask.due_date &&
                theTask.due_date !== "" &&
                theTask.due_date !== "0000-00-00 00:00:00"
              ) {
                let tempTaskDate = new Date(theTask.due_date);
                let nextMonth = tempTaskDate.getMonth() + 1;
                if (nextMonth == 12) {
                  nextMonth = 1;
                }
                if (
                  nextMonth === newGlobalItem.getMonth() &&
                  newGlobalItem.getDate() === tempTaskDate.getDate()
                ) {
                  if (!newGlobalItemObj.list) {
                    newGlobalItemObj["list"] = [theTask];
                  } else {
                    newGlobalItemObj["list"].push(theTask);
                  }
                  newGlobalItemObj["string"] = tempTaskDate;
                  tempList.push(newGlobalItemObj);
                  // tempList[
                  //   tempTaskDate.toLocaleString().split(", ")[0]
                  // ] = newGlobalItemObj;
                }
              }
            });
        } else {
          console.log("GlobalList", tempList);
          let GlobalListIndexFound = tempList.findIndex(
            (innerGlobal, innerGlobalIndex) => {
              return innerGlobalIndex === newGlobalItemObj.string;
            }
          );
          if (GlobalListIndexFound === -1) {
            // GlobalList[
            //   `${newGlobalItem.toLocaleString().split(", ")[0]}`
            // ] = newGlobalItemObj;
          }
        }
      });
    resolve(tempList);
  }).then(response => {
    return response;
  });

  return DaysListPromise;
};

export const TaskList = props => {
  return (
    <ul className="default-display-list tasks-list">
      {props.taskFilterList &&
        props.taskFilterList.map((task, index) => (
          <li
            key={index}
            className={
              task.task_status &&
              `display-item task-item ${task.task_status[0]}`
            }
          >
            <div className="inner">
              <div className="left">
                <FontAwesomeIcon
                  icon="check-circle"
                  onClick={() => props.toggleTaskStatus(task)}
                />
                <h5>
                  <Link to={"/task/" + task.id}>{task.title.rendered}</Link>
                </h5>
              </div>
              <div className="right">
                <span>
                  {diff_minutes_display(theCurrentDateTime, task.due_date)}
                </span>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

class Tasks extends Component {
  getTasksListFilter = () => {};

  state = {
    actionModalIsOpen: true,
    headerData: [
      {
        type: "tasks",
        centerheader: {
          type: "list",
          title: "My Tasks",
          subtitle: "List",
          list: [
            {
              icon: "list",
              viewchange: "list-view",
              action: this.props.changeTheView,
              label: "List"
            },
            {
              icon: "calendar",
              viewchange: "calendar-view",
              action: this.props.changeTheView,
              label: "Calendar"
            }
          ]
        },
        rightheader: [
          {
            type: "icon",
            icon: "filter",
            action: this.props.toggleActionModal,
            filterModalLink: true,
            navigatePageUrl: null
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
    appRouteContext: this.props.appData.appRouteContext
      ? { ...this.props.appData.appRouteContext }
      : null,
    theDaysAfter: getDaysAfterArray(new Date(), new Date("2020-01-01"))
      ? getDaysAfterArray(new Date(), new Date("2020-01-01"))
      : null,
    taskFilterList:
      this.props && this.props.appData && this.props.appData.tasks
        ? this.props.appData.tasks
        : [],
    activeViewTab:
      this.props && this.props.viewChange ? this.props.viewChange : "list-view"
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("tasks", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          changeTheView={this.props.changeTheView}
          activeViewTab={this.state.activeViewTab}
          toggleTaskStatus={this.props.toggleTaskStatus}
        />
        <main className="app-body">
          <div className="app-body-inner task-app-body-inner">
            <div className="tasks-calendar-list-container">
              <Preloader
                isLoading={
                  this.props &&
                  this.props.appData &&
                  this.props.appData.isLoading
                }
              />
              <TabContent
                activeTab={this.state.activeViewTab}
                className={
                  this.props &&
                  this.props.appData &&
                  this.props.appData.isLoading
                    ? ""
                    : "active"
                }
              >
                <TabPane tabId="list-view">
                  <TaskList
                    appData={this.props.appData && this.props.appData}
                    theDaysAfter={this.state && this.state.theDaysAfter}
                    filterType={this.props && this.props.filterType}
                    filterTypeView={this.props && this.props.filterTypeView}
                    taskFilterList={this.state && this.state.taskFilterList}
                    toggleTaskStatus={this.props.toggleTaskStatus}
                    changeTheView={this.props.changeTheView}
                  />
                </TabPane>
                <TabPane tabId="calendar-view">
                  <TaskListCalendar
                    appData={this.props.appData && this.props.appData}
                    theDaysAfter={this.state && this.state.theDaysAfter}
                    filterType={this.props && this.props.filterType}
                    filterTypeView={this.props && this.props.filterTypeView}
                    taskFilterList={this.state && this.state.taskFilterList}
                    toggleTaskStatus={this.props.toggleTaskStatus}
                    changeTheView={this.props.changeTheView}
                  />
                </TabPane>
              </TabContent>
            </div>
          </div>
        </main>
        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

export class TaskDetail extends Component {
  state = {
    actionModalIsOpen: true,
    taskItem: this.props.taskEditItem ? this.props.taskEditItem : {},
    filterType: "tasks",
    filterTypeView: "all",
    headerData: [
      {
        type: "tasks",
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
    taskItem: {}
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

  onInputChange = () => {};

  componentDidMount = () => {
    console.log("The Task Detail Props", this.props);
    let theTaskID = parseInt(this.props.match.params.id);
    let theTaskIndex =
      this.props.appData &&
      this.props.appData.tasks &&
      this.props.appData.tasks.findIndex((task, index) => {
        return task.id === theTaskID;
      });

    if (theTaskIndex !== -1) {
      let tempState = { ...this.state };
      let taskAssigneeID = this.props.appData.tasks[theTaskIndex].assigneeid;
      let theUser = null;
      if (taskAssigneeID) {
        let theUserIndex = this.props.appData.users.findIndex(user => {
          return user.id === taskAssigneeID;
        });
        if (theUserIndex !== -1) {
          theUser = this.props.appData.users[theUserIndex];
        }
      }
      tempState["taskItem"] = { ...this.props.appData.tasks[theTaskIndex] };
      if (theUser) {
        tempState["taskItem"]["theAssignee"] = theUser;
      }
      this.setState({ taskItem: { ...tempState } });
      console.log("The Task Detail Item", this.state.taskItem);
    }
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
        />
        <main className="app-body">
          <div className="app-body-inner">
            <div className="task-detail-wrap">
              <div className="task-header">
                <h3>
                  {this.state &&
                    this.state.taskItem &&
                    this.state.taskItem.post_title}
                </h3>

                <div className="task-header-inner">
                  <div className="task-assignees">
                    <div>
                      <span></span>
                    </div>
                    <div>
                      {this.state &&
                      this.state.taskItem &&
                      this.state.taskItem.theAssignee ? (
                        <Fragment>
                          <span>Assigned to</span>
                          <span>{this.state.taskItem.theAssignee.name}</span>
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="task-date">
                    <FontAwesomeIcon icon="calendar-alt" />
                    <div>
                      <span>Due Date</span>
                      <span>Sep 1</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="task-description">
                <Label>Description</Label>
                <Input
                  type="textarea"
                  name="content"
                  onChange={this.onInputChange}
                  value={
                    this.state &&
                    this.state.taskItem &&
                    this.state.taskItem.content &&
                    this.state.taskItem.content.rendered
                      ? this.state.taskItem.content.rendered
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </main>
        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

const TaskListCalendar = props => {
  const [filterAfterDateList, setFilterAfterDateList] = useState(
    props.filterAfterDateList ? [...props.filterAfterDateList] : []
  );

  const onClickDay = date => {
    console.log(date);
  };

  const pad2 = number => {
    return (number < 10 ? "0" : "") + number;
  };
  let beforeDecade = 3652;
  let negCounter = negCounter;

  const TaskCalenderInnerList = props => {
    props &&
      props.theDaysAfter &&
      props.theDaysAfter.map((currItem, currInd) => {
        let foundIndex =
          props &&
          props.taskFilterList &&
          props.taskFilterList.findIndex((taskItem, innerInd) => {
            let taskDueDate = new Date(taskItem.due_date);
            let taskDueDateLabel = taskDueDate.toLocaleString().split(", ")[0];
            return taskDueDateLabel === currItem.string;
          });
        if (foundIndex && foundIndex !== -1) {
          currItem && currItem.list
            ? currItem["list"].push([{ ...props.taskFilterList[foundIndex] }])
            : (currItem["list"] = [{ ...props.taskFilterList[foundIndex] }]);
        }
      });
    return (
      <Fragment>
        <ul className="tasks-list-dates">
          {props &&
            props.theDaysAfter &&
            props.theDaysAfter.map((item, index) => (
              <li
                key={index}
                data-date={item.string}
                className={item.list && item.list ? "has-task-items" : null}
              >
                <div className="the-day">
                  <span>{item.display}</span>
                </div>
                <TaskList
                  toggleTaskStatus={props.toggleTaskStatus}
                  taskFilterList={item.list}
                />
              </li>
            ))}
        </ul>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Calendar className="tasks-list-calendar" onClickDay={onClickDay} />
      <TaskCalenderInnerList
        appData={props.appData}
        taskFilterList={props.taskFilterList}
        toggleTaskStatus={props.toggleTaskStatus}
        theDaysAfter={props.theDaysAfter}
        filterType={props.filterType}
        filterTypeView={props.filterTypeView}
        filterAfterDateList={filterAfterDateList}
        changeTheView={props.changeTheView}
      />
    </Fragment>
  );
};

export default Tasks;
