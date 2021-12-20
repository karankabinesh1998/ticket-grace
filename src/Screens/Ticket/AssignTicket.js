import React, { Component } from 'react';
import Bridge from '../../Middleware/Bridge';
import Datatable from "../../Components/Datatable/Datatable";
import swal from 'sweetalert';
import '../commonStyle.css';
import SingleSelect from '../../Components/InputComponent/SingleSelect';
import ModelWindow from '../../Components/Model';
import Loader from '../../Components/Loader/Loader';

export default class AssignTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketsData:[],
      ticketButtonState:true,
      ticketList:[],
      workerList:[],
      selectedStore:{},
      isLoading:false,
      storeList:[],
      selectedticket:{},
      selectedWorker:{},
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
          Header: "Cancel Assign",
          accessor: "title",
          Cell: (d) => this.CancelAssignButton(d)
        }
      ],
      ticketObject: {},
      workerObject:{}
    }
  };

  storeColumn = (d) => {
    return <p>{d.original.store.name}</p>
  }

  departmentColumn = (d) => {
    return <p>{d.original.department.name}</p>
  }

  CancelAssignButton=(d)=>{
    return(
      <center>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => this.cancelAssignTicket(d)}
      >
        Cancel Assign
      </button>
    </center>
    )
  };

  cancelAssignTicket = async (d) => {
    try {
      swal({
        title: "Are you sure?",
        text: "Do you want to cancel this ticket to worker?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            await Bridge.cancelAssignTicket({ _id: d.original._id },async result=>{
              if (result.status == 200) {
                await this.getStoreList();
                await this.getTicketData();
                swal("Ticket cancelled successfully")
              }else{
                swal(result.message)
              }

            });
          } else {
            swal("Cancel failed!!")
          }
        })
    } catch (error) {
      console.log(error);
    }
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
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading:true });
      await this.getStoreList();
      await this.getTicketData()
      this.setState({ isLoading:false })
    } catch (error) {
      console.log(error);
    }
  };

  getStoreList = async () => {
    try {
      await Bridge.getStores(store => {
        if (store.status === 200) {
          if (store.data.length) {
            let storeList = []
            store.data.map((store) => {
              storeList.push({ value: store._id, label: store.name })
            });

            this.setState({
              storeList
            })
          }
        } else {
          swal(store.message)
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  getTicketData = async()=>{
    try {
      await Bridge.getTicket(`?status=assigned`,ticketAssigned=>{

        if(ticketAssigned.status===200){
          console.log(ticketAssigned,'tts')
          this.setState({
            ticketsData : ticketAssigned.data
          })
        }else{
          swal(ticketAssigned.message)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  getTicketList = async (storeId) => {
    try {
      let ticketList = [];
      await Bridge.getTicket(`?status=open&store=${storeId}`,async ticketOpened=>{

        if (ticketOpened.status === 200) {
          if (ticketOpened.data.length) {
            ticketOpened.data.map(ticket => {
              ticketList.push({ value: ticket._id, label: ticket.title });
            })
          }
          this.setState({
            ticketList
          })
        }else{
          swal(ticketOpened.message)
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  getWorkerList = async (store,ticket) => {
    try {
      await Bridge.getWorker(`?store=${store.value}&ticket=${ticket.value}`,worker=>{

        if (worker.status === 200) {
          let workerList = [];
          if (worker.data.length) {
            worker.data.map(worker => {
              workerList.push({ label: `${worker?.firstName} ${worker?.lastName}`, value: worker._id })
            });
            this.setState({
              workerList
            })
          }else{
            swal("No workers found on this store or department")
          }
        }else{
          swal(worker.message)
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleWorkerList = async (e) => { this.setState({ selectedWorker: e })  };

  handleTicketList = async (e) => {
     this.setState({ selectedticket: e , selectedWorker:{} })
     if(Object.keys(this.state.selectedStore).length>0){
      await this.getWorkerList(this.state.selectedStore,e);
    }
    };

  handleStoreList = async (e) => { 
    this.setState({ selectedStore: e , selectedWorker:{} });
    await this.getTicketList(e.value);
    // if(Object.keys(this.state.selectedticket).length>0){
    //    await this.getWorkerList(e,this.state.selectedticket);
    // }
  };

  assignTicketToWorker=async()=>{
    const { selectedticket , selectedWorker , selectedStore } = this.state;

    if(Object.keys(selectedStore).length===0){
      swal("Please select the store");
      return
    }

    if(Object.keys(selectedticket).length===0){
      swal("Please select the ticket");
      return
    }

    if(Object.keys(selectedWorker).length===0){
      swal("Please select the worker");
      return
    }

    try {
      let formdata = {};
      formdata._id = selectedticket.value;
      formdata.workerId = selectedWorker.value;
      swal({
        title: "Are you sure?",
        text: "Do you want to assign this task?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {
          if (willDelete) {
            const result = await Bridge.assignTicket(formdata,async result=>{
                this.setState({
                  isLoading:true
                })
              if (result.status === 200) {
                console.log(result);
                this.setState({
                  selectedticket: {},
                  selectedWorker: {},
                  selectedStore:{}
                });
                await this.getStoreList();
                await this.getTicketData();
                this.setState({
                  isLoading:false
                })
                swal("Tickets assigned successfully");
              } else {
               swal(result.message)
              }
            });
          }else{
            swal("Ticket assign cancelled")
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { ticketButtonState , ticketObject , workerObject } = this.state;
    return (
      <React.Fragment>
        {this.state.isLoading ? <Loader /> : null }
        <div class="main-content">
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
                <p>Description : {ticketObject?.description == 'null' ? 'nil' : ticketObject?.description } </p>
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
                 <audio src={ticketObject?.voiceNoteUrl} width={100} height={100} controls="controls"/> 
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
                      <h3>Assign Ticket to Worker</h3>
                    </div>

                    <div class="card-body">

                    <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Select Store</label>
                        </div>
                        <div className="col-sm-4">
                        <SingleSelect
                            options={this.state.storeList}
                            handleChange={d => this.handleStoreList(d)}
                            selectedService={this.state.selectedStore}
                          />
                        </div>
                      </div>

                      {Object.keys(this.state.selectedStore).length >0 ? <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Select Ticket</label>
                        </div>
                        <div className="col-sm-4">
                        <SingleSelect
                            options={this.state.ticketList}
                            handleChange={d => this.handleTicketList(d)}
                            selectedService={this.state.selectedticket}
                          />
                        </div>
                      </div> : null}

                    {Object.keys(this.state.selectedStore).length >0 && Object.keys(this.state.selectedticket).length >0 ? 
                    
                    <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Select Worker</label>
                        </div>
                        <div className="col-sm-4">
                        <SingleSelect
                            options={this.state.workerList}
                            handleChange={d => this.handleWorkerList(d)}
                            selectedService={this.state.selectedWorker}
                          />
                        </div>
                      </div>
                    
                    : null }
                      

                      <div class="row form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                          <button type="button"
                            style={{ width: '100%' }}
                            onClick={this.assignTicketToWorker}
                            class="btn btn-primary m-t-15 waves-effect">
                            {"Assign Ticket"}
                          </button>
                        </div>
                        <div className="col-sm-4"></div>
                      </div>

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
