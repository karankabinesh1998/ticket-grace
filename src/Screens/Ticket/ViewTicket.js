import React, { Component } from 'react';
import Datatable from '../../Components/Datatable/Datatable';
import Bridge from '../../Middleware/Bridge';
import swal from 'sweetalert';
import '../commonStyle.css';
import ModelWindow from '../../Components/Model';
import Loader from '../../Components/Loader/Loader';
import moment from 'moment';

export default class ViewTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketObject: {},
      workerObject: {},
      ticketsData: [],
      isLoading:false,
      editId: null,
      column: [
        {
          Header: "Store",
          accessor: "store",
          Cell: (d) => this.storeColumn(d),
        },
        {
          Header: "Department",
          accessor: "department",
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
          Header: "Assigned By",
          accessor: "assignedBy",
          Cell: (d) => <p> {d.original?.assignedBy?.firstName} {d.original?.assignedBy?.lastName} </p>
        },
        {
          Header: "CreatedBy",
          accessor: "createdBy",
          Cell: (d) => <p> {d.original?.createdBy?.firstName} {d.original?.createdBy?.lastName} </p>
        },
        {
          Header: "CreatedAt",
          accessor: "createdAt",
          Cell: (d) => <p>{moment(d.original?.createdAt).format("MMM Do YYYY")}</p>,
        },
        {
          Header: "Close ticket",
          accessor: "title",
          Cell: (d) => this.closeTicketButton(d)
        }
      ]
    }
  };

  closeTicketButton = (d) => {
    return (
      <center>
      <button
        type="button"
        className="btn btn-danger"
        data-toggle="modal"
        data-target="#closeTicket"
        onClick={() => this.viewTicketCloseModel(d)}
      >
        Close Ticket
      </button>
    </center>
    )
  };

  viewTicketCloseModel=async(d)=>{
    this.setState({ editId : d.original._id });
  }

  ticketViewButton=(d)=>{
    return(
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

  viewTicketModel=async(e)=>{
    this.setState({
      ticketObject:e.original,
      workerObject:e.original.assignedTo
    })
  }

  workerViewButton=(d)=>{
    return(
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

  closeTicket=async()=>{
    const{ closeDescription } = this.state;
      if(!closeDescription){
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
            await Bridge.closeAssignTicket({_id : this.state.editId , closeDescription : this.state.closeDescription },async result=>{

              if(result.status===200){
                await this.getTickets();
  
                this.setState({
                  closeDescription:'',
                  editId:null
                });
                swal("Tickets closed successfully")
                window.location.reload()
              }else{
                swal(result.message)
              }
            });
          }else{
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
      await this.getTickets();
      this.setState({ isLoading:false })
    } catch (error) {
      console.log(error);
    }
  };

  getTickets = async () => {
    try {
      await Bridge.getTicket(`?status=assigned`,result=>{

        if (result.status === 200) {
          this.setState({
            ticketsData: result.data
          })
        }else{
          swal(result.message)
        }
      });

    } catch (error) {
      console.log(error);
    }
  };

  handleChange=async(e)=>{ this.setState({ [e.target.name] : e.target.value }) }

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
                      // data-dismiss="modal"
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
                      <h3>View Ticket</h3>
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
