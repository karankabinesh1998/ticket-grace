import React, { Component } from 'react';
import Datatable from '../../Components/Datatable/Datatable';
import Bridge from '../../Middleware/Bridge';
import SingleSelect from '../../Components/SingleSelect';
import swal from 'sweetalert';
import '../commonStyle.css';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'


export default class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      selectedDepartment: {},
      assignedTo: null,
      departmentUser: null,
      image: [{filename:null,file:null}],
      ticketsData: [],
      voiceNote: null,
      createdBy: null,
      ticketButtonState: true,
      department: [],
      storeList: [],
      selectedStore: {},
      recordState:null
    }
  }

  async componentDidMount(){
    try {

      const result = await Bridge.getDepartments();
      if (result.status === 200) {
        let department = [];
        if (result.data.length) {
          result.data.map(ival => {
            department.push({ value: ival._id, label: ival.name })
          });
        }
        this.setState({ department })
      } 

      const storeResult = await Bridge.getStores();
      if (storeResult.status === 200) {
        let storeList = [];
        if (storeResult.data.length) {
          storeResult.data.map(ival => {
            storeList.push({ value: ival._id, label: ival.name })
          });
        }
        this.setState({ storeList })
      } 
      
    } catch (error) {
      console.log(error);
    }
  }

  handleChange=async(e)=>{ this.setState({ [e.target.name] : e.target.value }) };

  HandleDepartment=async(e)=>{ this.setState({ selectedDepartment : e }) };

  handleStore=async(e)=>{ this.setState({ selectedStore : e })};

  handleMoreImage=async()=>{ this.setState({ image : [...this.state.image,{ filename:null,file:null }] }) };

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
    })
  }

  addTicket=async()=>{
    const { title , description, selectedStore ,selectedDepartment  } = this.state;
  }

  start = () => {
    this.setState({
      recordState: RecordState.START
    })
  }
 
  stop = () => {
    this.setState({
      recordState: RecordState.STOP
    })
  }
 
  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log('audioData', audioData)
  }

  render() {
    const { ticketButtonState  , recordState} = this.state;
    return (
      <React.Fragment>
        <div class="main-content">
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
                          <label class="labell2">Ticket Name</label>
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
                            name="address"> </textarea>
                        </div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Upload Voice</label>
                        </div>
                        <div className="col-sm-4">
                          {/* <AudioReactRecorder state={recordState} onStop={this.onStop} />
                          <button onClick={this.start}>Start</button>
                          <button onClick={this.stop}>Stop</button> */}

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
                                // className="custom-file-input" 
                                onChange={(e) => this.handleChangeFile(i,e)}
                                accept="image/*"
                              />
                              {/* <label className="custom-file-label" htmlFor="customFileThumbnail">
                                {image.filename ? image.filename.substring(0, 15) : null}
                              </label> */}
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
