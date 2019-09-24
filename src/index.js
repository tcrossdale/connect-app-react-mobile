import _ from "lodash";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.scss";
import "./styles/components/calendar.scss";
import "./styles/components/modals.scss";
import "./styles/components/preloader.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab, fas } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
  faAngleLeft,
  faAngleRight,
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faArrowRight,
  faBell,
  faBriefcase,
  faCalendar,
  faCalendarAlt,
  faCogs,
  faClipboard,
  faClipboardCheck,
  faClipboardList,
  faCheck,
  faCheckSquare,
  faCheckCircle,
  faCoffee,
  faComment,
  faCommentAlt,
  faCommentDots,
  faComments,
  faDesktop,
  faEdit,
  faEllipsisH,
  faEllipsisV,
  faEnvelopeOpenText,
  faExclamation,
  faExclamationCircle,
  faExclamationTriangle,
  faFilter,
  faGlobe,
  faHome,
  faInfo,
  faInfoCircle,
  faImage,
  faImages,
  faList,
  faListAlt,
  faListOl,
  faListUl,
  faMinus,
  faPencilAlt,
  faPlus,
  faPlusCircle,
  faPlusSquare,
  faSearch,
  faSort,
  faStickyNote,
  faTasks,
  faTable,
  faThumbsUp,
  faThumbsDown,
  faTrash,
  faTrashAlt,
  faUser,
  faUsers,
  faUserAlt,
  faUserPlus,
  faUserCog,
  faUserFriends,
  faDoorClosed
} from "@fortawesome/free-solid-svg-icons";
import { throws } from "assert";

library.add(
  fab,
  faArrowAltCircleRight,
  faArrowAltCircleLeft,
  faAngleLeft,
  faAngleRight,
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faArrowRight,
  faBell,
  faBriefcase,
  faCogs,
  faCalendar,
  faCalendarAlt,
  faCheck,
  faCheckCircle,
  faCheckSquare,
  faClipboard,
  faClipboardCheck,
  faClipboardList,
  faCoffee,
  faComment,
  faCommentAlt,
  faCommentDots,
  faComments,
  faDoorClosed,
  faDesktop,
  faEllipsisH,
  faEllipsisV,
  faEnvelopeOpenText,
  faEdit,
  faExclamation,
  faExclamationCircle,
  faExclamationTriangle,
  faFilter,
  faHome,
  faImage,
  faImages,
  faInfo,
  faInfoCircle,
  faList,
  faListAlt,
  faListOl,
  faListUl,
  faMinus,
  faPlus,
  faPlusCircle,
  faPlusSquare,
  faPencilAlt,
  faSearch,
  faSort,
  faStickyNote,
  faTasks,
  faTable,
  faTrash,
  faTrashAlt,
  faThumbsUp,
  faThumbsDown,
  faUser,
  faUserPlus,
  faUserAlt,
  faUsers,
  faUserCog,
  faUserFriends
);
import * as serviceWorker from "./serviceWorker";
import { setUserAppData } from "./actions/index";
import App from "./App";

class AppRouter extends Component {
  state = {
    isLoggedIn: false,
    isLoggedInCheck: true,
    appRouteContext: null,
    currentUser: null
  };

  constructor(props) {
    super(props);
    this.props = props;
    this.setappRouteContent = this.setappRouteContent.bind(this);
  }

  diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  setUserLoggedIn = theNewState => {
    this.setState({
      ...this.state,
      ...theNewState,
      isLoggedIn: true
    });
  };

  isOverIdletime = () => {
    let routeTimeStamp = localStorage.getItem("routeTimeStamp")
      ? localStorage.getItem("routeTimeStamp")
      : null;
    let currentTime = new Date();
    let loginTimeDiff = 0;
    let isOverLimit = null;
    if (routeTimeStamp) {
      routeTimeStamp = new Date(routeTimeStamp);
      loginTimeDiff = this.diff_minutes(currentTime, routeTimeStamp);
      console.log("loginTimeDiff", loginTimeDiff);
      if (loginTimeDiff > 30) {
        isOverLimit = true;
      }
    }
    return isOverLimit;
  };

  userStallCheck = theState => {
    let isOverIdletime = this.isOverIdletime();
    let thePathname = window.location.pathname;
    if (isOverIdletime) {
      if (thePathname !== "/") {
        this.logoutUser(theState);
        return false;
      }
    }
  };

