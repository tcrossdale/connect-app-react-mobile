import fetch from "cross-fetch";
import axios from "axios";

export const theAuthUrl = "http://connect:8888/wp-json/jwt-auth/v1/token/";
export const theAPIUrl = "http://connect:8888/wp-json/wp/v2/";
// export const theAuthUrl = "http://mobile.crossdaletechsolutions.com/mobile/wp-json/jwt-auth/v1/token/";
// export const theAPIUrl = "http://mobile.crossdaletechsolutions.com/mobile/wp-json/wp/v1/";
export let theAppToken = "";
export let theAuthorId = "";

function generateRandomId(list) {
  let chosenList = list && list.length ? [...list] : [];
  let chosenListLength = chosenList.length;
  let randomId = 0;
  let hasTheID = true;

  while (hasTheID) {
    let currRandomId = Math.floor(Math.random() * (chosenListLength * 300) + 1);
    let ifHasID = chosenList.findIndex((item, index) => {
      return item.id === randomId;
    });
    if (ifHasID === -1) {
      randomId = currRandomId;
      hasTheID = false;
    }
  }
  return randomId;
}

function formatNewPostBeforeSend(newPost, authorToken) {
  let theNewPost = { ...newPost };
  console.log("POST BEFORE SEND FORMATTED", theNewPost);

  theNewPost["date"] = new Date();
  theNewPost["date_gmt"] = new Date();
  theNewPost["slug"] =
    newPost.title && newPost.title.rendered
      ? newPost.title.rendered
          .toLowerCase()
          .split(" ")
          .join("-")
      : `new-post-${Math.floor(Math.random() * newPost.id + 1)}`;
  theNewPost["status"] = "publish";
  theNewPost["excerpt"] = "";
  theNewPost["comment_status"] = "open";
  theNewPost["format"] = "standard";
  theNewPost["categories"] = [];
  theNewPost["tags"] = [];
  theNewPost["password"] = "";
  theNewPost["ping_status"] = "closed";
  theNewPost["author"] = authorToken;

  console.log("POST AFTER SEND FORMATTED", theNewPost);
  return theNewPost;
}

const formatAppData = (initData, returnVals = {}) => {
  let tempActions = returnVals.actions ? returnVals.actions : [];
  let tempUsers = returnVals.users ? returnVals.users : [];
  let tempTasks = returnVals.tasks ? returnVals.tasks : [];
  let tempProjects = returnVals.projects ? returnVals.projects : [];
  let tempNotes = returnVals.notes ? returnVals.notes : [];
  let tempAccounts = returnVals.accounts ? returnVals.accounts : [];
  let tempComments = returnVals.comments ? returnVals.comments : [];
  let tempMedia = returnVals.media ? returnVals.media : [];

  let currUserIndex = tempUsers.findIndex(user => {
    return user.slug === initData.currentUser.user_nicename;
  });
  let updatedUser = {
    ...initData.currentUser,
    ...tempUsers[currUserIndex]
  };
  initData.currentUser = { ...updatedUser };
  !initData.currentUser.accounts ? (initData.currentUser.accounts = []) : null;
  !initData.currentUser.tasks ? (initData.currentUser.tasks = []) : null;
  !initData.currentUser.projects ? (initData.currentUser.projects = []) : null;

  // Set User Accounts App Data
  tempAccounts.map(account => {
    let attachProjectID = tempProjects.findIndex(project => {
      return project.id === account.projectid;
    });

    let attachedProject =
      attachProjectID !== -1 ? tempProjects[attachProjectID] : null;
    attachedProject
      ? (account["project_name"] = attachedProject.title.rendered)
      : null;
    account.assigneeid && account.assigneeid === initData.currentUser.id
      ? initData.currentUser.accounts.push(account.id)
      : null;
  });

  tempProjects.map(project => {
    project.clientid === initData.currentUser.id
      ? initData.currentUser.projects.push(project.id)
      : null;
    project["post_title"] = project.title.rendered;
  });

  tempNotes.map(note => {
    note.assigneeid === initData.currentUser.id
      ? initData.currentUser.notes.push(note.id)
      : null;
    note["post_title"] = note.title.rendered;
  });

  tempTasks.map(task => {
    task.assigneeid === initData.currentUser.id
      ? initData.currentUser.tasks.push(task.id)
      : null;
    task["post_title"] = task.title.rendered;
  });

  initData.actions = tempActions;
  initData.users = tempUsers;
  initData.tasks = tempTasks;
  initData.projects = tempProjects;
  initData.notes = tempNotes;
  initData.accounts = tempAccounts;
  initData.comments = tempComments;
  initData.media = tempMedia;

  initData.isLoggedIn = true;
  initData.isLoading = false;
  theAppToken = initData.currentUser.token;
  theAuthorId = initData.currentUser.id;

  return initData;
};

