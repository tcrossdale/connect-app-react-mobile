import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { ProjectFormFields } from "../components/forms";
import { TaskList } from "../containers/Tasks";
import BootBox from "react-bootbox";
import {
  Button,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import Calendar from "react-calendar";
import "../styles/projects.scss";

const ProjectsCalendarList = props => {
  const [projectsFilterList, setProjectsFilterList] = useState(
    props.projectsFilterList
  );
  const projectPhaseLabel = thePhase => {
    let initPhase = thePhase ? thePhase[0] : "";
    let thePhaseLabel = "";
    switch (initPhase) {
      case "postlaunch":
        thePhaseLabel = "Post Launch";
        break;
      case "open":
        thePhaseLabel = "Open";
        break;
      case "archived":
        thePhaseLabel = "Archived";
        break;
      case "progress":
        thePhaseLabel = "In Progress";
        break;
      default:
        thePhaseLabel = "Open";
        break;
    }
    return thePhaseLabel;
  };
  const projectLaunchDateLabel = theDate => {
    let tempDate = theDate;
    tempDate = new Date(tempDate);
    tempDate.setDate(tempDate.getDate() + 1);
    if (tempDate !== "New Invalid Date") {
      console.log("tempDate New valid", tempDate);
    }
  };

  /*  CALENDAR FUNCTIONS
  --------------------*/
  const [currentDate, setCurrentDate] = useState(new Date());

  const onActiveDateChange = () => {};
  const onChange = theDate => {
    console.log("onChange - ", theDate);
  };
  const onClickDay = theDate => {
    console.log("onClickDay - ", theDate);
  };
  const onClickDecade = theDate => {
    console.log("onClickDecade - ", theDate);
  };
  const onClickMonth = theDate => {
    console.log("onClickMonth - ", theDate);
  };
  const onClickYear = theDate => {
    console.log("onClickYear - ", theDate);
  };
  const onDrillDown = theDate => {
    console.log("onDrillDown - ", theDate);
  };
  const onDrillUp = theDate => {
    console.log("onDrillUp - ", theDate);
  };

  const PCItem = props => {
    const togglePCItem = (e, project) => {
      const theLI = e.currentTarget.closest(".inner").closest("li"),
        theUL = e.currentTarget
          .closest(".inner")
          .closest("li")
          .closest("ul"),
        theLIs = theUL.querySelectorAll("li");
      theLIs.forEach(element => {
        if (element !== theLI) {
          element.classList.remove("active");
        } else {
          element.classList.toggle("active");
        }
      });
    };

    return (
      <li key={props.index}>
        <div className="inner">
          <div className="left" onClick={e => togglePCItem(e, props.project)}>
            <FontAwesomeIcon icon="briefcase" />
            <h5>
              {/* <span onClick={() => goToPage(props.project.id)}>
                {props.project.title.rendered}
              </span> */}
              <span>{props.project.title.rendered}</span>
            </h5>
          </div>
          <div className="right">
            <div>
              <span>{projectPhaseLabel(props.project.phase)}</span>
              <span>{projectLaunchDateLabel(props.project.launch)}</span>
            </div>
          </div>
        </div>
        <div className="bottom-panel">
          <div className="left">
            <div className="project-overall-meta">
              <div className="item">
                <span className="label">Members</span>
                <span>2</span>
              </div>
              <div className="item">
                <span className="label">Plans</span>
                <span>1</span>
              </div>
              <div className="item">
                <span className="label">Accounts</span>
                <span>1</span>
              </div>
              <div className="item">
                <span className="label">Tasks</span>
                <span>3</span>
              </div>
              <div className="item">
                <span className="label">Notes</span>
                <span>7</span>
              </div>
              <div className="item">
                <span className="label">Messages</span>
                <span>64</span>
              </div>
            </div>
          </div>
          <div className="right">
            <span className="goto">
              <FontAwesomeIcon
                icon="desktop"
                onClick={() =>
                  props.history.push("/project/" + props.project.id)
                }
              />
            </span>
            <span className="edit">
              <FontAwesomeIcon
                icon="edit"
                onClick={() => props.toggleUpdateProjectModal(props.project)}
              />
            </span>
            <span className="trash">
              <FontAwesomeIcon
                icon="trash"
                onClick={() => props.toggleDeleteProjectBootbox(props.project)}
              />
            </span>
          </div>
        </div>
      </li>
    );
  };

  return (
    <Fragment>
      <Calendar
        onActiveDateChange={onActiveDateChange}
        onChange={onChange}
        onClickDay={onClickDay}
        onClickDecade={onClickDecade}
        onClickMonth={onClickMonth}
        onClickYear={onClickYear}
        onDrillDown={onDrillDown}
        onDrillUp={onDrillUp}
      />
      <ul className="default-display-list projects-list">
        {projectsFilterList &&
          projectsFilterList.map((project, index) => (
            <PCItem
              toggleUpdateProjectModal={props.toggleUpdateProjectModal}
              toggleDeleteProjectBootbox={props.toggleDeleteProjectBootbox}
              appData={props.appData}
              project={project}
              index={index}
              key={index}
              history={props.history}
            />
          ))}
      </ul>
    </Fragment>
  );
};

export class Projects extends Component {
  state = {
    appData: this.props && this.props.appData,
    deleteItemBootboxOpen: false,
    updateProjectModalIsOpen: false,
    activeUpdateProject: null,
    createModalIsOpen: false,
    actionModalIsOpen: true,
    filterTypeView: "all",
    headerData: [
      {
        type: "projects",
        centerheader: {
          type: "list",
          title: "My Projects",
          subtitle: "List",
          list: [
            {
              icon: "list",
              action: null,
              label: "List"
            },
            {
              icon: "calendar",
              action: null,
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
          listType: "projects",
          listItems: [
            {
              label: "Open Projects",
              filterTypeView: "open",
              action: this.props.changeFilterType
            },
            {
              label: "Archived",
              filterTypeView: "archived",
              action: this.props.changeFilterType
            },
            {
              label: "All Projects",
              filterTypeView: "all",
              action: this.props.changeFilterType
            },
            {
              label: "By Dates",
              action: null,
              filterTypeView: "date",
              rightIcon: "angle-right",
              subListItems: [
                {
                  label: "Launch Date",
                  filterTypeView: "launch-expiration",
                  action: this.props.changeFilterType
                },
                {
                  label: "Domain Expiration Date",
                  filterTypeView: "domain-expiration",
                  action: this.props.changeFilterType
                },
                {
                  label: "Hosting Expiration Date",
                  filterTypeView: "hosting-expiration",
                  action: this.props.changeFilterType
                }
              ]
            }
          ]
        }
      }
    ],
    projectsFilterList:
      this.props && this.props.appData && this.props.appData.projects
        ? this.props.appData.projects
        : null
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  closeCreateModal = newStatus => {
    this.setState({
      createModalIsOpen: newStatus
    });
  };

  closeUpdateProjectModal = () => {
    this.setState({
      updateProjectModalIsOpen: !this.state.updateProjectModalIsOpen
    });
  };

  toggleUpdateProjectModal = project => {
    console.log("toggleUpdateProjectModal", project);
    this.setState({
      activeUpdateProject: project,
      updateProjectModalIsOpen: !this.state.updateProjectModalIsOpen
    });
  };

  doNothing = () => {};

  confirmDelete = project => {};

  toggleDeleteProjectBootbox = project => {
    this.setState({
      deleteItemBootboxOpen: !this.state.deleteItemBootboxOpen
    });
  };

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleActionModal={this.props.toggleActionModal}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("projects", this.state.headerData)}
        />
        <main className="app-body">
          <div className="app-body-inner">
            <ProjectsCalendarList
              appData={this.props && this.props.appData}
              history={this.props && this.props.history}
              projectsFilterList={this.state && this.state.projectsFilterList}
              toggleUpdateProjectModal={this.toggleUpdateProjectModal}
              toggleDeleteProjectBootbox={this.toggleDeleteProjectBootbox}
              history={this.props.history}
            />
          </div>
        </main>

        <BootBox
          message="Delete this project?"
          show={
            this.state.deleteItemBootboxOpen
              ? this.state.deleteItemBootboxOpen
              : false
          }
          onYesClick={this.confirmDelete && this.confirmDelete}
          onNoClick={
            this.toggleDeleteProjectBootbox && this.toggleDeleteProjectBootbox
          }
          onClose={this.doNothing && this.doNothing}
        />

        <CreateProjectModal
          appData={this.props.appData}
          modalIsOpen={this.state.createModalIsOpen}
          closeCreateModal={this.closeCreateModal}
          createAppItem={this.props.createAppItem}
          activeUpdateProject={this.state.activeUpdateProject}
          title={
            <Fragment>
              <FontAwesomeIcon icon="clipboard" />
              <span>Create Project</span>
            </Fragment>
          }
        />

        <UpdateProjectModal
          activeUpdateProject={this.state.activeUpdateProject}
          modalIsOpen={this.state && this.state.updateProjectModalIsOpen}
          closeUpdateProjectModal={this.closeUpdateProjectModal}
          title={
            <Fragment>
              <FontAwesomeIcon icon="clipboard" />
              <span>Update Project</span>
            </Fragment>
          }
        />
        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

export class ProjectDetail extends Component {
  state = {
    activeTab:
      this.props && this.props.viewChange ? this.props.viewChange : "list-view",
    filterTypeView: "projects",
    headerData: [
      {
        type: "projects",
        centerheader: {
          type: "list",
          title:
            this.state && this.state.currentProject
              ? this.state.currentProject.title.rendered
              : "My Projects",
          subtitle: "List",
          list: [
            {
              icon: "list",
              action: this.props.changeTheView,
              viewchange: "list-view",
              label: "List"
            },
            {
              icon: "clipboard-check",
              action: this.props.changeTheView,
              viewchange: "board-view",
              label: "Board"
            },
            {
              icon: "calendar",
              action: this.props.changeTheView,
              viewchange: "calendar-view",
              label: "Calendar"
            },
            {
              icon: "comments",
              action: this.props.changeTheView,
              viewchange: "coversations-view",
              label: "Conversations"
            },
            {
              icon: "info",
              action: this.props.changeTheView,
              viewchange: "overview-view",
              label: "Overview"
            }
          ]
        },
        rightheader: [
          {
            type: "icon",
            icon: "filter",
            action: null,
            filterModalLink: true
          }
        ]
      }
    ],
    currentProject: {},
    currentProjectTasks: [],
    date: new Date()
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount = () => {
    let theProjID = this.props.history.location.pathname.replace(
      "/project/",
      ""
    );
    let currentProject = null;
    if (this.props && this.props.appData && this.props.appData.projects) {
      console.log("props - ", this.props);
      console.log("theProjID - ", parseInt(theProjID));
      console.log("this.props.appData.tasks", this.props.appData.tasks);
      console.log("this.props.appData.projects", this.props.appData.projects);
      let theIndex = this.props.appData.projects.findIndex(project => {
        return project.id === parseInt(theProjID);
      });
      currentProject = this.props.appData.projects[theIndex];
      let theTaskListIDs = this.props.appData.projects[theIndex].tasks;
      let theTaskList = [];
      theTaskListIDs &&
        theTaskListIDs.map(itemID => {
          let theIndex = this.props.appData.tasks.findIndex(task => {
            return task.id === itemID;
          });
          theTaskList.push(this.props.appData.tasks[theIndex]);
        });
      if (theTaskListIDs) {
        let updatedState = { ...this.state };
        updatedState["headerData"][0].centerheader.title =
          currentProject.title.rendered;
        updatedState["currentProject"] = { ...currentProject };
        updatedState["currentProjectTasks"] = [...theTaskList];

        this.setState({ ...updatedState });
      }
      console.log("theTaskListIDs - ", theTaskList);
    }
    console.log("UPDATED STATE - ", this.state);
  };

  onChange = date => this.setState({ date });

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("projects", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          changeTheView={this.props.changeTheView}
          activeViewTab={this.state.activeViewTab}
        />
        <main className="app-body">
          <div className="app-body-inner">
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="list-view">
                <TaskList taskFilterList={this.state.currentProjectTasks} />
              </TabPane>
              <TabPane tabId="calendar-view">
                <Calendar onChange={this.onChange} value={this.state.date} />
                <TaskList taskFilterList={this.state.currentProjectTasks} />
              </TabPane>
              <TabPane tabId="board-view">
                <h4>Board View</h4>
              </TabPane>
              <TabPane tabId="conversations-view">
                <h4>Conversations View</h4>
              </TabPane>
              <TabPane tabId="overview-view">
                <h4>Overview View</h4>
              </TabPane>
            </TabContent>
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

const CreateProjectModal = props => {
  console.log("CreateProjectModal", props);
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
    props.closeCreateModal(tempModalIsOpen);
  };
  return (
    <Fragment>
      <div className="create-button-wrapper">
        <div className="create-button" onClick={() => toggleTheModal()}>
          <FontAwesomeIcon icon="plus" />
        </div>
      </div>
      <Modal isOpen={theModalIsOpen} toggle={toggleTheModal}>
        <ModalHeader toggle={toggleTheModal}>{props.title}</ModalHeader>
        <ModalBody>
          <ProjectFormFields
            theForm={props.activeUpdateProject && props.activeUpdateProject}
            toggle={toggleTheModal}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="primary"
            onClick={e => submitForm(theCurrForm)}
          >
            Create
          </Button>{" "}
          <Button color="secondary" onClick={toggleTheModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

const UpdateProjectModal = props => {
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
    props.closeUpdateProjectModal(tempModalIsOpen);
  };
  return (
    <Fragment>
      <Modal isOpen={props.modalIsOpen} toggle={toggleTheModal}>
        <ModalHeader toggle={toggleTheModal}>{props.title}</ModalHeader>
        <ModalBody>
          <ProjectFormFields
            theForm={props.activeUpdateProject && props.activeUpdateProject}
            toggle={toggleTheModal}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="primary"
            onClick={e => submitForm(theCurrForm)}
          >
            Update
          </Button>{" "}
          <Button color="secondary" onClick={toggleTheModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};
