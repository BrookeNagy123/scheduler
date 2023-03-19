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

  function updateSpots(state, id){
    //Find the day object
    const currentDay = state.days.find((d) => d.appointments.includes(id) )
    //Count all the null appointments
    const nullAppointments = currentDay.appointments.filter((id) => !state.appointments[id].interview)
    const spots = nullAppointments.length
    const newDay = {...currentDay, spots}
    const newDays = state.days.map((d) => {
      return d.name === state.day ? newDay : d 
    })
    setState({
      ...state, 
      days: newDays
    })
    return newDays
  }

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
    }
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {interview: interview})
      .then(() => {
        updateSpots(newState, id)
        // setState({
        //   ...state,
        //    appointments
        // });
      })
  }

  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
       interview: null
      }
     const appointments = {
       ...state.appointments,
         [id]: appointment
       };
       const newState = {
        ...state,
        appointments 
       }
     return axios.delete(`http://localhost:8001/api/appointments/${id}`)
       .then(() => {
         updateSpots(newState, id)
       })
   }
  return {state, setDay, bookInterview, cancelInterview};
}