import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

//Using custom hook of useApplicationData to update and manage the state of the application.
export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();


  //Using helper functions to organize data for the Appointment component
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const appointment = dailyAppointments.map(appointment =>  {
    const interview = getInterview(state, appointment.interview);
    const dailyInterviewers = getInterviewersForDay(state, state.day);
    return (
      <Appointment key={appointment.id} {...appointment} interview={interview} interviewers={dailyInterviewers} bookInterview={bookInterview} cancelInterview={cancelInterview}/>
    );
  });

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
