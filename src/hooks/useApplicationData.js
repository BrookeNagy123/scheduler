import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData(){
  const [state, setState] = useState({
    days: [],
    day: "Monday",
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`),
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  const setDay = day => setState({ ...state, day })

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview: interview})
      .then((response) => {
        setState({
          ...state,
           appointments
        });
      })
  }

  function cancelInterview(id, interview){
    const appointment = {...state.appointments[id],
       interview: {...null} }
     const appointments = {
       ...state.appointments,
         [id]: appointment
       };
     return axios.delete(`http://localhost:8001/api/appointments/${id}`)
       .then((response) => {
         setState({
           ...state,
           appointments
         });
       })
   }
  return {state, setDay, bookInterview, cancelInterview};
}