  setRouteTimeStamp = () => {
    let currentTime = new Date();
    localStorage.setItem("routeTimeStamp", currentTime);
  };

  setappRouteContent = (history, theNewState) => {
    let routeContentPromise = new Promise((resolve, reject) => {
      history &&
        this.setState({
          ...theNewState,
          appRouteContext: history
        });
    }).then(response => {
      return response;
    });

    return routeContentPromise;
  };

  setTheUserAppData = currentUser => {
    const setAppDataPromise = new Promise((resolve, reject) => {
      fetchUserAppData(currentUser).then(response => {
        this.setState({
          ...this.state,
          ...response
        });
        let theAppData = JSON.stringify(response);
        let theUserData = JSON.stringify(newAppData.currentUser);

        localStorage.getItem("logoutTime") &&
          localStorage.removeItem("logoutTime");
        localStorage.getItem("previousUserAppData") &&
          localStorage.removeItem("previousUserAppData");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("appData", theAppData);
        localStorage.setItem("currentUser", theUserData);
        console.log("App Data Updated && LocalStorage Set!!");
      });
      resolve(true);
    })
      .then(data => {
        return data;
      })
      .catch(error => {
        return error;
      });
    return setAppDataPromise;
  };

  setAppRouteMountCachedAppData = () => {
    let appData = localStorage.getItem("appData")
      ? localStorage.getItem("appData")
      : null;

    if (appData) {
      appData = JSON.parse(appData);
      this.setState({
        ...this.state,
        ...appData
      });
    }
  };

  setInitCachedAppData = newState => {
    let setCachedDataPromise = new Promise((resolve, reject) => {
      this.setState({
        ...this.state,
        ...newState
      });
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("appData", JSON.stringify(newState));
      localStorage.setItem("currentUser", JSON.stringify(newState.currentUser));
      localStorage.getItem("logoutTime") &&
        localStorage.removeItem("logoutTime");
      localStorage.getItem("previousUserAppData") &&
        localStorage.removeItem("previousUserAppData");
      resolve({ ...this.state });
    }).then(response => {
      return response;
    });

    return setCachedDataPromise;
  };

  logoutUser = theContextState => {
    const logoutPromise = new Promise((resolve, reject) => {
      this.setState({ isLoggedIn: false });

      let theUserAppData = JSON.stringify(theContextState);
      let logoutTime = new Date();
      localStorage.setItem("previousUserAppData", theUserAppData);
      localStorage.setItem("logoutTime", logoutTime);

      localStorage.getItem("loginTime") && localStorage.removeItem("loginTime");
      localStorage.getItem("appData") && localStorage.removeItem("appData");
      localStorage.getItem("routeTimeStamp") &&
        localStorage.removeItem("routeTimeStamp");
      localStorage.getItem("isLoggedIn") &&
        localStorage.removeItem("isLoggedIn");
      localStorage.getItem("currentUser") &&
        localStorage.removeItem("currentUser");
      resolve(this.state.isLoggedIn);
    }).then(data => {
      return data;
    });
    return logoutPromise;
  };

  updateAppDataContent = (featureType, updatedItem, updatedState) => {
    let theUpdatedState = { ...updatedState };
    let theFeatureTypeList = theUpdatedState[featureType];
    let foundIndex = updatedState[featureType].findIndex(item => {
      return item.id === updatedItem.id;
    });
    theFeatureTypeList[foundIndex] = {
      ...updatedState[featureType][foundIndex],
      ...updatedItem
    };
    theUpdatedState[featureType] = [...theFeatureTypeList];
    this.setState({
      ...theUpdatedState
    });
  };

  componentDidMount() {}

  render() {
    return (
      <App
        appData={this.state}
        setInitCachedAppData={this.setInitCachedAppData}
        setTheUserAppData={this.setTheUserAppData}
        setappRouteContent={this.setappRouteContent}
        logoutUser={this.logoutUser}
        updateAppDataContent={this.updateAppDataContent}
        setUserLoggedIn={this.setUserLoggedIn}
        userStallCheck={this.userStallCheck}
        setRouteTimeStamp={this.setRouteTimeStamp}
        setAppRouteMountCachedAppData={this.setAppRouteMountCachedAppData}
      />
    );
  }
}

ReactDOM.render(<AppRouter />, document.getElementById("root"));

serviceWorker.unregister();
