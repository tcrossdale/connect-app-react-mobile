import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import BootBox from "react-bootbox";
import {
  Access,
  WelcomeScreen,
  LoginScreen,
  RegisterScreen
} from "./containers/Access";
import Tasks, {
  diff_minutes,
  getDaysAhead,
  diff_minutes_display,
  getDaysAfterArray,
  setTheDaysAheadList,
  getFilterAfterDateList
} from "./containers/Tasks";
import TaskDetail from "./containers/TaskDetail";
import Inbox from "./containers/Inbox";
import { Projects, ProjectDetail } from "./containers/Projects";
import { Home } from "./containers/Home";
import Users from "./containers/Users";
import Profile from "./containers/Profile";
import Accounts from "./containers/Accounts";
import { Notes } from "./containers/Notes";
import MainFooter from "./components/main-footer";
import MainModal from "./components/main-modal";
import ActionModal from "./components/action-modal";

import {
  fetchUserAppData,
  createPost,
  deletePost,
  updatePost,
  createUser,
  fetchUsersProfiles
} from "./actions";

class App extends Component {
  constructor({ props, context }) {
    super(props);
    this.props = props;
    this.context = context;
    this.state =
      this.props && this.props.appData
        ? { ...this.state, ...this.props.appData }
        : { ...this.state };
  }

  state = {
    mainModalIsOpen: false,
    createModalIsOpen: false,
    isOnline: true,
    isLoggedIn:
      this.props && this.props.appData && this.props.appData.isLoggedIn
        ? this.props.appData.isLoggedIn
        : false,
    appData: this.props && this.props.appData ? this.props.appData : null,
    appRouteContext:
      this.props && this.props.appData && this.props.appData.appRouteContext
        ? this.props.appData.appRouteContext
        : null,
    isLoading: false,
    accountEditItem: null,
    actionModalIsOpen: false,
    actionModalItemsList: null,
    deleteItemBootboxIsOpen: false,
    filterTypeView: "all",
    filterType: "tasks",
    theDaysAfter: getDaysAfterArray(new Date(), new Date("2020-01-01")),
    usersFilterTypeView: "list-view",
    usersFilterList:
      this.props && this.props.appData && this.props.appData.users
        ? this.props.appData.users
        : [],
    accountsEditModalIsOpen: false,
    accountsFilterTypeView: "list-view",
    accountsFilterList:
      this.props && this.props.appData && this.props.appData.accounts
        ? this.props.appData.accounts
        : [],
    notesFilterList:
      this.props && this.props.appData && this.props.appData.notes
        ? this.props.appData.notes
        : [],
    taskFilterList:
      this.props && this.props.appData && this.props.appData.tasks
        ? this.props.appData.tasks
        : [],
    filterAfterDateList: getFilterAfterDateList(
      this.state && this.state.theDaysAfter,
      this.state && this.state.taskFilterList
    )
      ? getFilterAfterDateList(
          this.state && this.state.theDaysAfter && this.state.theDaysAfter,
          this.state && this.state.taskFilterList && this.state.taskFilterList
        )
      : [],
    viewChange: "list-view",
    showLogoutConfirmbox: false,
    activeProjectDetailTab: "overview",
    currentUser:
      this.props && this.props.appData && this.props.appData.currentUser
        ? this.props.appData.currentUser
        : null,
    historyContext: null
  };

  setInitCachedAppDataMotion = (newState, theHistory) => {
    this.props.setInitCachedAppData(newState).then(response => {
      console.log("APP DATA SET!!!!");
      theHistory.push("/home");
    });
  };

  logoutUser = () => {
    this.props.logoutUser(this.state).then(function() {
      window.location.href = "/login";
    });
  };

  setTheUserAppData = theUser => {
    this.props.setTheUserAppData(theUser);
  };

  toggleMainModal = () => {
    this.setState({
      mainModalIsOpen: !this.state.mainModalIsOpen
    });
  };

  toggleActionModal = panelItems => {
    if (panelItems) {
      this.setState({
        actionModalIsOpen: !this.state.actionModalIsOpen,
        actionModalItemsList: panelItems
      });
    } else {
      this.setState({
        actionModalIsOpen: !this.state.actionModalIsOpen
      });
    }
  };

  toggleCreatePostModal = formFields => {
    this.setState({
      createModalIsOpen: true
    });
  };

  toggleAccountEditModal = accountItem => {
    this.setState({
      accountsEditModalIsOpen: true
    });
  };

