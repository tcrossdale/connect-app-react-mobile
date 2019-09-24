import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormText,
  Label,
  Input
} from "reactstrap";

export const setInputChange = (evt, theCurrentForm) => {
  let fieldKey = evt.currentTarget.getAttribute("name");
  let fieldValue = evt.currentTarget.value;
  let currentForm = { ...theCurrentForm };
  currentForm[fieldKey] = fieldValue;
  return currentForm;
};

export const FormUserOptions = ({ users, defaultOptionText, userid }) => {
  return (
    <Fragment>
      {defaultOptionText ? (
        <option>{defaultOptionText}</option>
      ) : (
        <option>Choose a member...</option>
      )}

      {users &&
        users.map((user, index) => (
          <option
            key={index}
            value={user.id}
            selected={userid && userid == user.id}
          >
            {user.name}
          </option>
        ))}
    </Fragment>
  );
};
export const FormPostOptions = props => {
  return (
    <Fragment>
      {props.defaultOptionText ? (
        <option>{props.defaultOptionText}</option>
      ) : (
        <option value="">Choose a project...</option>
      )}

      {props.list.map((item, index) => (
        <option
          key={index}
          value={item.id}
          selected={props.matchid && props.matchid === item.id}
        >
          {item.post_title}
        </option>
      ))}
    </Fragment>
  );
};

export const CreateProjectForm = props => {
  const theFormFields = {
    type: "projects",
    title: "",
    content: "",
    clientid: false,
    launch: "",
    progress: 0,
    project_status: "open",
    accountid: false,
    due_date: "",
    tasks: false,
    notes: false
  };

  const [theForm, setForm] = useState(theFormFields);
  const [formTitleError, setFormTitleError] = useState(false);

  const submitForm = function(form) {
    if (form.title == "") {
      setFormTitleError(true);
    } else {
      setForm(form);
      props.createNewPost(form);
    }
  };

  const onInputChange = (evt, theForm) => {
    let updatedForm = setInputChange(evt, theForm);
    setForm(updatedForm);
  };

  return (
    <React.Fragment>
      <ModalBody>
        <Form
          onSubmit={e => {
            submitForm(theForm);
          }}
        >
          <FormGroup>
            <Input
              name="title"
              id="title"
              type="text"
              className={formTitleError ? "form-control error" : "form-control"}
              placeholder="Title"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.title}
              invalid={formTitleError == true}
              required
            />
            <FormText>Enter a title for this project</FormText>
          </FormGroup>
          <FormGroup>
            <Input
              name="clientid"
              type="select"
              className="form-control"
              placeholder="Project Client"
              onChange={e => onInputChange(e, theForm)}
            >
              <FormUserOptions users={props.users} />
            </Input>
          </FormGroup>
          <FormGroup>
            <Input
              type="textarea"
              name="content"
              className="form-control"
              placeholder="Description"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.content}
            />
          </FormGroup>
          <FormGroup>
            <Label className="control-label">Due Date</Label>
            <Input
              name="due_date"
              type="date"
              className="form-control"
              placeholder="Due Date"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.due_date}
            />
          </FormGroup>
          <FormGroup>
            <Label className="control-label">Launch Date</Label>
            <Input
              name="launch"
              type="date"
              className="form-control"
              placeholder="Launch Date"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.launch}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="progress"
              type="number"
              className="form-control"
              placeholder="Progress"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.progress}
            />
          </FormGroup>
          <FormGroup>
            <Label className="control-label">Status</Label>
            <Input
              name="project_status"
              type="select"
              className="form-control"
              placeholder="Status"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.project_status}
            >
              <option value="open">Open</option>
              <option value="progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </Input>
          </FormGroup>
          <FormGroup className="text-right">
            <Button
              type="submit"
              color="primary"
              onClick={e => submitForm(theForm)}
            >
              Create {props.editableItemType}
            </Button>{" "}
            <Button color="secondary" onClick={props.closeModal}>
              Cancel
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </React.Fragment>
  );
};

