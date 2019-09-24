import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = props => {
  const mainHeaderRef = useRef(null);

  const [bottomHeaderOpen, setBottomHeaderOpen] = useState(false);
  const [currentHeader, setCurrentHeader] = useState(
    props.theHeader ? props.theHeader : null
  );
  const toggleBottomHeader = () => {
    let currBtmHdrOpen = !bottomHeaderOpen;
    mainHeaderRef.current.classList.toggle("is-open");
    setBottomHeaderOpen(currBtmHdrOpen);
  };

  let theAppHeaderClass = "app-header";
  let centerHeaderList =
    currentHeader &&
    currentHeader.centerheader &&
    currentHeader.centerheader.list
      ? currentHeader.centerheader.list
      : null;
  centerHeaderList ? (theAppHeaderClass += " has-app-header-bottom") : null;

  const LeftInnerHeader = props => {
    return (
      <div className="header-left">
        {props.currentHeader && props.currentHeader.leftheader ? (
          props.currentHeader.leftheader.map((item, index) => (
            <FontAwesomeIcon key={index} icon={item.icon} />
          ))
        ) : (
          <img
            onClick={() => props.toggleMainModal()}
            className="avatar"
            src={
              props.appData &&
              props.appData.currentUser &&
              props.appData.currentUser.avatar_urls
                ? props.appData.currentUser.avatar_urls["24"]
                : "https://via.placeholder.com/24"
            }
          />
        )}
      </div>
    );
  };

  const CenterInnerHeader = props => {
    let initViewTabTitle = props.activeViewTab
      ? props.activeViewTab
      : props.currentHeader.centerheader.subtitle;
    const [theViewTabTitle, setTheViewTabTitle] = useState(initViewTabTitle);

    useEffect(() => {
      let updatedSubTitle = props.activeViewTab
        ? props.activeViewTab
        : props.currentHeader.centerheader.subtitle;
      props.activeViewTab
        ? (updatedSubTitle = updatedSubTitle.replace("-view", ""))
        : null;
      setTheViewTabTitle(updatedSubTitle);
    });

    return (
      <div
        className="header-center"
        onClick={() =>
          props.currentHeader.centerheader.list
            ? props.toggleBottomHeader()
            : null
        }
      >
        <div className="header-center-top">
          <span>{props.currentHeader.centerheader.title}</span>
          <FontAwesomeIcon icon="angle-down" />
        </div>
        <div className="header-center-bottom">
          {theViewTabTitle && theViewTabTitle !== "" ? (
            <span>{theViewTabTitle}</span>
          ) : null}
        </div>
      </div>
    );
  };

  const RightInnerHeader = props => {
    const filterActionModalActions = theAction => {
      const currAction = theAction;
      currAction(props.currentHeader.actionsModalItems);
    };
    const navigateAction = (theAction, theUrl) => {
      const currAction = theAction;
      currAction(theUrl, props && props.history);
    };

    const toggleAction = theAction => {
      const currAction = theAction;
      currAction();
    };

    const checkActionType = item => {
      let OverallAction = null;
      if (item.filterModalLink) {
        OverallAction = filterActionModalActions(item.action);
      } else if (item.navigatePageUrl) {
        OverallAction = navigateAction(item.action, item.navigatePageUrl);
      }
      return OverallAction;
    };
    return (
      <div className="header-right">
        {props.currentHeader && props.currentHeader.rightheader
          ? props.currentHeader.rightheader.map((item, index) => (
              <FontAwesomeIcon
                key={index}
                icon={item.icon && item.icon}
                onClick={() => checkActionType(item)}
              />
            ))
          : null}
      </div>
    );
  };

  const DropdownList = props => {
    const runTheAction = (theAction, viewChange) => {
      console.log("The View", viewChange);
      let currAction = theAction;
      currAction(viewChange);
    };
    return (
      <ul className="list">
        {props.currentHeader &&
          props.currentHeader.centerheader &&
          props.currentHeader.centerheader.list &&
          props.currentHeader.centerheader.list.map((item, index) => (
            <li
              key={index}
              onClick={() =>
                runTheAction(item.action, item.viewchange && item.viewchange)
              }
              data-type={props.viewchange && item.viewchange}
              className={
                item.viewchange &&
                props.activeViewTab &&
                props.activeViewTab === item.viewchange
                  ? "active"
                  : null
              }
            >
              <FontAwesomeIcon icon={item.icon && item.icon} />{" "}
              <span>{item.label}</span>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <header className={theAppHeaderClass} ref={mainHeaderRef}>
      <div className="app-header-inner-wrap">
        <div className="app-header-top">
          <LeftInnerHeader
            currentHeader={currentHeader}
            appData={props.appData}
            toggleMainModal={props.toggleMainModal}
            toggleActionModal={props.toggleActionModal}
            changeFilterType={props.changeFilterType}
            changeTheView={props.changeViewType}
            activeViewTab={props.activeViewTab}
            swicthProjectDetailView={props.swicthProjectDetailView}
            history={props.history}
          />
          <CenterInnerHeader
            currentHeader={currentHeader}
            appData={props.appData}
            toggleMainModal={props.toggleMainModal}
            toggleBottomHeader={toggleBottomHeader}
            toggleActionModal={props.toggleActionModal}
            changeFilterType={props.changeFilterType}
            changeTheView={props.changeViewType}
            activeViewTab={props.activeViewTab}
            swicthProjectDetailView={props.swicthProjectDetailView}
            history={props.history}
          />
          <RightInnerHeader
            currentHeader={currentHeader}
            appData={props.appData}
            navigateToUsersPage={props.navigateToUsersPage}
            toggleMainModal={props.toggleMainModal}
            toggleActionModal={props.toggleActionModal}
            changeFilterType={props.changeFilterType}
            changeTheView={props.changeViewType}
            activeViewTab={props.activeViewTab}
            swicthProjectDetailView={props.swicthProjectDetailView}
            history={props.history}
          />
        </div>
        <div
          className={
            bottomHeaderOpen && bottomHeaderOpen === true
              ? "app-header-bottom active"
              : "app-header-bottom"
          }
        >
          <DropdownList
            currentHeader={currentHeader}
            mainHeaderRef={mainHeaderRef.current}
            appData={props.appData}
            toggleMainModal={props.toggleMainModal}
            toggleActionModal={props.toggleActionModal}
            changeFilterType={props.changeFilterType}
            changeTheView={props.changeViewType}
            activeViewTab={props.activeViewTab}
            swicthProjectDetailView={props.swicthProjectDetailView}
            history={props.history}
          />
        </div>
      </div>
    </header>
  );
};

export const getHeaderType = (theType, theHeaderData) => {
  let theIndex = theHeaderData.findIndex((item, index) => {
    return item.type === theType;
  });
  let theHeader = null;
  if (theIndex !== -1) {
    theHeader = theHeaderData[theIndex] ? theHeaderData[theIndex] : null;
  }

  return theHeader;
};

export default Header;