  changeFilterType = (theFilterType, theFilterTypeView) => {
    let theList = null;
    switch (theFilterType) {
      case "tasks":
        if (theFilterTypeView === "all") {
          theList = [...this.props.appData["tasks"]];
        } else {
          theList = [];
          this.props.appData["tasks"].map(task => {
            task.task_status && task.task_status[0] === theFilterTypeView
              ? theList.push(task)
              : null;
          });
        }
        this.setState({
          filterType: theFilterType,
          filterTypeView: theFilterTypeView,
          taskFilterList: theList
        });
        break;
      case "notes":
        theList = [...this.props.appData["notes"]];
        this.setState({
          filterType: theFilterType,
          filterTypeView: theFilterTypeView,
          taskFilterList: theList
        });
        break;
      case "accounts":
        theList = [...this.props.appData["accounts"]];
        this.setState({
          filterType: theFilterType,
          filterTypeView: theFilterTypeView,
          taskFilterList: theList
        });
        break;
      default:
        this.setState({
          filterType: theFilterType,
          filterTypeView: theFilterTypeView
        });
        break;
    }
  };

  changeTheView = theViewChange => {
    this.setState({
      viewChange: theViewChange
    });
  };

  changeAccountView = viewChange => {
    this.setState({
      accountsFilterTypeView: viewChange
    });
  };

  changeUsersView = viewChange => {
    this.setState({
      usersFilterTypeView: viewChange
    });
  };

  changeProjectDetailView = viewChange => {
    this.setState({
      activeProjectDetailTab: viewChange
    });
  };

  getFilterListType = theFilterTypeView => {
    let tempFilterList = this.state && this.state.tasks ? this.state.tasks : [];

    if (this.state.filterTypeView !== "all") {
      tempFilterList = [];
      this.state.tasks.map((task, index) => {
        if (task.task_status && task.task_status[0]) {
          if (task.task_status[0] === theFilterTypeView) {
            tempFilterList.push(task);
          }
        }
      });
    }
    this.setState({
      tasksList: [...tempFilterList]
    });
  };

  handleLogoutClose = () => {
    this.setState({
      showLogoutConfirmbox: false
    });
  };

  confirmLogout = () => {
    this.props.logoutUser(this.state).then(function() {
      window.location.pathname = "/";
    });
  };

  navigateToUsersPage = (theUrl, theHistory) => {
    theHistory.push(theUrl);
  };

  askToLogout = () => {
    this.setState({
      actionModalIsOpen: false,
      showLogoutConfirmbox: true
    });
  };

  deleteItemBootbox = (theItem, actionType) => {
    this.setState({
      deleteItemBootboxOpen: true
    });
  };

  updateAppItem = (thePost, featureType) => {
    let newPost = { ...thePost };
    updatePost(this.props.appData.currentUser, newPost, featureType).then(
      response => {
        this.props.updateAppDataContent(
          featureType,
          response,
          this.props.appData
        );
      }
    );
  };

  createAppItem = (theItem, featureType) => {
    let newPost = { ...theItem };
    createPost(this.state.currentUser, newPost, featureType).then(response => {
      let theAppData = { ...this.props.appData };
      let listsOfPosts = [...theAppData[featureType]];
      listsOfPosts.push(response);
      theAppData[featureType] = [...listsOfPosts];

      this.props.updateAppDataContent(featureType, response, theAppData);
    });
  };

  deleteAppItem = (theItem, featureType) => {
    let newPost = { ...theItem };
    deletePost(this.state.currentUser, newPost, featureType).then(response => {
      let theAppData = { ...this.props.appData };
      let listsOfPosts = [...theAppData[featureType]];
      listsOfPosts.push(response);
      theAppData[featureType] = [...listsOfPosts];

      this.props.updateAppDataContent(featureType, response, theAppData);
    });
  };

  confirmDelete = () => {};

  toggleTaskStatus = theTask => {
    if (theTask) {
      let theStatus = theTask.task_status && theTask.task_status[0];
      let updatedTask = { ...theTask };
      switch (theStatus) {
        case "open":
        case "progress":
          theStatus = "resolved";
          break;
        case "resolved":
          theStatus = "open";
          break;
        default:
          break;
      }
      updatedTask["task_status"][0] = theStatus;
      this.updateAppItem(updatedTask, "tasks");
    }
  };

  goToPage = theURL => {
    window.location.pathname = theURL;
  };

  componentWillMount = () => {
    this.props.userStallCheck(this.state);
  };

  componentDidMount = () => {
    this.props.setAppRouteMountCachedAppData();
    this.props.isLoggedInCheck();
  };