export const CreateTaskForm = props => {
  const theFormFields = {
    type: "tasks",
    title: "",
    content: "",
    assigneeid: false,
    status: "open",
    priority: "",
    due_date: "",
    start_date: "",
    watchers: [],
    projectid: false,
    assigneeid: false
  };

  const [theForm, setForm] = useState(theFormFields);
  const [formTitleError, setFormTitleError] = useState(false);

  const submitForm = function(form) {
    if (form.title == "") {
      setFormTitleError(true);
    } else {
      setForm(form);
      props.createNewPost(form);
    }
  };

  const onInputChange = (evt, theForm) => {
    let updatedForm = setInputChange(evt, theForm);
    setForm(updatedForm);
  };

  return (
    <React.Fragment>
      <ModalBody>
        <Form
          onSubmit={e => {
            submitForm(theForm);
          }}
        >
          <FormGroup>
            <Input
              name="title"
              type="text"
              className={
                formTitleError && formTitleError != true
                  ? "form-control error"
                  : "form-control"
              }
              placeholder="Title"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.title}
              invalid={formTitleError && formTitleError == true}
              required
            />
            <FormText>Enter a title for this task.</FormText>
          </FormGroup>
          <FormGroup>
            <Label>Start Date</Label>
            <Input
              name="start_date"
              type="date"
              placeholder="Start Date"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.start_date}
            />
          </FormGroup>
          <FormGroup>
            <Label>Due Date</Label>
            <Input
              name="due_date"
              type="date"
              placeholder="Due Date"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.due_date}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="content"
              type="textarea"
              placeholder="Description"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.content}
            />
          </FormGroup>
          <FormGroup>
            <Label>Status</Label>
            <Input
              name="status"
              type="select"
              placeholder="Status"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.status}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Blocked</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Priority</Label>
            <Input
              name="priority"
              type="select"
              placeholder="Priority"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.priority}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Assign this task</Label>
            <Input
              type="select"
              name="assigneeid"
              value={theForm.assigneeid}
              onChange={e => onInputChange(e, theForm)}
            >
              <FormUserOptions
                users={props.users}
                userid={props.currentUser ? props.currentUser.id : null}
              />
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Watchers</Label>
            <Input
              type="select"
              name="wacthers"
              value={theForm.wacthers}
              onChange={e => onInputChange(e, theForm)}
              multiple
            >
              <FormUserOptions
                users={props.users}
                defaultOptionText="Add members..."
              />
            </Input>
          </FormGroup>
          <FormGroup className="text-right">
            <Button
              type="submit"
              color="primary"
              onClick={e => submitForm(theForm)}
            >
              Create {props.editableItemType}
            </Button>{" "}
            <Button color="secondary" onClick={props.closeModal}>
              Cancel
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </React.Fragment>
  );
};

export const CreateNoteForm = props => {
  const theFormFields = {
    type: "notes",
    title: "",
    content: "",
    projectid: false,
    assigneeid: false
  };
  const [theForm, setForm] = useState(theFormFields);
  const [formTitleError, setFormTitleError] = useState(false);

  const submitForm = function(form) {
    if (form.title == "") {
      setFormTitleError(true);
    } else {
      setForm(form);
      props.createNewPost(form);
    }
  };

  const onInputChange = (evt, theForm) => {
    let updatedForm = setInputChange(evt, theForm);
    setForm(updatedForm);
  };

  return (
    <React.Fragment>
      <ModalBody>
        <Form
          onSubmit={e => {
            submitForm(theForm);
          }}
        >
          <FormGroup>
            <Input
              name="title"
              type="text"
              placeholder="Title"
              onChange={e => onInputChange(e, theForm)}
              value={theForm.title}
              invalid={formTitleError == true}
              required
            />
            <FormText>Enter a title for this note.</FormText>
          </FormGroup>
          <FormGroup>
            <Input
              name="content"
              type="textarea"
              placeholder="Leave note..."
              onChange={e => onInputChange(e, theForm)}
              value={theForm.content}
              invalid={formTitleError == true}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input type="select" name="projectid">
              <FormPostOptions
                list={props.projects}
                defaultOptionText="Attach to a project..."
              />
            </Input>
          </FormGroup>
          <FormGroup>
            <Input type="select" name="assigneeid">
              <FormPostOptions
                list={props.users}
                defaultOptionText="Assign this note..."
              />
            </Input>
          </FormGroup>
          <FormGroup className="text-right">
            <Button
              type="submit"
              color="primary"
              onClick={e => submitForm(theForm)}
            >
              Create {props.editableItemType}
            </Button>{" "}
            <Button color="secondary" onClick={props.closeModal}>
              Cancel
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </React.Fragment>
  );
};