export const addFormatAction = (
  sector,
  featureType,
  authorToken,
  item,
  type,
  title,
  content
) => {
  let sendActionPost = {
    title: title,
    feature_type: featureType,
    content: content,
    action_type: type,
    sector_type: sector
  };

  switch (sector) {
    case "admin":
      break;
    case "appData":
      sendActionPost["itemid"] = item.id;
      sendActionPost = formatNewPostBeforeSend(sendActionPost, authorToken);
      break;
    default:
      break;
  }
  return sendActionPost;
};

export const createActionPost = (newPost, authorToken) => {
  let createPostUrl = theAPIUrl + "actions";
  let formattedActionPost = formatNewPostBeforeSend(newPost, authorToken);
  console.log("theAppToken - ", authorToken);
  axios({
    url: createPostUrl,
    method: "POST",
    data: formattedActionPost,
    crossDomain: true,
    headers: {
      Authorization: `Bearer ${authorToken}`
    }
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      error["statusText"] = "failure";
      return error;
    });
};

export const deletePost = (theUser, postID, type, postsList) => {
  let theDeleteURL = `${theAPIUrl}${type}/${postID}`;
  return axios({
    url: theDeleteURL,
    method: "DELETE",
    data: { id: postID, force: false },
    crossDomain: true,
    headers: {
      Authorization: `Bearer ${theUser.token}`
    }
  })
    .then(response => {
      let currentPostsList = [...postsList];
      currentPostsList.map((post, index) => {
        post.id === postID ? currentPostsList.splice(index, 1) : null;
      });
      return currentPostsList;
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      error["statusText"] = "failure";
      return error;
    });
};

export const updatePost = (theUser, thePost, featureType) => {
  let createPostUrl = `${theAPIUrl}${thePost.type}/${thePost.id}`;
  let updatedPostBeforeSend = formatNewPostBeforeSend(thePost, theUser.token);

  let updatePostAction = addFormatAction(
    "appData",
    featureType,
    theUser.token,
    thePost,
    "update",
    `${thePost.title.rendered} has been updated`,
    `updating the ${featureType}`
  );

  createActionPost(updatePostAction, theUser.token);

  return axios({
    url: createPostUrl,
    method: "POST",
    data: updatedPostBeforeSend,
    crossDomain: true,
    headers: {
      Authorization: `Bearer ${theUser.token}`
    }
  })
    .then(response => {
      response.data["post_title"] = response.data.title.rendered;
      return response.data;
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      error["statusText"] = "failure";
      return error;
    });
};

export const createPost = (theUser, newPost, featureType) => {
  let createPostUrl = theAPIUrl + featureType;
  let updatedPostBeforeSend = formatNewPostBeforeSend(newPost, theUser.token);

  delete updatedPostBeforeSend.author;
  return axios({
    url: createPostUrl,
    method: "POST",
    data: updatedPostBeforeSend,
    crossDomain: true,
    headers: {
      Authorization: `Bearer ${theUser.token}`
    }
  })
    .then(response => {
      let updatePostAction = addFormatAction(
        "appData",
        featureType,
        response.data,
        "update",
        `${response.data.title.rendered} has been updated`,
        `updating the ${featureType}`
      );

      createActionPost(updatePostAction, theUser.token);
      response.data["post_title"] = response.data.title.rendered;
      return response.data;
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      error["statusText"] = "failure";
      return error;
    });
};

export const createUser = (newUser, newUserList) => {
  let usersApiUrl = theAPIUrl + "users";

  return axios({
    url: usersApiUrl,
    method: "POST",
    data: newUser,
    crossDomain: true,
    headers: {
      Authorization: `Bearer ${theAppToken}`
    }
  })
    .then(response => {
      let newListOfUsers = [...newUserList];
      newListOfUsers.unshift(response.data);
      return newListOfUsers;
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      error["error_label"] = "failure";
      return error;
    });
};

export const fetchUsersProfiles = usersList => {
  let listOfUserAPICalls = [];
  if (usersList) {
    usersList.map(user => {
      let theData = { roles: "contributor" };
      let usersAPICall = fetch(theAPIUrl + "users/" + user.id);
      listOfUserAPICalls.push(usersAPICall);
    });
    return Promise.all([listOfUserAPICalls])
      .then(values => Promise.all(values.map(value => value.json())))
      .then(finalVals => {
        return finalVals;
      })
      .catch(error => {
        return error;
      });
  }
};