  componentDidUpdate() {
    this.props.setRouteTimeStamp();
    console.log("APP Update");
    fetchUsersProfiles(
      this.props && this.props.appData && this.props.appData.users
    );
  }

  render() {
    return (
      <Router>
        <div className="app">
          <BootBox
            message="Are you sure you want log out?"
            show={
              this.state.showLogoutConfirmbox
                ? this.state.showLogoutConfirmbox
                : false
            }
            onYesClick={this.confirmLogout && this.confirmLogout}
            onNoClick={this.handleLogoutClose && this.handleLogoutClose}
            onClose={this.handleLogoutClose && this.handleLogoutClose}
          />
          <BootBox
            message="Delete this item?"
            show={
              this.state.deleteItemBootboxOpen
                ? this.state.deleteItemBootboxOpen
                : false
            }
            onYesClick={this.confirmDelete && this.confirmDelete}
            onNoClick={this.confirmDelete && this.confirmDelete}
            onClose={this.confirmDelete && this.confirmDelete}
          />
          <MainModal
            appData={this.props.appData}
            actionModalIsOpen={this.state && this.state.actionModalIsOpen}
            mainModalIsOpen={this.state && this.state.mainModalIsOpen}
            viewChange={this.state && this.state.viewChange}
            filterType={this.state && this.state.filterType}
            filterTypeView={this.state && this.state.filterTypeView}
            filterAfterDateList={this.state && this.state.filterAfterDateList}
            theDaysAfter={this.state.theDaysAfter}
            setTheDaysAheadList={setTheDaysAheadList}
            changeFilterType={this.changeFilterType}
            changeTheView={this.changeTheView}
            toggleActionModal={this.toggleActionModal}
            toggleMainModal={this.toggleMainModal}
            navigateToUsersPage={this.navigateToUsersPage}
            askToLogout={this.askToLogout}
            goToPage={this.goToPage}
          />
          <ActionModal
            actionModalIsOpen={this.state && this.state.actionModalIsOpen}
            viewChange={this.state && this.state.viewChange}
            filterType={this.state && this.state.filterType}
            filterTypeView={this.state && this.state.filterTypeView}
            toggleActionModal={this.toggleActionModal}
            navigateToUsersPage={this.navigateToUsersPage}
            changeFilterType={this.changeFilterType}
            changeTheView={this.changeTheView}
            actionModalItemsList={this.state && this.state.actionModalItemsList}
          />
          <Route
            path="/"
            exact
            component={({ history, match }) => (
              <WelcomeScreen
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                setInitCachedAppDataMotion={this.setInitCachedAppDataMotion}
              />
            )}
          />
          <Route
            path="/home"
            exact
            component={({ history, match }) => (
              <Home
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeAccountView={this.changeAccountView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                toggleAccountEditModal={this.toggleAccountEditModal}
                accountsFilterList={this.state && this.state.accountsFilterList}
                accountsFilterTypeView={this.state.accountsFilterTypeView}
                accountsEditModalIsOpen={this.state.accountsEditModalIsOpen}
                accountEditItem={this.state.accountEditItem}
                navigateToUsersPage={this.navigateToUsersPage}
                deleteItemBootbox={this.deleteItemBootbox}
                updateAppItem={this.updateAppItem}
                createAppItem={this.createAppItem}
              />
            )}
          />
          <Route
            path="/login"
            exact
            component={({ history, match }) => (
              <LoginScreen
                appData={this.props.appData}
                setTheUserAppData={this.props.setTheUserAppData}
                isLoggedIn={this.isLoggedIn}
                history={history}
                match={match}
                logoutUser={this.logoutUser}
                setInitCachedAppDataMotion={this.setInitCachedAppDataMotion}
                setUserLoggedIn={this.props.setUserLoggedIn}
              />
            )}
          />
          <Route
            path="/register"
            exact
            component={({ history, match }) => (
              <RegisterScreen
                appData={this.props.appData}
                setUserAppData={this.setUserAppData}
                isLoggedIn={this.isLoggedIn}
                history={history}
                logoutUser={this.logoutUser}
              />
            )}
          />
          <Route
            path="/inbox"
            exact
            component={({ history, match }) => (
              <Inbox
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                navigateToUsersPage={this.navigateToUsersPage}
                deleteItemBootbox={this.deleteItemBootbox}
              />
            )}
          />
          <Route
            path="/projects"
            exact
            component={({ history, match }) => (
              <Projects
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                navigateToUsersPage={this.navigateToUsersPage}
                deleteItemBootbox={this.deleteItemBootbox}
                updateAppItem={this.updateAppItem}
              />
            )}
          />
          <Route
            path="/project/:id"
            exact
            component={({ history, match }) => (
              <ProjectDetail
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                navigateToUsersPage={this.navigateToUsersPage}
                deleteItemBootbox={this.deleteItemBootbox}
                activeProjectDetailTab={this.state.activeProjectDetailTab}
                changeProjectDetailView={this.changeProjectDetailView}
              />
            )}
          />
          <Route
            path="/profile"
            exact
            component={({ history, match }) => (
              <Profile
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeAccountView={this.changeAccountView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                toggleAccountEditModal={this.toggleAccountEditModal}
                accountsFilterList={this.state && this.state.accountsFilterList}
                accountsFilterTypeView={this.state.accountsFilterTypeView}
                accountsEditModalIsOpen={this.state.accountsEditModalIsOpen}
                accountEditItem={this.state.accountEditItem}
                navigateToUsersPage={this.navigateToUsersPage}
                deleteItemBootbox={this.deleteItemBootbox}
                updateAppItem={this.updateAppItem}
                goToPage={this.goToPage}
              />
            )}
          />
          <Route
            path="/accounts"
            exact
            component={({ history, match }) => (
              <Accounts
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeAccountView={this.changeAccountView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                toggleAccountEditModal={this.toggleAccountEditModal}
                accountsFilterList={this.state && this.state.accountsFilterList}
                accountsFilterTypeView={this.state.accountsFilterTypeView}
                accountsEditModalIsOpen={this.state.accountsEditModalIsOpen}
                accountEditItem={this.state.accountEditItem}
                navigateToUsersPage={this.navigateToUsersPage}
                deleteItemBootbox={this.deleteItemBootbox}
                updateAppItem={this.updateAppItem}
              />
            )}
          />
          <Route
            path="/account/:id"
            exact
            component={({ history, match }) => (
              <AccountDetail
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                navigateToUsersPage={this.navigateToUsersPage}
                accountsFilterList={this.state && this.state.accountsFilterList}
                deleteItemBootbox={this.deleteItemBootbox}
              />
            )}
          />
          <Route
            path="/users"
            exact
            component={({ history, match }) => (
              <Users
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeUsersView={this.changeUsersView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                navigateToUsersPage={this.navigateToUsersPage}
                usersFilterList={this.state && this.state.usersFilterList}
                usersFilterTypeView={this.state.usersFilterTypeView}
                deleteItemBootbox={this.deleteItemBootbox}
              />
            )}
          />
          <Route
            path="/notes"
            exact
            component={({ history, match }) => (
              <Notes
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                deleteItemBootboxIsOpen={
                  this.state && this.state.deleteItemBootboxIsOpen
                }
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                navigateToUsersPage={this.navigateToUsersPage}
                notesFilterList={this.state && this.state.notesFilterList}
                deleteItemBootbox={this.deleteItemBootbox}
              />
            )}
          />
          <Route
            path="/tasks"
            exact
            component={({ history, match }) => (
              <Tasks
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                filterAfterDateList={
                  this.state && this.state.filterAfterDateList
                }
                theDaysAfter={this.state && this.state.theDaysAfter}
                setTheDaysAheadList={this.setTheDaysAheadList}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                taskFilterList={this.state && this.state.taskFilterList}
                toggleTaskStatus={this.toggleTaskStatus}
              />
            )}
          />
          <Route
            path="/task/:id"
            exact
            component={({ history, match }) => (
              <TaskDetail
                appData={this.props.appData}
                isLoggedIn={this.isLoggedIn}
                logoutUser={this.logoutUser}
                history={history}
                match={match}
                actionModalIsOpen={this.state && this.state.actionModalIsOpen}
                mainModalIsOpen={this.state && this.state.mainModalIsOpen}
                viewChange={this.state && this.state.viewChange}
                filterType={this.state && this.state.filterType}
                filterTypeView={this.state && this.state.filterTypeView}
                filterAfterDateList={
                  this.state && this.state.filterAfterDateList
                }
                theDaysAfter={this.state && this.state.theDaysAfter}
                setTheDaysAheadList={this.setTheDaysAheadList}
                changeFilterType={this.changeFilterType}
                changeTheView={this.changeTheView}
                toggleActionModal={this.toggleActionModal}
                toggleMainModal={this.toggleMainModal}
                taskFilterList={this.state && this.state.taskFilterList}
                toggleTaskStatus={this.toggleTaskStatus}
                deleteItemBootbox={this.deleteItemBootbox}
                updateAppItem={this.updateAppItem}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
