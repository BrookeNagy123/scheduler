import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

export default function DayListItem(props) {
  //Format the number of spots correctly based on the number of spots remaining
  const formatSpots = () => {
    if (props.spots === 0) {
      return  <h3>no spots remaining</h3>;
    } else if (props.spots === 1) {
      return <h3>{props.spots} spot remaining</h3>;
    } else {
      return <h3>{props.spots} spots remaining</h3>;
    }
  };

  const dayClass = classNames("day-list__item", {"day-list__item--selected ":props.selected, "day-list__item--full":props.spots === 0});
  return (
    <li data-testid="day" className={dayClass} onClick={() => props.setDay(props.name)} selected={props.selected} >
      <h2>{props.name}</h2>
      {formatSpots()}
    </li>
  );
}