export const AccountFormFields = props => {
  let initForm = props.theForm ? { ...props.theForm } : null;

  const [theCurrForm, setTheCurrForm] = useState({ ...initForm });

  const onInputChange = (evt, currForm) => {
    let fieldKey = evt.currentTarget.getAttribute("name");
    let fieldValue = evt.currentTarget.value;
    let currentForm = { ...currForm };
    let theFieldArray = [fieldValue];

    switch (fieldKey) {
      case "domain_provider":
      case "hosting_provider":
        currentForm[fieldKey] = theFieldArray;
        break;
      default:
        currentForm[fieldKey] = fieldValue;
        break;
    }
    setTheCurrForm(currentForm);
  };

  const updateFunction = form => {
    props.updateAppItem(form);
  };
  const createFunction = form => {
    props.createAppItem(form);
  };

  let theFinalFunc = null;
  let submitButtonLabel = "Update";
  if (initForm) {
    theFinalFunc = updateFunction;
  } else {
    theFinalFunc = createFunction;
    submitButtonLabel = "Create";
  }

  return (
    <Fragment>
      <ModalBody>
        {props.title ? <h4>{props.title}</h4> : null}
        <FormGroup>
          <Input
            name="title"
            type="text"
            placeholder="Title"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.title}
            required
          />
          <FormText>Enter a title for this note.</FormText>
        </FormGroup>
        <FormGroup>
          <Input
            name="assigneeid"
            type="select"
            placeholder="Account User"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.assigneeid
                ? theCurrForm.assigneeid
                : ""
            }
          >
            <FormUserOptions
              list={props.appData && props.appData.users}
              defaultOptionText="Assign to member..."
            />
          </Input>
        </FormGroup>
        <FormGroup>
          <Input
            name="wp_url"
            type="text"
            placeholder="WP Url"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.wp_url}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="wp_username"
            type="text"
            placeholder="WP Username"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.wp_username}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="wp_password"
            type="text"
            placeholder="WP Password"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.wp_password}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="hosting_provider"
            type="select"
            placeholder="Hosting Provider"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm &&
              theCurrForm.hosting_provider &&
              theCurrForm.hosting_provider[0]
            }
            defaultValue={!theCurrForm ? "" : null}
          >
            <option value="">None</option>
            <option value="internal">GoDaddy Internal</option>
            <option value="external">GoDaddy External</option>
            <option value="reseller">Reseller</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Input
            name="hosting_provider_username"
            type="text"
            placeholder="Hosting Provider Username"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.hosting_provider_username}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="hosting_provider_password"
            type="text"
            placeholder="Hosting Provider Password"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.hosting_provider_password}
          />
        </FormGroup>
        <FormGroup>
          <Label>Hosting Registration Date</Label>
          <Input
            name="hosting_registration_date"
            type="date"
            placeholder="Hosting Registration Date"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.hosting_registration_date}
          />
        </FormGroup>
        <FormGroup>
          <Label>Hosting Expiration Date</Label>
          <Input
            name="hosting_expiration_date"
            type="date"
            placeholder="Hosting Expiration Date"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.hosting_expiration_date}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="domain_provider"
            type="text"
            placeholder="Domain Provider"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm &&
              theCurrForm.domain_provider &&
              theCurrForm.domain_provider[0]
            }
          >
            <option value="">None</option>
            <option value="internal">GoDaddy Internal</option>
            <option value="external">GoDaddy External</option>
            <option value="reseller">Reseller</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Input
            name="domain_provider_username"
            type="text"
            placeholder="Domain Provider Username"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.domain_provider_username}
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="domain_provider_password"
            type="text"
            placeholder="Domain Provider Password"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.domain_provider_password}
          />
        </FormGroup>
        <FormGroup>
          <Label>Domain Registration Date</Label>
          <Input
            name="domain_registration_date"
            type="date"
            placeholder="Domain Registration Date"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.domain_registration_date}
          />
        </FormGroup>
      </ModalBody>

      <ModalFooter>
        <Button
          className="btn btn-primary"
          onClick={e => theFinalFunc(theCurrForm)}
        >
          {submitButtonLabel}
        </Button>
        <Button className="btn btn-primary" onClick={props.toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Fragment>
  );
};

