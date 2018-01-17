import React from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import Test from '../shared/Test'

class Tests extends React.Component {
    state = {
      isFound: 'loading',
      formValue: {}
    }
    componentWillMount() {
      if (this.props.forms && this.props.forms[this.props.routeParams.id]) {
        this.setState({
          isFound: 'yes',
          formValue: this.props.forms[this.props.routeParams.id]
        })
      }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.forms) {
            if (nextProps.forms[this.props.routeParams.id]) {
                this.setState({
                  isFound: 'yes',
                  formValue: nextProps.forms[this.props.routeParams.id]
                })
            } else {
              this.setState({
                isFound: 'no'
              })
            }
        }
    }
	render() {
    const {
      isFound,
      formValue
    } = this.state;
		return (
        <div>
          {isFound === 'loading' && <div id="loader"></div>}
          {isFound === 'yes' && <div className="container">
          <div className="row">
              <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-0 col-lg-offset-0 toppad" >
              {isFound === 'no' && <div className="well"> <h1> Test with specified ID was not found </h1> </div>}
              <div className={formValue.completed === 1 ? 'panel panel-success' : 'panel panel-info'}>
                  <div className="panel-heading">
                  <h3 className="panel-title">Patient Information</h3>
                  </div>
                  <div className="panel-body">
                  <div className="row">
                      <div className=" col-md-12 col-lg-12 ">
                      <table className="table table-user-information">
                          <tbody>
                          <tr>
                              <td>Full Name:</td>
                              <td>{formValue.fullname}</td>
                          </tr>
                          <tr>
                              <td>ID:</td>
                              <td>{formValue.id}</td>
                          </tr>
                          <tr>
                              <td>Age</td>
                              <td>{formValue.age} Years</td>
                          </tr>
                          <tr>
                              <td>Height</td>
                              <td>{formValue.height}</td>
                          </tr>
                          <tr>
                              <td>Weight</td>
                              <td>{formValue.weight} Pounds</td>
                          </tr>
                          <tr>
                              <td>Sex</td>
                              <td>{formValue.sex}</td>
                          </tr>
                          <tr>
                              <td>Race</td>
                              <td>{formValue.race}</td>
                          </tr>
                          <tr>
                              <td>Limb Loss Level</td>
                              <td>{formValue.limbLev}</td>
                          </tr>
                          <tr>
                              <td>Amputation Side</td>
                              <td>{formValue.ampSide}</td>
                          </tr>
                          <tr>
                              <td>Cause of limb loss</td>
                              <td>{formValue.limbLost}</td>
                          </tr>

                          </tbody>
                      </table>
                      <Test questions={this.props.questions} formValue={formValue} profile={this.props.profile} />
                      </div>
                  </div>
                  </div>
              </div>
              </div>
          </div>
          </div>}
        </div>)
	}
}

export default connect(state=>({
    user: state.auth.user,
    profile: state.auth.profile,
    forms: state.form.forms,
    questions: state.form.questions
}))(Tests);
