import React from "react";

import classes from "../App.module.css";

const Photos = (props) => {
  const photo = props.images.map((image, id) => {
    return (
      <img src={image} className={classes.Photo} alt={props.key} key={id} />
    );
  });
  return <div>{photo}</div>;
};
export default Photos;
