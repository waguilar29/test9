import React from 'react';
import * as firebase from 'firebase';
import { connect } from 'react-redux';


class Register extends React.Component {
	state = {
		email: '',
		fullname: '',
		hospitalid: '',
		password: '',
    error: null,
    isLoading: false
  };
  
  /*
	* Handles Form Submission
	*/
	handleSubmit(event) {
		event.preventDefault();
		this.setState({
			isLoading: true,
			error: ''
    })
    const {
      email,
      fullname,
      hospitalid,
      password
    } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const userId = user.uid;
        const usersRef =  firebase.database().ref().child(`users/${userId}`);
        if (userId) {
          user.updateProfile({
            displayName: fullname,
          }).then(() => {
            usersRef.set({
              email,
              fullname,
              hospitalid,
              password,
            }, (error) => {
              if (error) {
                this.setState({
                  isLoading: false,
                  error: error.message
                })
              }
            });
          }, (error) => {
            if (error) {
              this.setState({
                isLoading: false,
                error: error.message
              })
            }
          });
        }
        this.setState({
          isLoading: false,
          error: ''
        })
      })
			.catch((error) => {
				this.setState({ error: error.message, isLoading: false });
			});
	}
  /*
	* Handles Form Inputs Change
	*/
	onInputChange(name, event) {
		var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}

	render() {
		var errors = this.state.error ? <p> {this.state.error} </p> : '';
		return (
			<form onSubmit={this.handleSubmit.bind(this)} id="register-form" action="#" method="post" role="form">
				{errors && <div className="alert alert-danger">{errors}</div>}
                <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  tabIndex="1"
                  className="form-control"
                  placeholder="Full Name"
                  value={this.state.fullname}
                  onChange={this.onInputChange.bind(this, 'fullname')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  tabIndex="1"
                  className="form-control"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={this.onInputChange.bind(this, 'email')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  tabIndex="2"
                  className="form-control"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputChange.bind(this, 'password')}
                />
              </div>
              <div className="form-group">
                <label htmlFor="hospital-id">Clinician ID</label>
                <input
                  type="password"
                  name="hospital-id"
                  id="hospital-id"
                  tabIndex="2"
                  className="form-control"
                  placeholder="Clinician ID"
                  value={this.state.hospitalid}
                  onChange={this.onInputChange.bind(this, 'hospitalid')}
                />
              </div>
			  <br/>
              <div className="form-group">
                <div className="row">
                <div className="col-sm-6 col-sm-offset-3">
                  <input
                    type="submit"
                    name="register-submit"
                    id="register-submit"
                    tabIndex="4"
                    className="form-control btn btn-register"
                    value="Register Now"
                  />
                </div>
                </div>
              </div>
			</form>
		);
	}
}

export default connect()(Register);