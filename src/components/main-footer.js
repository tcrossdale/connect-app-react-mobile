import React, { Component, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = props => {
  const [currentUrl, setCurrentUrl] = useState(props.urlParam.url);
  console.log("Footer Route Stuff - ", currentUrl);
  return (
    <footer className="app-footer">
      <Link to="/home" className={currentUrl === "/home" ? "active" : null}>
        <FontAwesomeIcon icon="home" />
        <span>Home</span>
      </Link>
      <Link to="/tasks" className={currentUrl === "/tasks" ? "active" : null}>
        <FontAwesomeIcon icon="clipboard-check" />
        <span>Tasks</span>
      </Link>
      <Link to="/inbox" className={currentUrl === "/inbox" ? "active" : null}>
        <FontAwesomeIcon icon="bell" />
        <span>Inbox</span>
      </Link>
      <Link
        to="/projects"
        className={currentUrl === "/projects" ? "active" : null}
      >
        <FontAwesomeIcon icon="clipboard-list" />
        <span>Projects</span>
      </Link>
      <Link
        to="/accounts"
        className={currentUrl === "/accounts" ? "active" : null}
      >
        <FontAwesomeIcon icon="user-cog" />
        <span>Accounts</span>
      </Link>
    </footer>
  );
};

export default Footer;
