import React from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link } from 'react-router';

class ViewRecords extends React.Component {
  state = {
    forms: [],
    isFound: 'loading',
    alert: null
  }
  componentWillMount() {
    if (this.props.forms) {
      let allForms = [];
      Object.keys(this.props.forms).forEach((id) => {
        allForms.push(this.props.forms[id])
      })
      if (allForms.length > 0) {
        this.setState({
          isFound: 'yes',
          forms: allForms
        })
      } else {
        this.setState({
          isFound: 'no'
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forms) {
        let allForms = [];
        Object.keys(nextProps.forms).forEach((id) => {
          allForms.push(nextProps.forms[id])
        })
        if (allForms.length > 0) {
          this.setState({
            isFound: 'yes',
            forms: allForms
          })
        } else {
          this.setState({
            isFound: 'no'
          })
        }
    }
  }

  onDelete (form) {
    const getAlert = (form) => (
      <SweetAlert
        warning
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Are you sure?"
        onConfirm={() => this.deleteForm(form)}
        onCancel={() => this.onCancelDelete()}
        >
        You will not be able to recover this report!
        </SweetAlert>
    );

    this.setState({
      alert: getAlert(form)
    });
  }

  deleteForm (form) {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref(`/forms/${userId}/${form.id}`).remove();
     this.setState({
        alert: null
      });
  }

  onCancelDelete () {
    this.setState({
      alert: null
    })
  }

	render() {
    const {
      forms,
      isFound
    } = this.state;
    const noofTests = (tests) => {
      let sum = 0;
      if(tests && Object.keys(tests).length > 0) {
        Object.keys(tests).forEach((category) => {
          sum += Object.keys(tests[category]).length;
        })
      }
      return sum;
    }
    const completedForm = forms.filter((form) => form.completed === 1);
		return (
			<div id="wrapper">
      {this.state.alert}
        {isFound === 'loading' && <div id="loader"></div>}
			    <div className="records col-md-9">
            <div className="panel panel-default list-group-panel">
                <div className="panel-body">
                    <ul className="list-group list-group-header">
                        <li className="list-group-item list-group-body">
                            <div className="row">
                                <div className="col-xs-6 text-left"><h4>Completed Reports</h4></div>
                                <div className="col-xs-3 col-xs-offset-3">
                                <Link to="/createform">
                                  <button className="btn icon-btn btn-success">
                                    <span className="glyphicon btn-glyphicon glyphicon-plus img-circle text-success"></span>
                                    Create a New Report
                                  </button>
                                </Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                    {isFound === 'no' && <div className="well"><h3>{"No completed reports."}</h3></div>}
                    {isFound === 'yes' && completedForm.length === 0 && <div className="well"><h3> {"No completed reports."}</h3></div>}
                    {forms && completedForm.length > 0 && <ul className="list-group list-group-body">
                    <div className="row">
                        <div className="col-xs-3 text-left" id="marginTop">
                            Patient
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          Created date
                        </div>
                        <div className="col-xs-3" id="marginTop">
                          No. of tests
                        </div>
                      </div>
                        {completedForm.map((form, i) => (
                          <li className="list-group-item" key={i}>
                            <div className="row" id="row">
                                <div className="col-xs-3 text-left" id="marginTop">
                                  <strong>
                                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                                    {form.fullname}
                                  </strong>
                                  <p id="form_id">ID: {form.id}</p>
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  {form.date}
                                </div>
                                <div className="col-xs-3" id="marginTop">
                                  <span id="test-no">{noofTests(form.tests)}</span>
                                </div>
                                <div className="col-xs-3">
                                  <Link to={'/test/' + form.id} className="btn icon-btn btn-primary video">
                                      <span className="glyphicon btn-glyphicon glyphicon-eye-open img-circle text-success"></span>
                                      View Report
                                      </Link>
                                  <a onClick={this.onDelete.bind(this, form)} className="btn icon-btn btn-danger">
                                      <span className="glyphicon btn-glyphicon glyphicon-trash img-circle text-danger"></span>
                                      Delete
                                  </a>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </div>
    </div>
		)
	}
}

export default connect(state  => ({
    forms: state.form.forms
}))(ViewRecords);
