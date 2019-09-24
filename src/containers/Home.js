import React, { Component, Fragment, useState } from "react";
import Header from "../components/main-header";
import Footer from "../components/main-footer";
import { AccountFormFields } from "../components/forms";
import { UserFormFields } from "../components/forms";
import BootBox from "react-bootbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane
} from "reactstrap";
import "../styles/home.scss";

export class Home extends Component {
  state = {
    appData: this.props && this.props.appData,
    createModalIsOpen: false,
    headerData: [
      {
        type: "home",
        centerheader: {
          type: "list",
          title: "Home",
          subtitle: null,
          list: null
        },
        rightheader: null,
        actionsModalItems: null
      }
    ],
    activeHomeTab: "all",
    viewType: "list",
    projects: this.props && this.props.appData && this.props.appData.projects
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

  toggleHomeTabs = tab => {
    this.setState({
      activeHomeTab: tab
    });
  };

  toggleViewType = () => {
    if (this.state.viewType === "list") {
      this.setState({
        viewType: "grid"
      });
    } else {
      this.setState({
        viewType: "list"
      });
    }
  };

  navigateToUsersPage = theUrl => {
    this.props.history.push(theUrl);
  };

  closeCreateModal = newStatus => {
    this.setState({
      createModalIsOpen: newStatus
    });
  };

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={this.getHeaderType("home", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          changeAccountView={this.props.changeAccountView}
          activeViewTab={this.state.activeViewTab}
          navigateToUsersPage={this.navigateToUsersPage}
          history={this.props.history}
        />
        <main className={`app-body ${this.state.viewType}-view`}>
          <div className="app-body-inner">
            <div className="filter-header">
              <div className="inner">
                <div className="left">
                  <span
                    onClick={() => this.toggleHomeTabs("all")}
                    className={
                      this.state.activeHomeTab === "all" ? "active" : null
                    }
                  >
                    All
                  </span>
                  <span
                    onClick={() => this.toggleHomeTabs("favorites")}
                    className={
                      this.state.activeHomeTab === "favorites" ? "active" : null
                    }
                  >
                    Favorites
                  </span>
                  <span
                    onClick={() => this.toggleHomeTabs("recents")}
                    className={
                      this.state.activeHomeTab === "recents" ? "active" : null
                    }
                  >
                    Recents
                  </span>
                </div>
                <div className="right">
                  <FontAwesomeIcon
                    onClick={() => this.toggleViewType()}
                    icon={this.state.viewType === "list" ? "table" : "list-ul"}
                  />
                </div>
              </div>
            </div>

            <TabContent activeTab={this.state.activeHomeTab}>
              <TabPane tabId="all">
                <div className="home-projects-list">
                  {this.state.projects &&
                    this.state.projects.map((project, index) => (
                      <div
                        key={index}
                        className="item"
                        onClick={() =>
                          this.navigateToUsersPage(`/project/${project.id}`)
                        }
                      >
                        <div className="preview-icon">
                          <span>
                            <FontAwesomeIcon icon="briefcase" />
                          </span>
                        </div>
                        <div className="preview-content">
                          <h5>{project.title.rendered}</h5>
                          <p>2 members</p>
                        </div>
                      </div>
                    ))}
                </div>
              </TabPane>
              <TabPane tabId="favorites"></TabPane>
              <TabPane tabId="recent"></TabPane>
            </TabContent>
          </div>
        </main>

        <CreateFeatureModal
          appData={this.props.appData}
          modalIsOpen={this.state.createModalIsOpen}
          closeCreateModal={this.closeCreateModal}
          createAppItem={this.props.createAppItem}
        />
        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

const CreateFeatureModal = props => {
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const [activeTab, setActiveTab] = useState("form-switcher");
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
    props.closeCreateModal(tempModalIsOpen);
  };

  const togglePane = tab => {
    setActiveTab(tab);
  };
  return (
    <Fragment>
      <div className="create-button-wrapper create-feature-button-wrapper">
        <div className="create-button" onClick={() => toggleTheModal()}>
          <FontAwesomeIcon icon="plus-circle" />
        </div>
      </div>
      <Modal
        isOpen={theModalIsOpen}
        toggle={toggleTheModal}
        id="create-feature-modal"
      >
        <TabContent activeTab={activeTab}>
          <TabPane tabId="form-switcher">
            <div className="form-switcher">
              <div className="item" onClick={() => togglePane("account")}>
                <div>
                  <FontAwesomeIcon icon="user-cog" /> <span>New Account</span>
                </div>
                <div>
                  <FontAwesomeIcon icon="angle-right" />
                </div>
              </div>
              <div className="item" onClick={() => togglePane("user")}>
                <div>
                  <FontAwesomeIcon icon="user" /> <span>New User</span>
                </div>
                <div>
                  <FontAwesomeIcon icon="angle-right" />
                </div>
              </div>
              <div className="item" onClick={() => togglePane("task")}>
                <div>
                  <FontAwesomeIcon icon="clipboard" /> <span>New Task</span>
                </div>

                <div>
                  <FontAwesomeIcon icon="angle-right" />
                </div>
              </div>
              <div className="item" onClick={() => togglePane("note")}>
                <div>
                  <FontAwesomeIcon icon="edit" /> <span>New Note</span>
                </div>
                <div>
                  <FontAwesomeIcon icon="angle-right" />
                </div>
              </div>
              <div className="item" onClick={() => togglePane("project")}>
                <div>
                  <FontAwesomeIcon icon="briefcase" /> <span>New Project</span>
                </div>
                <div>
                  <FontAwesomeIcon icon="angle-right" />
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId="account">
            <div className="back-to-links">
              <div onClick={() => togglePane("form-switcher")}>
                <FontAwesomeIcon icon="angle-left" />
                <span>Back to options</span>
              </div>
            </div>
            <AccountFormFields
              title="Create Account"
              createAppItem={props.createAppItem}
              updateAppItem={props.updateAppItem}
              toggle={() => togglePane("form-switcher")}
            />
          </TabPane>
          <TabPane tabId="project">
            <div className="back-to-links">
              <div onClick={() => togglePane("form-switcher")}>
                <FontAwesomeIcon icon="angle-left" />
                <span>Back to options</span>
              </div>
            </div>
            {/* <AccountFormFields
                title="Create Project"
                createAppItem={props.createAppItem}
                updateAppItem={props.updateAppItem}
                toggle={toggleTheModal}
              /> */}
          </TabPane>
          <TabPane tabId="user">
            <div className="back-to-links">
              <div onClick={() => togglePane("form-switcher")}>
                <FontAwesomeIcon icon="angle-left" />
                <span>Back to options</span>
              </div>
            </div>
            <UserFormFields
              title="Add User"
              createAppItem={props.createAppItem}
              updateAppItem={props.updateAppItem}
              toggle={() => togglePane("form-switcher")}
            />
          </TabPane>
          <TabPane tabId="task">
            <div className="back-to-links">
              <div onClick={() => togglePane("form-switcher")}>
                <FontAwesomeIcon icon="angle-left" />
                <span>Back to options</span>
              </div>
            </div>
            <UserFormFields
              title="Add Task"
              createAppItem={props.createAppItem}
              updateAppItem={props.updateAppItem}
              toggle={() => togglePane("form-switcher")}
            />
          </TabPane>
          <TabPane tabId="note">
            <div className="back-to-links">
              <div onClick={() => togglePane("form-switcher")}>
                <FontAwesomeIcon icon="angle-left" />
                <span>Back to options</span>
              </div>
            </div>
            <UserFormFields
              title="Add Note"
              createAppItem={props.createAppItem}
              updateAppItem={props.updateAppItem}
              toggle={() => togglePane("form-switcher")}
            />
          </TabPane>
        </TabContent>
      </Modal>
    </Fragment>
  );
};
