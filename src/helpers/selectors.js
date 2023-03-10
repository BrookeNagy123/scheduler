export function getAppointmentsForDay(state, day) {
  const result = [];
  const arr = state.days
  const selectedDay = arr ? arr.filter(d => d.name === day)[0] : [];
  if(!selectedDay){
    return result;
  }
  const appointments = selectedDay.appointments
  for(const appointmentID of appointments){
    if(state.appointments[appointmentID]){
      result.push(state.appointments[appointmentID])
    }
  }
  return result;
}

//This function will return an object that contains the interview data if it is passed an object that contains an interviewer.

export function getInterview(state, interview){
if(!interview){
    return null;
}
const results = {}; 
const interviewers = state.interviewers
for(const key in interviewers){
  if(interviewers[key].id === interview.interviewer){
    results["interviewer"] = interviewers[key]
    results["student"] = interview.student
    return results; 
  }
}
}

export function getInterviewersForDay(state, day){
  const result = [];
  const arr = state.days
  const selectedDay = arr ? arr.filter(d => d.name === day)[0] : [];
  if(!selectedDay){
    return result;
  }

  const interviewer = selectedDay.interviewers
  for(const interviewerID of interviewer){
    if(state.interviewers[interviewerID]){
      result.push(state.interviewers[interviewerID])
    }
  }
  return result;
}

