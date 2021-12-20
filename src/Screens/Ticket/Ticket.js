import React, { Component } from 'react';
import Datatable from '../../Components/Datatable/Datatable';
import Bridge from '../../Middleware/Bridge';
import SingleSelect from '../../Components/InputComponent/SingleSelect';
import swal from 'sweetalert';
import '../commonStyle.css';
import AudioRecorder from '../../Components/Audio/AudioRecorder';
import moment from 'moment';
import ModelWindow from '../../Components/Model';
import Loader from '../../Components/Loader/Loader';

export default class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      selectedDepartment: {},
      assignedTo: null,
      departmentUser: null,
      image: [{ filename: null, file: null }],
      ticketsData: [],
      voiceNote: null,
      createdBy: null,
      ticketButtonState: true,
      department: [],
      storeList: [],
      index:null,
      editId:null,
      isLoading:false,
      selectedStore: {},
      recordState: null,
      audioFile: null,
      viewImage_1: null,
      viewImage_2: null,
      viewImage_3: null,
      viewAudio: null,
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
          Header: "Title",
          accessor: "title"
        },
        {
          Header: "Status",
          accessor: "status"
        },
        {
          Header: "CreatedBy",
          accessor: "createdBy",
          Cell: (d) => <p> {d.original?.createdBy?.firstName} {d.original?.createdBy?.lastName} </p>
        },
        {
          Header: "Created At",
          accessor: "createdAt",
          Cell: (d) => this.createdAt(d)
        },
        {
          Header: "Media",
          accessor: "name",
          Cell: (d) => this.viewMediaModel(d)
        },
        {
          Header: "Re-Open",
          accessor: "name",
          Cell: (d) => this.statusReOpen(d),
        },
        {
          Header: "Delete",
          accessor: "delete",
          Cell: (d) => this.deleteticket(d),
        },
      ]
    }
  }

  createdAt = (d) => {
    // moment().format('MMMM Do YYYY, h:mm:ss a'); // December 15th 2021, 6:31:12 pm
    // moment().format('dddd');                    // Wednesday
    // moment().format("MMM Do YY");               // Dec 15th 21
    // moment().format('YYYY [escaped] YYYY');     // 2021 escaped 2021
    // moment().format(); 
    return <p>{moment(d.original.createdAt).format('MMM Do YY, h:mm a')}</p>
  }

  storeColumn = (d) => {
    return <p>{d.original.store.name}</p>
  }

  departmentColumn = (d) => {
    return <p>{d.original.department.name}</p>
  };

  statusReOpen=(d)=>{
    let value = d;
    return (
      <center>
        <button
          type="button"
          className={d.original?.status !=='close' ? "btn btn-grey" : "btn btn-info" }
          disabled={d.original?.status !=='close'}
          onClick={() => this.reOpenTicket(value)}
        >
          Re-Open
        </button>
      </center>
    );
  };

  reOpenTicket = async (d) => {
    try {
      swal({
        title: "Are you sure?",
        text: "Do you want to Re-open this Ticket !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {

          if (willDelete) {
            const result = await Bridge.cancelClosedTicket({ _id: d.original?._id });
            if (result.status === 200) {
              await this.getTicktesData();
              swal("Ticket re-opened successfully");
            }
          }else{
            swal("Cancelled!!");
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  editTicket = (d) => {
    let value = d;
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => this.editionTicket(value)}
        >
          Edit
        </button>
      </center>
    );
  };

  editionTicket=async(e)=>{
    let d = e.original;
    console.log(d);
    this.setState({
      index:e.original.index,
      editId:d._id,
      title:d.title,
      ticketButtonState:false,
      selectedDepartment:{ value:d.department?._id,label:d.department?.name },
      selectedStore:{value:d.store?._id,label:d.store?.name} ,
      audioFile:d.voiceNoteUrl,
      image:[ 
        { filename:d?.image_1 , file:d?.image_1 },
        { filename:d?.image_2 ,file:d?.image_2 } ]
    })

  }

  viewMediaModel = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-warning"
          data-toggle="modal"
          data-target="#openModel"
          onClick={() => this.openModelWindow(d)}
        >
          View Media
        </button>
      </center>
    );
  };

  openModelWindow = async (e) => {
   this.setState({
      viewImage_1: e.original.image_1,
      viewImage_2: e.original.image_2,
      viewImage_3: e.original.image_3,
      viewAudio: e.original.voiceNoteUrl
    })
  }

  deleteticket = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-danger"
          disabled={d.original?.status == 'assigned'}
          onClick={() => this.deletionTicket(d)}
        >
          Delete
        </button>
      </center>
    );
  };

  deletionTicket = async (value) => {
    const previousData = [...this.state.ticketsData];
    const getData = { ...previousData[value.index] };
    const Data = previousData.filter((delelteid) => delelteid._id !== getData._id);
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then(async (willDelete) => {

          if (willDelete) {
            await Bridge.deleteTicket({ _id: value.original._id },result=>{
              if (result.status === 200) {
                this.setState({ ticketsData: Data });
                swal("Poof! Your Data has been deleted!", {
                  icon: "success",
                });
              }else{
                swal(result.message);
              }
            });
          } else {
            swal("Your Data  is safe!");
          }
        });

    } catch (error) {
      this.setState({ ticketsData: previousData });
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        isLoading : true
      });

      await Bridge.getDepartments(result => {
        if (result.status === 200) {
          let department = [];
          if (result.data.length) {
            result.data.map(ival => {
              department.push({ value: ival._id, label: ival.name })
            });
          }
          this.setState({ department })
        } else {
          swal(result.message)
        }
      });
      
      await Bridge.getStores(storeResult => {
        if (storeResult.status === 200) {
          let storeList = [];
          if (storeResult.data.length) {
            storeResult.data.map(ival => {
              storeList.push({ value: ival._id, label: ival.name })
            });
          }
          this.setState({ storeList })
        }
      });
      

      await this.getTicktesData();
      this.setState({
        isLoading:false
      })
    } catch (error) {
      console.log(error);
    }
  }

  getTicktesData = async () => {
    try {
      await Bridge.getTicket(null, (getTickets) => {

        if (getTickets.status == 200) {
          this.setState({ ticketsData: getTickets.data })
        } else {
          swal(getTickets.message)
        }
      });
    } catch (error) {
      console.log(error)
    }
  }

  handleChange = async (e) => { this.setState({ [e.target.name]: e.target.value }) };

  HandleDepartment = async (e) => { this.setState({ selectedDepartment: e }) };

  handleStore = async (e) => { this.setState({ selectedStore: e }) };

  handleMoreImage = async () => {
    if (this.state.image.length == 3) {
      swal("Maximum Image Limit reached!!");
      return
    }
    this.setState({ image: [...this.state.image, { filename: null, file: null }] })
  };

  handleRemoveImage = async (index) => {
    const { image } = this.state;
    image.splice(index, 1);
    this.setState({
      image
    })
  }

  handleChangeFile = async (index, e) => {
    const currentImageFiles = [...this.state.image];
    currentImageFiles[index] = { filename: e.target.files[0].name, file: e.target.files[0] }
    this.setState({
      image: currentImageFiles
    });
  }

  addTicket = async () => {
    const { title, description, selectedStore, selectedDepartment, image, audioFile } = this.state;

    if (Object.keys(selectedStore).length == 0) {
      swal("Please select the store");
      return
    }

    if (Object.keys(selectedDepartment).length == 0) {
      swal("Please select the department");
      return
    }

    if (!title) {
      swal("Please enter the title");
      return
    }

    if (audioFile == null) {
      swal("Please upload audio file");
      return
    }

    if (!image[0]?.filename) {
      swal("Please upload Image file");
      return
    }

    try {

      const formdata = new FormData();
      formdata.append('voice', audioFile);
      formdata.append('title', title);
      formdata.append('store', selectedStore.value);
      formdata.append('department', selectedDepartment.value);
      let wait = await image.map((ival, i) => {
        formdata.append(`image_${i + 1}`, ival.file);
      });
      formdata.append('description', description);
      this.setState({
        isLoading:true
      })
      await Bridge.addTicket(formdata,async(result)=>{
        if (result.status == 200) {

         this.setState({
            title: '',
            description: '',
            selectedDepartment: {},
            selectedStore: {},
            image: [{ filename: null, file: null }],
            ticketsData: [result.data, ...this.state.ticketsData],
            isLoading:false
          });
          swal('Ticket has successfully created !!')
          await this.getTicktesData();
        }else{
          swal(result.message)
        }
      });


    } catch (error) {
      console.log(error);
    }

  };

  updateTicket=async()=>{
    const { title, description, selectedStore, selectedDepartment, image, audioFile } = this.state;

    if (Object.keys(selectedStore).length == 0) {
      swal("Please select the store");
      return
    }

    if (Object.keys(selectedDepartment).length == 0) {
      swal("Please select the department");
      return
    }

    if (!title) {
      swal("Please enter the title");
      return
    }

    try {
      
    } catch (error) {
      console.log(error);
    }
  }

  handleAudioFile = async (e) => {
    this.setState({ audioFile: e })
  }



  render() {
    const { ticketButtonState } = this.state;
    return (
      <React.Fragment>
        {this.state.isLoading ? <Loader /> : null }
        <div class="main-content">
          <ModelWindow
            ButtonTitle={"Ticket Media"}
            ButtonName={"Ticket Media"}
            id="openModel"
            indexStyle={{ color: "black", fontWeight: '500' }}
            ButtonBody={
              <React.Fragment>
                {
                  this.state?.viewImage_1 ?
                    <div className="row form-group">
                      <div className="col-sm-3">
                        <label class="labell2">Image-1</label>
                      </div>
                      <div className="col-sm-4">
                        <img src={this.state.viewImage_1} width={300} height={200} />
                      </div>
                      <div className="col-sm-3"></div>
                    </div>
                    : null
                }
                {this.state?.viewImage_2 ? <div className="row form-group">
                  <div className="col-sm-3">
                    <label class="labell2">Image-2</label>
                  </div>
                  <div className="col-sm-4">
                    <img src={this.state.viewImage_2} width={300} height={200} />
                  </div>
                  <div className="col-sm-3"></div>
                </div> :
                  null
                }

                {this.state?.viewImage_3 ? <div className="row form-group">
                  <div className="col-sm-3">
                    <label class="labell2">Image-3</label>
                  </div>
                  <div className="col-sm-4">
                    <img src={this.state.viewImage_3} width={300} height={200} />
                  </div>
                  <div className="col-sm-3"></div>
                </div> : null
                }
                <div className="row form-group">
                  <div className="col-sm-3">
                    <label class="labell2">Audio</label>
                  </div>
                  <div className="col-sm-4">
                    <audio src={this.state.viewAudio} width={300} height={200} controls="controls" />
                  </div>
                  <div className="col-sm-3"></div>
                </div>
              </React.Fragment>
            }
          />
          <section class="section">
            <div class="section-body">
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header">
                      <h3>Ticket</h3>
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
                            handleChange={d => this.handleStore(d)}
                            selectedService={this.state.selectedStore}
                          />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Select Department</label>
                        </div>
                        <div className="col-sm-4">
                          <SingleSelect
                            options={this.state.department}
                            handleChange={d => this.HandleDepartment(d)}
                            selectedService={this.state.selectedDepartment}
                          />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Title</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the name"
                            onChange={this.handleChange}
                            value={this.state.title}
                            name="title" />
                        </div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Description</label>
                        </div>
                        <div className="col-sm-4">
                          <textarea type="text"
                            class="form-control"
                            placeholder="Enter the description"
                            onChange={this.handleChange}
                            value={this.state.description}
                            name="description"> </textarea>
                        </div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Upload Voice</label>
                        </div>
                        <div className="col-sm-6">
                          <AudioRecorder  handleAudioFile={this.handleAudioFile} />
                        </div>
                      </div>

                      {this.state.image.map((image, i) => {
                        return (
                          <div className="row form-group">
                            <div className="col-sm-2"></div>
                            <div className="col-sm-2">
                              <label class="labell2">Upload Image {i + 1}</label>
                            </div>
                            <div className="col-sm-4">
                              <input
                                type="file"
                                onChange={(e) => this.handleChangeFile(i, e)}
                                accept="image/*"
                              />
                            </div>
                            <div className="col-sm-4">
                              {i == 0 ? <button type='button' className='btn btn-success' onClick={this.handleMoreImage} >
                                Add more
                              </button> :
                                <button type='button' className='btn btn-danger' onClick={() => this.handleRemoveImage(i)}>
                                  Remove
                                </button>
                              }
                            </div>
                          </div>
                        )
                      })}

                      <div class="row form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                          <button type="button"
                            style={{ width: '100%' }}
                            onClick={ticketButtonState === true ? this.addTicket : this.updateTicket}
                            class="btn btn-primary m-t-15 waves-effect">
                            {ticketButtonState === true ? "Add Ticket" : "Update Ticket"}
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
