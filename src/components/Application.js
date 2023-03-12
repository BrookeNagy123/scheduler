import React, { useState, useEffect } from "react";
import axios from 'axios';
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

export default function Application(props) {
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


  const setDay = day => setState({ ...state, day })
  const dailyInterviews = getInterviewersForDay(state, state.day)
  const dailyAppointments = getAppointmentsForDay(state, state.day)
  const appointment = dailyAppointments.map(appointment =>  {
    const interview = getInterview(state, appointment.interview);
    const dailyInterviewers = getInterviewersForDay(state, state.day)
    return (
    <Appointment key={appointment.id} {...appointment} interview={interview} interviewers={dailyInterviewers} bookInterview={bookInterview} cancelInterview={cancelInterview}/>
)
})


  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu"><DayList
      days={state.days}
      value={state.day}
      onChange={setDay}
      /></nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
       {appointment}
       <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
