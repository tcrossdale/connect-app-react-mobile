import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { ProjectFormFields, FormUserOptions } from "../components/forms";
import { Preloader } from "../components/preloader-container";
import { TaskList } from "../containers/Tasks";
import BootBox from "react-bootbox";
import {
  Form,
  FormGroup,
  FormText,
  Label,
  Input,
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
          subtitle: null,
          list: null
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

  onInputChange = event => {
    let fieldKey = event.currentTarget.getAttribute("name");
    let fieldValue = event.currentTarget.value;
    let theFieldArray = [fieldValue];
    let initUpdateForm = { ...this.state.activeUpdateProject };

    switch (fieldKey) {
      case "title":
      case "content":
        initUpdateForm[fieldKey]["rendered"] = fieldValue;
        break;
      case "project_status":
      case "domain_provider":
      case "hosting_provider":
        initUpdateForm[fieldKey] = theFieldArray;
        break;
      default:
        initUpdateForm[fieldKey] = fieldValue;
        break;
    }
    this.setState({ activeUpdateProject: { ...initUpdateForm } });
  };

  submitUpdatePost = theForm => {
    let beforeSendForm = { ...theForm };
    let theTitle = beforeSendForm.title.rendered;
    let theContent = beforeSendForm.content.rendered;
    delete beforeSendForm.title;
    delete beforeSendForm.content;
    beforeSendForm["title"] = theTitle;
    beforeSendForm["content"] = theContent;
    this.props.updateAppItem(beforeSendForm, "projects");
  };

  submitCreatePost = theForm => {
    let beforeSendForm = { ...theForm };
    let theTitle = beforeSendForm.title.rendered;
    let theContent = beforeSendForm.content.rendered;
    delete beforeSendForm.title;
    delete beforeSendForm.content;
    beforeSendForm["title"] = theTitle;
    beforeSendForm["content"] = theContent;
    this.props.createAppItem(beforeSendForm, "projects");
  };

  deletePostItem = theForm => {};

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
          activeUpdateProject={
            this.state.activeUpdateProject && this.state.activeUpdateProject
          }
          modalIsOpen={this.state.createModalIsOpen}
          toggle={this.closeCreateModal}
          onInputChange={this.onInputChange}
          submitForm={this.submitCreatePost}
          title={
            <Fragment>
              <FontAwesomeIcon icon="clipboard" />
              <span>Create Project</span>
            </Fragment>
          }
        />

        <UpdateProjectModal
          appData={this.props.appData}
          activeUpdateProject={
            this.state.activeUpdateProject && this.state.activeUpdateProject
          }
          modalIsOpen={this.state && this.state.updateProjectModalIsOpen}
          toggle={this.closeUpdateProjectModal}
          onInputChange={this.onInputChange}
          submitForm={this.submitUpdatePost}
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
    activeTab: this.props.activeProjectDetailTab,
    filterTypeView: "projects",
    headerData: [
      {
        type: "projects",
        leftheader: "back",
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
              action: this.props.changeProjectDetailView,
              viewchange: "list-view",
              label: "List"
            },
            {
              icon: "clipboard-check",
              action: this.props.changeProjectDetailView,
              viewchange: "board-view",
              label: "Board"
            },
            {
              icon: "calendar",
              action: this.props.changeProjectDetailView,
              viewchange: "calendar-view",
              label: "Calendar"
            },
            {
              icon: "comments",
              action: this.props.changeProjectDetailView,
              viewchange: "coversations-view",
              label: "Conversations"
            },
            {
              icon: "info",
              action: this.props.changeProjectDetailView,
              viewchange: "overview",
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
    currentProject: null,
    currentProjectTasks: null,
    date: new Date()
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  onChange = date => this.setState({ date });

  changeTheView = tab => {
    alert();
    let currHeader = [...this.state.headerData];
    currHeader[0]["centerheader"]["subtitle"] = tab;
    this.props.changeProjectDetailView(tab);
    this.setState({
      ...this.state,
      headerData: [...currHeader]
    });
  };

  componentDidMount = () => {
    if (this.props.appData.projects) {
      let theProjID = parseInt(
        window.location.pathname.replace("/project/", "")
      );
      let theIndex = this.props.appData.projects.findIndex(project => {
        return project.id === theProjID;
      });
      let theHeaderData = [...this.state.headerData];
      theHeaderData[0]["centerheader"]["title"] = this.props.appData.projects[
        theIndex
      ].title.rendered;
      this.setState({
        headerData: [...theHeaderData],
        currentProject: { ...this.props.appData.projects[theIndex] }
      });
    }
  };

  componentDidUpdate = () => {
    console.log("Project Update State - ", this.state);
  };

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("projects", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          changeProjectDetailView={this.changeProjectDetailView}
          activeViewTab={this.state.activeViewTab}
          history={this.props.history}
        />
        <main className="app-body" id="project-detail-app-body">
          <div className="app-body-inner">
            <Preloader
              isLoading={this.props.appData && this.props.appData.isLoading}
            />
            <div
              className={
                this.props.appData.isLoading
                  ? "tab-content-wrapper hide"
                  : "tab-content-wrapper"
              }
            >
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="overview">
                  <div>
                    <h2>
                      {this.state.currentProject &&
                        this.state.currentProject.title &&
                        this.state.currentProject.title.rendered}
                    </h2>
                  </div>
                </TabPane>
                <TabPane tabId="list-view">
                  {!this.state.currentProjectTasks ? (
                    <div className="empty-list-panel">
                      <h4>No Current Project Tasks</h4>
                    </div>
                  ) : null}
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
      <Preloader isLoading={props.appData && props.appData.isLoading} />
      <div className={props.appData && props.appData.isLoading ? "hide" : null}>
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
      </div>
      <ul
        className={
          props.appData && props.appData.isLoading
            ? "default-display-list projects-list hide"
            : "default-display-list projects-list"
        }
      >
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

const CreateProjectModal = props => {
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
    props.toggle();
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
            onClick={e => props.submitForm(theCurrForm)}
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
    props.toggle();
  };

  return (
    <Fragment>
      <Modal isOpen={props.modalIsOpen} toggle={toggleTheModal}>
        <ModalHeader toggle={toggleTheModal}>
          {props.title ? props.title : null}
        </ModalHeader>
        <ModalBody>
          <ProjectFormFields
            appData={props.appData}
            activeUpdateProject={props.activeUpdateProject}
            onInputChange={props.onInputChange}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="primary"
            onClick={e => props.submitForm(props.activeUpdateProject)}
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
