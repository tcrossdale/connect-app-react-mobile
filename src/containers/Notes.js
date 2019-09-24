import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { Preloader } from "../components/preloader-container";
import { Link } from "reactstrap";
import { throws } from "assert";
import "../styles/notes.scss";
import {
  theCurrentDateTime,
  theWeek,
  theMonths,
  diff_minutes,
  getDaysAhead,
  diff_minutes_display
} from "./Tasks";

const NotesList = ({ notesFilterList, isLoading }) => {
  const Item = ({ note }) => {
    let noteDate = new Date(note.date);
    let theDateDisplay = `${noteDate.getMonth() +
      1}/${noteDate.getDate()}/${noteDate.getFullYear()}`;
    const item = (
      <div className="inner">
        <div className="left">
          <FontAwesomeIcon icon="check-circle" />
          <h5>{note.post_title}</h5>
        </div>
        <div className="right">
          <span>{theDateDisplay}</span>
        </div>
      </div>
    );
    return item;
  };
  if (!notesFilterList) {
    return <Preloader isLoading={isLoading} />;
  } else {
    return (
      <ul className="default-display-list notes-list">
        {notesFilterList.map((note, index) => (
          <li key={index} className="display-item note-item">
            <Item note={note} />
          </li>
        ))}
      </ul>
    );
  }
};

export class Notes extends Component {
  state = {
    actionModalIsOpen: true,
    filterTypeView: "notes",
    headerData: [
      {
        type: "notes",
        centerheader: {
          type: "list",
          title: "My Notes",
          subtitle: "",
          list: null
        },
        rightheader: [
          {
            type: "icon",
            icon: "pencil-alt",
            action: null,
            filterModalLink: true
          }
        ]
      }
    ],
    notesFilterList:
      this.props && this.props.appData && this.props.appData.notes
        ? this.props.appData.notes
        : []
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    console.log("Notes Props - ", this.props);
    console.log("Notes State - ", this.state);
    let theFilterTypeView =
      this.props.filterTypeView && this.props.filterTypeView !== ""
        ? this.props.filterTypeView
        : "all";
    this.setState({
      notesFilterList:
        theFilterTypeView === "all"
          ? this.props.appData.notes
          : this.props.notesFilterList
    });
  }

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("notes", this.state.headerData)}
        />
        <main className="app-body">
          <div className="app-body-inner">
            <NotesList
              isLoading={
                this.props && this.props.appData && this.props.appData.isLoading
              }
              notesFilterList={this.state && this.state.notesFilterList}
              filterTypeView={this.props && this.props.filterTypeView}
            />
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