export const UserFormFields = props => {
  let initForm = props.theForm ? { ...props.theForm } : null;

  const [theCurrForm, setTheCurrForm] = useState({ ...initForm });

  const onInputChange = (evt, currForm) => {
    let fieldKey = evt.currentTarget.getAttribute("name");
    let fieldValue = evt.currentTarget.value;
    let currentForm = { ...currForm };
    let theFieldArray = [fieldValue];

    currentForm[fieldKey] = fieldValue;
    setTheCurrForm(currentForm);
  };
  const updateFunction = form => {
    props.updateAppItem(form);
  };
  const createFunction = form => {
    props.createAppItem(form);
  };

  let theFinalFunc = null;
  let submitButtonLabel = "Update";
  if (initForm) {
    theFinalFunc = updateFunction;
  } else {
    theFinalFunc = createFunction;
    submitButtonLabel = "Create";
  }

  return (
    <Fragment>
      <ModalBody>
        {props.title ? <h4>{props.title}</h4> : null}
        <FormGroup>
          <Input
            name="username"
            type="text"
            placeholder="Username"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.username}
            required
          />
          <FormText>Enter a username for this new user.</FormText>
        </FormGroup>
        <FormGroup>
          <Input
            name="name"
            type="text"
            placeholder="Display Name"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.name}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="role"
            type="select"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.role}
            required
          >
            <option value="client">Client</option>
            <option value="contractor">Contractor</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.username}
            required
          />
          <FormText>Enter a email address for this new user.</FormText>
        </FormGroup>
        <FormGroup>
          <Input
            name="password"
            type="text"
            placeholder="Password"
            onChange={e => onInputChange(e, theCurrForm)}
            value={theCurrForm && theCurrForm.password}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          className="btn btn-primary"
          onClick={e => theFinalFunc(theCurrForm)}
        >
          {submitButtonLabel}
        </Button>
        <Button className="btn btn-primary" onClick={props.toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Fragment>
  );
};

export const ProjectFormFields = props => {
  let initForm = props.theForm ? { ...props.theForm } : null;

  const [theCurrForm, setTheCurrForm] = useState({ ...initForm });

  const [formTitleError, setFormTitleError] = useState("");

  const onInputChange = (evt, currForm) => {
    let fieldKey = evt.currentTarget.getAttribute("name");
    let fieldValue = evt.currentTarget.value;
    let currentForm = { ...currForm };
    let theFieldArray = [fieldValue];

    currentForm[fieldKey] = fieldValue;
    setTheCurrForm(currentForm);
  };

  const updateFunction = form => {
    props.updateAppItem(form);
  };
  const createFunction = form => {
    props.createAppItem(form);
  };

  let theFinalFunc = null;
  let submitButtonLabel = "Update";
  if (initForm) {
    theFinalFunc = updateFunction;
  } else {
    theFinalFunc = createFunction;
    submitButtonLabel = "Create";
  }

  return (
    <Fragment>
      {props.title ? <h4>{props.title}</h4> : null}
      <Form
        onSubmit={e => {
          submitForm(theCurrForm);
        }}
      >
        <FormGroup>
          <Input
            name="title"
            id="title"
            type="text"
            className={formTitleError ? "form-control error" : "form-control"}
            placeholder="Title"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.title && theCurrForm.title.rendered
                ? theCurrForm.title.rendered
                : ""
            }
            invalid={formTitleError == true}
            required
          />
          <FormText>Enter a title for this project</FormText>
        </FormGroup>
        <FormGroup>
          <Input
            name="clientid"
            type="select"
            className="form-control"
            placeholder="Project Client"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.clientid ? theCurrForm.clientid : false
            }
          >
            <FormUserOptions
              users={props.users}
              matchid={theCurrForm && theCurrForm.id ? theCurrForm.id : null}
            />
          </Input>
        </FormGroup>
        <FormGroup>
          <Input
            type="textarea"
            name="content"
            className="form-control"
            placeholder="Description"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.content && theCurrForm.content.rendered
                ? theCurrForm.content.rendered
                : ""
            }
          />
        </FormGroup>
        <FormGroup>
          <Label className="control-label">Due Date</Label>
          <Input
            name="due_date"
            type="date"
            className="form-control"
            placeholder="Due Date"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.due_date
                ? theCurrForm.due_date
                : "2000-07-18"
            }
          />
        </FormGroup>
        <FormGroup>
          <Label className="control-label">Launch Date</Label>
          <Input
            name="launch"
            type="date"
            className="form-control"
            placeholder="Launch Date"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.launch
                ? theCurrForm.launch
                : "2000-07-18"
            }
          />
        </FormGroup>
        <FormGroup>
          <Input
            name="progress"
            type="number"
            className="form-control"
            placeholder="Progress"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm && theCurrForm.progress ? theCurrForm.progress : 0
            }
          />
        </FormGroup>
        <FormGroup>
          <Label className="control-label">Status</Label>
          <Input
            name="project_status"
            type="select"
            className="form-control"
            placeholder="Status"
            onChange={e => onInputChange(e, theCurrForm)}
            value={
              theCurrForm &&
              theCurrForm.project_status &&
              theCurrForm.project_status[0]
                ? theCurrForm.project_status[0]
                : ""
            }
          >
            <option value="open">Open</option>
            <option value="progress">In Progress</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </Input>
        </FormGroup>
      </Form>
    </Fragment>
  );
};
