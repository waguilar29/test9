import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PdfPreviewer extends React.Component {
  state = {
    test: {},
    range: {
      'L TEST': 12,
      'TUG TEST': 15
    },

    references: {

      'L TEST': "Instructions:" + "\n" +  "https://www.spsco.com/media/wysiwyg/download/The%20L%20Test%20Instructions.pdf \n" + "\n" +
                "Video:" + "\n" + "https://www.youtube.com/watch?v=gixqOS8qBNA",
      'TUG TEST': "Instructions:" + "\n" +  "https://www.cdc.gov/steadi/pdf/tug_test-a.pdf \n" + "\n" +
                "Video:" + "\n" + "https://www.youtube.com/watch?v=VljdYRXMIE8",
      'PEQ TEST': "PEQ Scale Averages: http://www.archives-pmr.org/article/S0003-9993(98)90090-9/pdf"

    },

    natAverage: [

      {value: 71.6},
      {value: 72}

    ]





  }

  componentDidMount() {
    this.setState({
      test: this.props.test
    })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.test) {
      this.setState({
        test: nextProps.test
      })
    }
  }

  printDocument() {
    const {
      test
    } = this.state;
    const input = document.getElementById('pdf-content');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF("p", "mm", "a5");
        const width = pdf.internal.pageSize.width;
        const height = pdf.internal.pageSize.height;
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        pdf.save(`${test.id}_${test.category}.pdf`);
      })
    ;
  }



  render() {
    const { formValue, test } = this.props;
    const totalQuestions = (questions => questions.filter(question => question.value || question.value === 0).length);
    const averageScore = (questions) => {
      let sum = 0
      let answeredQuestions = questions.filter(question => question.value || question.value === 0);
      answeredQuestions.forEach(question => sum += question.value);
      return Math.ceil(sum/answeredQuestions.length)
    }

    const accessTime = (time, category) => {
      if (time < this.state.range[category]) {
        return (

          <span className="text-center"> The patient is not at risk of falling. </span>

        )
      }
      return (
        <span className="text-center"> The patient is at risk of falling. </span>
      )
    }

    const references = (category) => {

      return (

        <span className="text-center">{this.state.references[category]}</span>

      )


    }

    return (
      <div className="modal fade" id="pdfModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close btn btn-danger" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <div className="row">
                <div className="panel panel-default">
                  <div className="panel-heading clearfix">
                    <h4 className="pull-left">User Profile</h4>
                    <div className="btn-group pull-right">
                      <button onClick={this.printDocument.bind(this)} className="btn icon-btn btn-success">
                      <span className="glyphicon glyphicon-download"></span>  Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pdf-content" id="pdf-content">
                <div className="row">
                  <div id='pdf-logo' className="col-md-3 col-xs-12 col-sm-6 col-lg-3">
                    <img src="/images/aopa.png" alt="logo" />
                  </div>
                  <div className="col-md-9 col-xs-12 col-sm-6 col-lg-8" >
                    <div className="card pull-right">
                      <p><strong>Clinic: </strong> {this.props.profile.clinic}</p>
                      <p><strong>Clinician: </strong> {this.props.profile.fullname} </p>
                      <p><strong>Tested on: </strong> {test.date}</p>
                      <p><strong>Street Address: </strong> {this.props.profile.streetaddress} </p>
                      <p><strong>City: </strong> {this.props.profile.city} </p>
                      <p><strong>State: </strong> {this.props.profile.state} </p>
                      <p><strong>Zip Code: </strong> {this.props.profile.zip} </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <h3 className="text-center">Outcome Assessment Reporting System</h3>
                  <div className="col-md-12 col-xs-12 col-sm-6 col-lg-12" >
                    <div className="card">
                      <p><strong><u>Patient Information</u></strong></p>
                      <p><strong>ID: </strong> {formValue.id}</p>
                      <p><strong>Full Name: </strong> {formValue.fullname}</p>
                      <p><strong>Sex: </strong> {formValue.sex}</p>
                      <p><strong>Age: </strong> {formValue.age} years</p>
                      <p><strong>Race: </strong> {formValue.race}</p>
                      <p><strong>Weight: </strong> {formValue.weight} pounds</p>
                      <p><strong>Height: </strong> {formValue.height}</p>
                      <p><strong>Limb Level: </strong> {formValue.limbLev}</p>
                      <p><strong>K Level: </strong> {formValue.kLev}</p>
                      <p><strong>Cause of Limb Loss: </strong> {formValue.limbLost}</p>
                      <p><strong>Amputation Side: </strong> {formValue.ampSide}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card">
                    <div className="card">
                      <p><strong>Title: </strong> {test.title}</p>
                      <p><strong>Category: </strong> {test.category}</p>
                    </div>
                    {test.category !== 'PEQ TEST' ? <table className="table table-striped custab">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Metric</th>
                          <th>Value</th>
                          <th className="text-center">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td></td>
                          <td>Time</td>
                          <td>{test.time}</td>
                          <td className="text-center">{accessTime(test.time, test.category)}</td>
                        </tr>
                      </tbody>
                      </table> : <table className="table table-striped custab">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Category</th>
                          <th>No. of Questions</th>
                          <th className="text-center">Score</th>
                          <th className = "text-center">PEQ Scale Summary</th>

                        </tr>
                      </thead>

                      {Object.keys(test.questions).map((category, i) => <tr key={i}>
                          <td></td>
                          <td>{category}</td>
                          <td>{totalQuestions(test.questions[category])}</td>
                          <td className="text-center text-success">{averageScore(test.questions[category])}</td>
                          <td className="text-center text-success">{this.state.natAverage[i].value}</td>

                        </tr>)}
                    </table>}

                    <div className="card">
                      <u><strong>Comment</strong></u>
                      <p>{test.comment}</p>
                    </div>

                    <div className="card">
                      <u><strong>References</strong></u>
                      <div id = "references"><p>{references(test.category)}</p></div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PdfPreviewer;
