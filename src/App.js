import React from "react";
import { Link } from "react-router-dom";

export default class Profile extends React.Component {
  render() {
    return (
      <div>
        <h1>This is my profile</h1>
        <Link to="/">Go back to home</Link>
        <div>
          <img src="https://cdn.britannica.com/13/59613-050-D57A3D88/Vladimir-Ilich-Lenin-1918.jpg?w=400&h=300&c=crop"></img> 
        </div>
      </div>
    );
  }
}


