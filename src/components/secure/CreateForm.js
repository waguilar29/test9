import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import firebase, { Promise } from 'firebase';
import { push } from 'react-router-redux';
import { resetNext } from '../../actions/auth';


class CreateForm extends React.Component {
  state =  {
    id: '',
    fullname: '',
    sex: '',
    age: '',
    race: '',
    weight: '',
    feet: '',
    inch: '',
    limbLev: '',
    kLev: '',
    ampSide: '',
    limbLost: '',
    loading: false,
    allRace: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic', 'White', 'Other'],
    kLevel: ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4'],
    amputationSide: ['Right side of body', 'Left side of body', 'Bilateral', 'Trilateral', 'Quadrilateral'],
    limbLoss: ['Cancer', 'Congenital Condition', 'Diabetes-related Complications', 'Vascular Disease', 'Infection', 'Traumatic Incident', 'Unknown'],
    limbLevel: ['Partial Foot', 'Ankle Disarticulation', 'Transtibial', 'Knee Disarticulation', 'Transfemoral', 'Hip Disarticulation', 'Hemipelvectomy'],
    sexSelect: ['Male', 'Female']

  }
  /*
	* Handles Form Submission
	*/
  handleSubmit(event) {
    this.setState({
      loading: true
    })
    event.preventDefault();
    const postData = {
      id: this.state.id,
      fullname: this.state.fullname,
      sex: this.state.sex,
      age: this.state.age,
      race: this.state.race,
      limbLev: this.state.limbLev,
      limbLost: this.state.limbLost,
      kLev: this.state.kLev,
      ampSide: this.state.ampSide,
      weight: this.state.weight,
      height: `${this.state.feet}ft/${this.state.inch}inch`,
      completed: 0,
      date: moment().format('MMMM Do YYYY, h:mm:ss a')
    }
    const userId = firebase.auth().currentUser.uid;
    let updates = {};
    updates[`/forms/${userId}/${postData['id']}`] = postData;
    firebase.database().ref().update(updates)
      .then(() => this.setState({
        loading: false
      }, () => {
        this.props.onRedirect(`/test/${postData['id']}`);
        this.props.onResetNext();
      }))
    .catch((error) => {
      this.setState({ error: error.message });
    });
  }
  selectRace (race) {
    this.setState({
      race
    })
  }

  selectLimbLev (limbLev) {
    this.setState({
      limbLev
    })
  }

  selectAmpSide (ampSide) {
    this.setState({
      ampSide
    })
  }

  selectLimbLoss (limbLost) {
    this.setState({
      limbLost
    })
  }

  selectKLevel (kLev) {
    this.setState({
      kLev
    })
  }

  selectSex (sex) {

    this.setState({

      sex

    })

  }
  /*
	* Validates Form before Submission
	*/
  validateForm = (data) => {
    const newFormKey = firebase.database().ref().child('forms').push().key;
    return new Promise((resolve, reject) => {
      resolve(newFormKey);
    })
  }
  /*
	* Handles Input Changes
	*/
	onInputChange(name, event) {
    var change = {};
		change[name] = event.target.value;
		this.setState(change);
	}

