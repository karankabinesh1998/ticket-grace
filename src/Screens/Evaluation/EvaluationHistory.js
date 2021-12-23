import React, { Component } from 'react';
import Datatable from '../../Components/Datatable/Datatable';
import Bridge from '../../Middleware/Bridge';
import swal from 'sweetalert';
import '../commonStyle.css';
import moment from 'moment';
import ModelWindow from '../../Components/Model';
import Loader from '../../Components/Loader/Loader';
import { CSVLink, CSVDownload } from "react-csv";


export default class EvaluationHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketObject: {},
      workerObject: {},
      ticketsData: [],
      editId: null,
      csvData : [],
      column: [
        {
          Header: "Store",
          accessor: "id",
          Cell: (d) =><p>{d.original?.store?.name}</p>,
        },
        {
          Header: "Manager",
          accessor: "id",
          Cell: (d) =><p>{d.original?.manager?.firstName}</p>,
        },
        {
          Header: "Score",
          accessor: "scores",
          Cell:(d)=><p>{d.original?.scores ? this.evaluateScore(d.original?.scores) : 0 }</p>
         },
        {
          Header: "Evaluated By",
          accessor: "createdBy",
          Cell: (d) => <p>{d.original?.createdBy?.firstName}</p>
        },
         {
           Header:"UpdatedAt",
           accessor:"updatedAt",
           Cell:(d)=><p>{moment(d.original?.updatedAt).format("MMM Do YY, h:mm a")}</p>
         }
        // {
        //   Header: "Closed AT",
        //   accessor: "closeAt",
        //   Cell: (d) => <p>{moment(d.original.createdAt).format('MMM Do YY, h:mm a')}</p>
        // },
        // {
        //   Header: "Closed By",
        //   accessor: "closeBt",
        //   Cell: (d) => <p>{d.original?.closedBy?.firstName}</p>
        // },
        // {
        //   Header: "View Evaluation",
        //   accessor: "closeBy",
        //   Cell: (d) => this.evaluationButton(d)
        // }
      ]
    }
  };

  evaluateScore=(score)=>{
    let count = 0;
    for (const property in score) {
      count = count + score[property];
    };
    return <p>{count}</p>;
  }

  evaluationButton = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-success"
          data-toggle="modal"
          data-target="#evaluateTicket"
          onClick={() => this.viewEvaluateModel(d)}
        >
       View Remarks
        </button>
      </center>
    )
  };

  viewEvaluateModel=async(d)=>{
    // 
  }


  ticketViewButton = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#openTicket"
          onClick={() => this.viewTicketModel(d)}
        >
          {d.original.title}
        </button>
      </center>
    )
  };

  viewTicketModel = async (e) => {
    this.setState({
      ticketObject: e.original,
      workerObject: e.original.assignedTo
    })
  }

  workerViewButton = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#openWorker"
          onClick={() => this.viewTicketModel(d)}
        >
          {d.original?.assignedTo?.firstName}
        </button>
      </center>
    )
  };

  closeTicket = async () => {
    const { closeDescription } = this.state;
    if (!closeDescription) {
      swal("Please enter the description")
      return
    }
    try {

      swal({
        title: "Are you sure?",
        text: "Do you want to close this ticket??",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            const result = await Bridge.closeAssignTicket({ _id: this.state.editId });
            if (result.status === 200) {
              await this.getEvaluation();

              this.setState({
                closeDescription: '',
                editId: null
              });

              swal("Tickets close successfully")
            }
          } else {
            swal(" Cancelled ")
          }
        })

    } catch (error) {
      console.log(error);
    }
  }

  storeColumn = (d) => {
    return <p>{d.original.store.name}</p>
  }

  departmentColumn = (d) => {
    return <p>{d.original.department.name}</p>
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading:true })
      await this.getEvaluation();
      this.setState({ isLoading:false })
    } catch (error) {
      console.log(error);
    }
  };

  getEvaluation = async () => {
    try {
        await Bridge.getEvaluation(null,getEvaluation=>{

         if(getEvaluation.status===200){
           let csvData = [];
           getEvaluation.data.map((data)=>{
             let arr = [
               data?.store?.name,
               data?.manager?.firstName,
               Object.values(data?.scores)?.reduce?.((acc, a) => acc + a, 0),
               data?.createdBy?.firstName,
               moment(data?.updatedAt)?.format("MMM Do YY, h:mm a")
             ];
             csvData.push(arr);
           })
             this.setState({
               ticketsData: getEvaluation.data,
               csvData
             })
         }else{
           swal(getEvaluation.message)
         }
       });
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = async (e) => { this.setState({ [e.target.name]: e.target.value })};

  render() {
    const { workerObject, ticketObject } = this.state;
    return (
      <React.Fragment>
        {this.state.isLoading ? <Loader /> : null }
        <div class="main-content">

          <ModelWindow
            ButtonTitle={"Close Ticket"}
            ButtonName={"Close Ticket"}
            id="closeTicket"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
              <React.Fragment>
                <div className="row form-group">
                  <div className="col-sm-3">
                    <label class="labell2">Description</label>
                  </div>
                  <div className="col-sm-8">
                    <textarea type="text"
                      class="form-control"
                      placeholder="Enter the description"
                      onChange={this.handleChange}
                      value={this.state.closeDescription}
                      name="closeDescription"></textarea>
                  </div>
                </div>
                <div class="row form-group">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <button type="button"
                      style={{ width: '100%' }}
                      onClick={this.closeTicket}
                      class="btn btn-primary m-t-15 waves-effect">
                      {"Close Ticket"}
                    </button>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
              </React.Fragment>
            }
          />

          <ModelWindow
            ButtonTitle={"Worker Details"}
            ButtonName={"Worker Details"}
            id="openWorker"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
              <React.Fragment>
                <p>Name : {workerObject?.firstName} {workerObject?.lastName} </p>
                <p>Mobile : {workerObject?.phoneNumber} </p>
                <p>Email-id : {workerObject?.email}</p>
              </React.Fragment>
            }
          />
          <ModelWindow
            ButtonTitle={"Ticket Details"}
            ButtonName={"Ticket Media"}
            id="openTicket"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
              <React.Fragment>
                <p>Title : {ticketObject.title} </p>
                <p>Description : {ticketObject?.description == 'null' ? 'nil' : ticketObject?.description} </p>
                <p>Store : {ticketObject?.store?.name} </p>
                <p>Department : {ticketObject?.department?.name} </p>
                <p>Close-description : {ticketObject?.closeDescription}</p>
                <p>Image</p>

                <div className="row form-group">
                  {ticketObject?.image_1 ? <div className="col-sm-4">
                    <img src={ticketObject?.image_1} width={100} height={100} />
                  </div>
                    : null}
                  {ticketObject?.image_2 ? <div className="col-sm-4">
                    <img src={ticketObject?.image_2} width={100} height={100} />
                  </div>
                    : null}
                  {ticketObject?.image_3 ? <div className="col-sm-4">
                    <img src={ticketObject?.image_3} width={100} height={100} />
                  </div>
                    : null}
                </div>
                <p>voice</p>
                <div className="row form-group">
                  <div className="col-sm-4">
                    <audio src={ticketObject?.voiceNoteUrl} width={100} height={100} controls="controls" />
                  </div>
                </div>
              </React.Fragment>}
          />
          <section class="section">
            <div class="section-body">
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header">
                      <h3>Performance Evaluation History</h3>
                    </div>
                    <div class="card-body">
                    <CSVLink 
                    data={[["Store", "Manager", "Score","Evaluated By","Updated At"],...this.state.csvData]}
                    className="btn btn-primary"
                    filename={`grace-perf-${moment().format("YYYYMMDDhhmmss")}.csv`}
                    >Download Report</CSVLink>
                    <br/>
                    <br/>
                      <div className="row form-group">
                        <div className="col-sm-12">
                          {this.state.ticketsData.length ? (
                            <Datatable
                              data={this.state.ticketsData}
                              columnHeading={this.state.column}
                            />
                          ) : null}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </React.Fragment>
    )
  }
}
