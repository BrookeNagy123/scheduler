import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show"
import Empty from "./Empty";
import Form from "./Form"
import useVisualMode from "hooks/useVisualMode";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT"
const DELETING = "DELETING"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"

const { mode, transition, back } = useVisualMode(
  props.interview ? SHOW : EMPTY
);

function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };
  transition(SAVING)
  props.bookInterview(props.id, interview)
  .then(() => {
    transition(SHOW)
  })
  .catch(error => {transition(ERROR_SAVE, true)});
}


function cancel(){
  transition(DELETING, true)
  props.cancelInterview(props.id)
  .then(() => {
   transition(EMPTY)
  })
  .catch(error => {transition(ERROR_DELETE, true)});
}

  return <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={() => back()} />}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === ERROR_DELETE && <Error message="Could not delete appointment" onClose={() => back()}/>}
      {mode === CREATE && (<Form interviewers={props.interviewers}  onSave={save}  onCancel={() => back()}/>)}
      {mode === EDIT && (<Form interviewers={props.interviewers} student={props.interview.student} interviewer={props.interview.interviewer.id} onSave={save}  onCancel={() => back()}/>)}
      {mode === CONFIRM && <Confirm  message="Delete the appointment?" onConfirm={cancel} onCancel={() => back()}/>}
      {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer.name}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
     </article>
}

