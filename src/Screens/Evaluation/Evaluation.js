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
      storeObject: {},
      storeManagerObject: {},
      ticketsData: [],
      evaluateTicketId: null,
      editId: null,
      currentRating: 0,
      isLoading: false,
      OptionsList: [
        { label: 'Good', value: 2 },
        { label: 'Fair', value: 1 },
        { label: 'Not Satisfactory', value: 0 },
      ],
      scoreObject: {
        customer_service: null,
        merchandising_product_display: null,
        stock_check: null,
        store_maintainance: null,
        employee_management: null,
        downline_development: null
      },
      submitButtonStatus:true,
      column: [
        {
          Header: "Store",
          accessor: "store",
          Cell: (d) => this.storeViewButton(d),
        },
        {
          Header: "Manager Name",
          accessor: "firstName",
          Cell: (d) => this.storeManagerViewButton(d)
        },
        // {
        //   Header: "Created At",
        //   accessor: "createdAt",
        //   Cell: (d) => <p>{moment(d.original?.store?.createdAt).format('MMM Do YY, h:mm a')}</p>
        // },
        // {
        //   Header: "Created By",
        //   accessor: "createdBy",
        //   Cell: (d) => <p>{d.original?.store?.createdBy}</p>
        // },
        {
          Header: "Evaluation",
          accessor: "closeBy",
          Cell: (d) => this.evaluationButton(d)
        }
      ],
      roles: []
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

  viewEvaluateModel = async (d) => {
    this.setState({
      evaluateTicketId: d.original?.store?._id
    })
  };


  EvaluatedTicket = async () => {
    const { evaluateTicketId, scoreObject } = this.state;
    try {
      let formdata = {};
      formdata.scores = scoreObject;
      formdata.store = evaluateTicketId;
      await Bridge.postEvaluation(formdata, async result => {
        if (result.status === 200) {
          this.setState({
            evaluateTicketId: null,
          });
          swal("successfully evaluated the store")
          await this.getEvaluationSore();
          window.location.href="/performance-evaluation-history";
        } else {
          swal(result.message);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


  storeViewButton = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#openStore"
          onClick={() => this.viewTicketModel(d)}
        >
          {d.original?.store?.name}
        </button>
      </center>
    )
  };

  viewTicketModel = async (e) => {
    this.setState({
      storeObject: e.original?.store,
      storeManagerObject: e.original
    })
  };

  storeManagerViewButton = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#openStoreManager"
          onClick={() => this.viewTicketModel(d)}
        >
          {d.original?.firstName}
        </button>
      </center>
    )
  };



  storeColumn = (d) => {
    return <p>{d.original?.store?.name}</p>
  }

  departmentColumn = (d) => {
    return <p>{d.original.department.name}</p>
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading: true })
      await this.getEvaluationSore();
      this.setState({ isLoading: false })
    } catch (error) {
      console.log(error);
    }
  };

  getEvaluationSore = async () => {
    try {
      await Bridge.getUserRole(rolesData => {

        if (rolesData.status === 200) {
          let roles = [];
          rolesData.data.map(item => {
            if (item.name == 'store_manager') {
              roles.push(item._id);
            }
            this.setState({
              roles
            })
          })
        } else {
          swal(rolesData.message);
        }
      });

      await Bridge.getUserData(`?role=${this.state.roles[0]}`, result => {

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

  ratingChanged = async (e) => { this.setState({ currentRating: e }) };

  handleChangeRadio = async (name, e) => {
    const storedata = { ...this.state.scoreObject };
    storedata[name] = e;
    let count = 0;
    for (const property in storedata) {
      if(storedata[property] !== null ){
          count = count + 1;
          if(count == 6){
            this.setState({
              submitButtonStatus : false
            })
          }
      }
    }
    this.setState({
      scoreObject: storedata
    });
  }

  render() {
    const { storeManagerObject, storeObject, scoreObject } = this.state;
    return (
      <React.Fragment>
        {this.state.isLoading ? <Loader /> : null}
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
                      name={"customer_service"}
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
                      name={"merchandising_product_display"}
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
                      name={"stock_check"}
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
                      name={"store_maintainance"}
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
                      name={"employee_management"}
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
                      name={"downline_development"}
                    />
                  </div>
                </div>
                <div class="row form-group">
                  <div className="col-sm-4"></div>
                  <div className="col-sm-4">
                    <button type="button"
                      style={{ width: '100%' }}
                      onClick={this.EvaluatedTicket}
                      disabled={this.state.submitButtonStatus}
                      class={this.state.submitButtonStatus ? "btn btn-secondary m-t-15 waves-effect" : "btn btn-success m-t-15 waves-effect"}>
                      {"Submit"}
                    </button>
                  </div>
                  <div className="col-sm-4"></div>
                </div>
              </React.Fragment>
            }
          />

          <ModelWindow
            ButtonTitle={"Store Manager Details"}
            id="openStoreManager"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
              <React.Fragment>
                <p>Name : {storeManagerObject?.firstName} {storeManagerObject?.lastName} </p>
                <p>Mobile : {storeManagerObject?.phoneNumber} </p>
                <p>Email-id : {storeManagerObject?.email}</p>
              </React.Fragment>
            }
          />
          <ModelWindow
            ButtonTitle={"Store Details"}
            id="openStore"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
              <React.Fragment>
                <p>Store Name : {storeObject?.name} </p>
                <p>Address : {storeObject?.address == 'null' ? 'nil' : storeObject?.address} </p>
                <p>Created At  : {moment(storeObject?.store?.createdAt).format("MMM Do YYYY")} </p>
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
