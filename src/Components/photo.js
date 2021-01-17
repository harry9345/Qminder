import React from "react";

import classes from "../App.module.css";

const Photos = (props) => {
  const photo = props.images.map((image) => {
    return <img src={image} className={classes.Photo} alt="" key={props.key} />;
  });
  return <div>{photo}</div>;
};
export default Photos;