export const fetchUserAppData = theCurrentUser => {
  let currentUserAPICall = fetch(theAPIUrl + "users/" + theCurrentUser.id);
  let actionsAPICall = fetch(theAPIUrl + "actions");
  let usersAPICall = fetch(theAPIUrl + "users");
  let tasksAPICall = fetch(theAPIUrl + "tasks");
  let projectsAPICall = fetch(theAPIUrl + "projects");
  let notesAPICall = fetch(theAPIUrl + "notes");
  let accountsAPICall = fetch(theAPIUrl + "accounts");
  let commentsAPICall = fetch(theAPIUrl + "comments");
  let mediaAPICall = fetch(theAPIUrl + "media");
  let appDataAPICall = fetch(theAPIUrl);
  let initState = {
    actions: {},
    users: [],
    tasks: [],
    projects: [],
    notes: [],
    accounts: [],
    comments: [],
    media: [],
    isLoading: true,
    isLoggedIn: false,
    currentUser: theCurrentUser
      ? theCurrentUser
      : { accounts: [], projects: [], tasks: [] },
    diplayUser: theCurrentUser
      ? theCurrentUser
      : { accounts: [], projects: [], tasks: [] }
  };

  return Promise.all([
    currentUserAPICall,
    actionsAPICall,
    usersAPICall,
    tasksAPICall,
    projectsAPICall,
    notesAPICall,
    accountsAPICall,
    commentsAPICall,
    mediaAPICall,
    appDataAPICall
  ])
    .then(values => Promise.all(values.map(value => value.json())))
    .then(finalVals => {
      const returnValues = {
        currentUser: finalVals[0],
        actions: finalVals[1],
        users: finalVals[2],
        tasks: finalVals[3],
        projects: finalVals[4],
        notes: finalVals[5],
        accounts: finalVals[6],
        comments: finalVals[7],
        media: finalVals[8],
        appData: finalVals[9]
      };
      const formatedAppData = formatAppData(initState, returnValues);

      return formatedAppData;
    })
    .catch(error => {
      return error;
    });
};

export const fetchAppData = theCurrentUser => {
  let actionsAPICall = fetch(theAPIUrl + "actions");
  let usersAPICall = fetch(theAPIUrl + "users");
  let tasksAPICall = fetch(theAPIUrl + "tasks");
  let projectsAPICall = fetch(theAPIUrl + "projects");
  let notesAPICall = fetch(theAPIUrl + "notes");
  let accountsAPICall = fetch(theAPIUrl + "accounts");
  let commentsAPICall = fetch(theAPIUrl + "comments");
  let mediaAPICall = fetch(theAPIUrl + "media");
  let initState = {
    actions: [],
    users: [],
    tasks: [],
    projects: [],
    notes: [],
    accounts: [],
    comments: [],
    media: [],
    isLoading: true,
    isLoggedIn: false,
    currentUser: theCurrentUser
      ? theCurrentUser
      : { accounts: [], projects: [], tasks: [] }
  };

  return Promise.all([
    actionsAPICall,
    usersAPICall,
    tasksAPICall,
    projectsAPICall,
    notesAPICall,
    accountsAPICall,
    commentsAPICall,
    mediaAPICall
  ])
    .then(values => Promise.all(values.map(value => value.json())))
    .then(finalVals => {
      const returnValues = {
        actions: finalVals[0],
        users: finalVals[1],
        tasks: finalVals[2],
        projects: finalVals[3],
        notes: finalVals[4],
        accounts: finalVals[5],
        comments: finalVals[6],
        media: finalVals[7]
      };
      const formatedAppData = formatAppData(initState, returnValues);

      return formatedAppData;
    })
    .catch(error => {
      return error;
    });
};

export const authFetchToken = theAuthData => {
  const errorCheck = theData => {
    return theData.username !== "" && theData.username !== "" ? true : false;
  };

  let authErrorCheck = errorCheck(theAuthData);

  if (!authErrorCheck) {
    let thePromise = new Promise((resolve, reject) => {
      const errorMsg = {
        message: "failure"
      };
      resolve(errorMsg);
    });
    return thePromise;
  }

  return axios({
    url: theAuthUrl,
    method: "POST",
    data: theAuthData ? theAuthData : {},
    crossDomain: true
  })
    .then(response => {
      return response.data;
    })
    .then(data => {
      let userTokenData = { ...data };
      let loginTime = new Date();
      userTokenData["loginTime"] = loginTime;
      userTokenData["message"] = "success";
      return userTokenData;
    })
    .catch(error => {
      return error;
    });
};

export const setUserAppData = theUser => {
  const userAppDataPromise = new Promise((resolve, reject) => {
    fetchUserAppData(theUser).then(newAppData => {
      resolve(newAppData);
    });
  }).then(data => {
    return data;
  });
  return userAppDataPromise;
};

export const getDaysAhead = (currDay, plusDays) => {
  let tempDay = null;
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

export const diff_minutes = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};

export const diff_minutes_display = (dt2, dt1) => {
  dt1 = new Date(dt1);
  let theMinsDiff = diff_minutes(dt2, dt1);
  let theDisplayLabel = "";
  let theDaysAheadLabel = "";
  let theDaysAheadCount = "";

  let theWeek = [
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
  let theMonths = [
    {
      month: "Jan"
    },
    {
      month: "Feb"
    },
    {
      month: "Mar"
    },
    {
      month: "Apr"
    },
    {
      month: "May"
    },
    {
      month: "Jun"
    },
    {
      month: "Jul"
    },
    {
      month: "Aug"
    },
    {
      month: "Sep"
    },
    {
      month: "Oct"
    },
    {
      month: "Nov"
    },
    {
      month: "Dec"
    }
  ];
};
