import React, { Component } from 'react';
import Datatable from '../../Components/Datatable/Datatable';
import Bridge from '../../Middleware/Bridge';
import swal from 'sweetalert';
import RadioButtonComponent from '../../Components/InputComponent/RadioButtonInput';
import './evaluation.css';
import moment from 'moment';
import ModelWindow from '../../Components/Model';
import $ from "jquery";
import Loader from '../../Components/Loader/Loader';




export default class Evaluation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketObject: {},
      workerObject: {},
      ticketsData: [],
      evaluateTicketId:null,
      editId: null,
      currentRating:0,
      isLoading:false,
      OptionsList: [
        { label: 'Good', value: 2 },
        { label: 'Fair', value: 1 },
        { label: 'Not Satisfactory', value: 0 },
      ],
      scoreObject:{
        customer_service : null,
        merchandising_product_display:null,
        stock_check : null,
        store_maintainance :null,
        employee_management:null,
        downline_development:null  
      },
      column: [
        {
          Header: "Store",
          accessor: "store",
          Cell: (d) => this.storeColumn(d),
        },
        {
          Header: "Department",
          accessor: "department.name",
          Cell: (d) => this.departmentColumn(d),
        },
        {
          Header: "Ticket",
          accessor: "title",
          Cell: (d) => this.ticketViewButton(d)
        },
        {
          Header: "Assigned To",
          accessor: "title",
          Cell: (d) => this.workerViewButton(d)
        },
        {
          Header: "Closed AT",
          accessor: "closeAt",
          Cell: (d) => <p>{moment(d.original.createdAt).format('MMM Do YY, h:mm a')}</p>
        },
        {
          Header: "Closed By",
          accessor: "closeBt",
          Cell: (d) => <p>{d.original?.closedBy?.firstName}</p>
        },
        {
          Header: "Evaluation",
          accessor: "closeBy",
          Cell: (d) => this.evaluationButton(d)
        }
      ]
    }
  };

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
        Remarks
        </button>
      </center>
    )
  };

  viewEvaluateModel=async(d)=>{
    this.setState({
      evaluateTicketId : d.original._id
    })
  };


  EvaluatedTicket=async()=>{
    const { evaluateTicketId , scoreObject } = this.state;
    try {
      let formdata ={};
      formdata.scores = scoreObject;
      formdata.ticketId =evaluateTicketId;
      const result = await Bridge.postEvaluation(formdata,async result=>{

        if(result.status===200){
          this.setState({
            evaluateTicketId : null,
          });
          await this.getTickets();
          swal("successfully rated the ticket")
          window.location.reload();
        }else{
          swal(result.message);
          window.location.reload();
        }
      });
    } catch (error) {
      console.log(error);
    }

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



  storeColumn = (d) => {
    return <p>{d.original.store.name}</p>
  }

  departmentColumn = (d) => {
    return <p>{d.original.department.name}</p>
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading:true })
      await this.getTickets();
      this.setState({ isLoading:false })
    } catch (error) {
      console.log(error);
    }
  };

  getTickets = async () => {
    try {
      const result = await Bridge.getTicket(`?status=close&isEvaluated=false`, result => {

        if (result.status === 200) {
          this.setState({
            ticketsData: result.data
          })
        } else {
          swal(result.message)
        }
      });

    } catch (error) {
      console.log(error);
    }
  };

  handleChange = async (e) => { this.setState({ [e.target.name]: e.target.value }) };

  ratingChanged=async(e)=>{ this.setState({ currentRating : e }) };

  handleChangeRadio = async (name, e) => {
    const storedata = { ...this.state.scoreObject };
    storedata[name] = e;
    this.setState({
      scoreObject: storedata
    });

  }

  render() {
    const { workerObject, ticketObject  , scoreObject } = this.state;
    return (
      <React.Fragment>
        {this.state.isLoading ? <Loader /> : null }
        <div class="main-content">
          <ModelWindow
            ButtonTitle={"Evaluate Ticket"}
            ButtonName={"Close Ticket"}
            id="evaluateTicket"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
            <React.Fragment>
                <div className="row form-group">
                   <div className="col-sm-4">
                    <label class="labelRating">Customer Service*</label>
                  </div>
                  <div className="col-sm-8">
                    <RadioButtonComponent
                      OptionsList={this.state.OptionsList}
                      handleChangeRadio={this.handleChangeRadio} 
                      name ={"customer_service"}
                      />
                  </div>
                </div>
                <div className="row form-group">
                   <div className="col-sm-4">
                    <label class="labelRating">Merchandising-product display*</label>
                  </div>
                  <div className="col-sm-8">
                    <RadioButtonComponent
                      OptionsList={this.state.OptionsList}
                      handleChangeRadio={this.handleChangeRadio} 
                      name ={"merchandising_product_display"}
                      />
                  </div>
                </div>
                <div className="row form-group">
                   <div className="col-sm-4">
                    <label class="labelRating">Stock Check*</label>
                  </div>
                  <div className="col-sm-8">
                    <RadioButtonComponent
                      OptionsList={this.state.OptionsList}
                      handleChangeRadio={this.handleChangeRadio} 
                      name ={"stock_check"}
                      />
                  </div>
                </div>
                <div className="row form-group">
                   <div className="col-sm-4">
                    <label class="labelRating">Store Maintainance*</label>
                  </div>
                  <div className="col-sm-8">
                    <RadioButtonComponent
                      OptionsList={this.state.OptionsList}
                      handleChangeRadio={this.handleChangeRadio} 
                      name ={"store_maintainance"}
                      />
                  </div>
                </div>
                <div className="row form-group">
                   <div className="col-sm-4">
                    <label class="labelRating">Employee Management*</label>
                  </div>
                  <div className="col-sm-8">
                    <RadioButtonComponent
                      OptionsList={this.state.OptionsList}
                      handleChangeRadio={this.handleChangeRadio} 
                      name ={"employee_management"}
                      />
                  </div>
                </div>
                <div className="row form-group">
                   <div className="col-sm-4">
                    <label class="labelRating">Downline Development*</label>
                  </div>
                  <div className="col-sm-8">
                    <RadioButtonComponent
                      OptionsList={this.state.OptionsList}
                      handleChangeRadio={this.handleChangeRadio} 
                      name ={"downline_development"}
                      />
                  </div>
                </div>
                <div class="row form-group">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <button type="button"
                      style={{ width: '100%' }}
                      onClick={this.EvaluatedTicket}
                      class="btn btn-success m-t-15 waves-effect">
                      {"Submit"}
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
                      <h3>Performance Evaluation</h3>
                    </div>
                    <div class="card-body">
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
