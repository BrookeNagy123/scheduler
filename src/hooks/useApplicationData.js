import { useState, useEffect } from "react";
import axios from 'axios';

//Custom hook to provide the state and actions used to change the state in the application.
export default function useApplicationData() {
  const [state, setState] = useState({
    days: [],
    day: "Monday",
    appointments: {},
    interviewers: {},
  });

  //Axios request to get the data for days, appointments, and interviewers and use that data to set the state. 
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  }, []);

  //Set the day in the state 
  const setDay = day => setState({ ...state, day });

  //Update the number of spots for the day 
  function updateSpots(state, id) {
    //Find the day object
    const currentDay = state.days.find((d) => d.appointments.includes(id));
    //Count all the null appointments
    const nullAppointments = currentDay.appointments.filter((id) => !state.appointments[id].interview);
    const spots = nullAppointments.length;
    const newDay = {...currentDay, spots};
    const newDays = state.days.map((d) => {
      return d.name === state.day ? newDay : d;
    });
    setState({
      ...state,
      days: newDays
    });
    return newDays;
  }

  //Book an interview. Update the state and make a put request. 
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const newState = {
      ...state,
      appointments
    };
    return axios.put(`/api/appointments/${id}`, {interview: interview})
      .then(() => {
        updateSpots(newState, id);
      });
  }

  //Cancel an interview. Update the state and make a delete request. 
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    const newState = {
      ...state,
      appointments
    };
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        updateSpots(newState, id);
      });
  }
  return {state, setDay, bookInterview, cancelInterview};
}