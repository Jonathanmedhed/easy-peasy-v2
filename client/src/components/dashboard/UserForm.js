import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { updateUser } from "../../actions/dashboard";
import { setAlert } from "../../actions/alerts";
import { connect } from "react-redux";
import Alert from "../layout/Alert";
import axios from "axios";

const UserForm = ({ setAlert, updateUser, toggle, display, user, setList }) => {
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    email: "",
    email2: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        contactName: !user.contactName ? "" : user.contactName,
        companyName: !user.companyName ? "" : user.companyName,
        email: !user.email ? "" : user.email,
        email2: !user.email ? "" : user.email,
      });
    }
  }, []);

  const { contactName, companyName, email, email2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    //editUser(formData, history);
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ contactName, companyName, email });

    if (email !== email2) {
      setAlert("Emails do not match", "danger");
    } else {
      const res = await axios.post("/api/users/edit", formData, config);
      setList(res.data);
      setAlert("User edited", "success");
      toggle(!display);
    }
  };

  return (
    <Fragment>
      <form onSubmit={(e) => onSubmit(e)} class="form-sm bg-light">
        <div class="form-sm-header bg-primary">
          Edit Info{" "}
          <i
            onClick={() => toggle(!display)}
            className="fas fa-times-circle dialog"
          ></i>
        </div>
        <div class="form-sm-body">
          <div class="form-group">
            <input
              name="companyName"
              value={companyName}
              onChange={(e) => onChange(e)}
              type="text"
              placeholder="Company Name"
            ></input>
          </div>
          <div class="form-group">
            <input
              name="contactName"
              value={contactName}
              onChange={(e) => onChange(e)}
              type="text"
              placeholder="Contact Name"
            ></input>
          </div>
          <div class="form-group">
            <input
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              type="text"
              placeholder="Email"
            ></input>
          </div>
          <div class="form-group">
            <input
              name="email2"
              value={email2}
              onChange={(e) => onChange(e)}
              type="text"
              placeholder="Confirm Email"
            ></input>
          </div>
        </div>
        <Alert />
        <div class="form-sm-footer">
          <input type="submit" value="Edit" class="btn btn-primary"></input>
        </div>
      </form>
    </Fragment>
  );
};

UserForm.propTypes = {
  setAlert: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, updateUser })(UserForm);