	render() {
    const { id, sex, age, race, limbLev, limbLost, kLev, ampSide,
      weight, feet, inch} = this.state;
    const isEnabled =
      id.length > 0 && sex.length > 0 && age.length > 0 && race.length > 0 && weight.length > 0 && feet.length > 0 && inch.length > 0
      && limbLev.length > 0 && limbLost.length > 0 && kLev.length > 0 && ampSide.length > 0;
		return (
			<div id="wrapper">
        <br />
				<div className="containerForm">
          <div className="panel-heading well">  <h4 >Patient Information</h4></div>
          <div className="col-lg-12 well">
              <div className="row">
              <form onSubmit={this.handleSubmit.bind(this)} >
                  <div className="col-sm-12">
                  <div className="row">
                      <div className="col-sm-12 form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter Full Name Here.."
                        className="form-control"
                        value={this.state.fullname}
                        onChange={this.onInputChange.bind(this, 'fullname')}
                      />
                      </div>
                  </div>

                  <div className="row">
                      <div className="col-sm-12 form-group">
                      <label>Patient ID</label>
                      <input
                        type="text"
                        placeholder="Enter ID Here.."
                        className="form-control"
                        value={this.state.id}
                        onChange={this.onInputChange.bind(this, 'id')}
                      />
                      </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 form-group">
                      <label>Age</label>
                      <div className="input-group">
                        <input
                          type="number"
                          placeholder="Enter Age Here.."
                          className="form-control"
                          value={this.state.age}
                          aria-describedby="age"
                          onChange={this.onInputChange.bind(this, 'age')}
                        />
                        <span
                          className="input-group-addon"
                          id="age">years</span>
                      </div>
                    </div>
                  </div>
                  <label>Height</label>
                  <div className="row">
                    <div className="col-md-6">
                      <input
                        type="number"
                        placeholder="Feet.."
                        className="form-control"
                        value={this.state.feet}
                        onChange={this.onInputChange.bind(this, 'feet')}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        placeholder="Inch.."
                        className="form-control"
                        value={this.state.inch}
                        onChange={this.onInputChange.bind(this, 'inch')}
                      />
                    </div>
                  </div>
                  <br />
                  <div className = "row">
                    <div className="col-md-6 form-group">
                      <label>Weight</label>
                      <div className="col-md-6 input-group">
                        <input
                          type="number"
                          placeholder="Enter Weight Here.."
                          className="form-control"
                          value={this.state.weight}
                          onChange={this.onInputChange.bind(this, 'weight')}
                        />
                        <span
                          className="input-group-addon"
                          id="age">pounds</span>
                      </div>
                    </div>
                  </div>

                  <div className="row">

                      <div className="col-sm-2 form-group">
                        <label>Sex</label>
                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.sex || 'Select a Sex'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.sexSelect.map((sex, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectSex.bind(this, sex)}> {sex} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>

                      <div className="col-sm-5 form-group">

                      </div>
                  </div>

                  <div className="row">

                      <div className="col-sm-2 form-group">
                        <label>Race</label>
                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.race || 'Select a Race'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.allRace.map((race, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectRace.bind(this, race)}> {race} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>

                      <div className="col-sm-5 form-group">

                      </div>
                  </div>

                  <div className="row">

                      <div className="col-sm-2 form-group">
                        <label>Limb Loss Level</label>
                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.limbLev || 'Select limb loss level'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.limbLevel.map((limbLev, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectLimbLev.bind(this, limbLev)}> {limbLev} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>

                      <div className="col-sm-5 form-group">

                      </div>
                  </div>

                  <div className="row">

                      <div className="col-sm-2 form-group">
                        <label>Amputation Side</label>
                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.ampSide || 'Select amputation side'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.amputationSide.map((ampSide, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectAmpSide.bind(this, ampSide)}> {ampSide} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>

                      <div className="col-sm-5 form-group">

                      </div>
                  </div>

                  <div className="row">

                      <div className="col-sm-2 form-group">
                        <label>Cause of limb loss</label>
                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.limbLost || 'Select cause'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.limbLoss.map((limbLost, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectLimbLoss.bind(this, limbLost)}> {limbLost} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>

                      <div className="col-sm-5 form-group">

                      </div>
                  </div>

                  <div className="row">

                      <div className="col-sm-2 form-group">
                        <label>K Level</label> <label data-toggle = "tooltip" title = "hello this is a test for a tool this. hover over to see me on k levels blablablablblablablablablabalbablbalabalbl" id = "hover">More Info</label>


                        <div className="form-group form-group">
                            <div className="form-group-btn">
                                <button
                                  type="button"
                                  className="col-xs-12 btn btn-default text-left"
                                  data-toggle="dropdown">
                                    {this.state.kLev || 'Select K Level'}  <span className="caret"></span>
                                </button>
                                <ul className="dropdown-menu pull-right col-xs-12" role="menu">
                                    {this.state.kLevel.map((kLev, i) =>
                                    <li key={i}>
                                      <a onClick={this.selectKLevel.bind(this, kLev)}> {kLev} </a>
                                    </li>)}
                                </ul>
                            </div>
                            </div>
                      </div>

                      <div className="col-sm-5 form-group">

                      </div>
                  </div>



                  <hr />

                  {this.state.loading && <div className="loader"></div>}
                  {!isEnabled && <div className="col-xs-6 alert alert-danger">All fields are required</div>}
                  <button disabled={!isEnabled} type="submit" className="btn btn btn-info pull-right">Continue</button>
                  </div>
              </form>
              </div>
          </div>
          </div>
			</div>
		)
	}
}

export default connect(null, dispatch => ({
	onRedirect: (path) => {
		dispatch(push(path));
	},
	onResetNext: () => {
		dispatch(resetNext());
	},
}))(CreateForm);
