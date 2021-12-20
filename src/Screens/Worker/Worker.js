import React, { Component } from 'react';
import Bridge from '../../Middleware/Bridge';
import Datatable from "../../Components/Datatable/Datatable";
import SingleSelect from '../../Components/InputComponent/SingleSelect';
import swal from 'sweetalert';
import '../commonStyle.css';
import Validators from '../../HelperComponents/Validators';
import Loader from '../../Components/Loader/Loader';
import moment from 'moment';

export default class Worker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      department: null,
      password: null,
      confirmPassword: null,
      workerData: [],
      isLoading:false,
      workerButtonState: true,
      selectedDepartment: {},
      selectedStore:{},
      phoneNumber:'',
      storeList:[],
      editId: null,
      index: null,
      column: [
        {
          Header: "Name",
          accessor: "firstName"
        },
        {
          Header: "Mobile",
          accessor: "phoneNumber"
        },
        {
          Header: "Email",
          accessor: "email"
        },
        {
          Header: "Store",
          accessor: "store",
          Cell: (d) => <p>{d.original?.store?.name}</p>
        },
        {
          Header: "Department",
          accessor: "department",
          Cell: (d) => this.viewDepartment(d)
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
          Header: "Edit",
          accessor: "firstname",
          Cell: (d) => this.editWorker(d),
        },
        {
          Header: "Delete",
          accessor: "delete",
          Cell: (d) => this.deleteWorker(d),
        }
      ]
    }
  }

  viewDepartment = (d) => {
    return d.original.department?.name
  }

  editWorker = (d) => {
    let value = d;
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#addvendar"
          onClick={() => this.editionWorker(value)}
        >
          Edit
        </button>
      </center>
    );
  };

  editionWorker = async (d) => {
    let value = d.original;
    let selectedDepartment = { value: value?.department?._id, label: value?.department?.name };
    let selectedStore = { value: value?.store?._id, label: value?.store?.name };
    this.setState({
      index: d.index,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      editId: value._id,
      selectedDepartment,
      selectedStore,
      phoneNumber:value.phoneNumber ,
      workerButtonState: false
    })
  }

  deleteWorker = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.deletionWorker(d)}
        >
          Delete
        </button>
      </center>
    );
  };

  deletionWorker = async (value) => {
    const previousData = [...this.state.workerData];
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
            const result = await Bridge.deleteWorker({ _id: value.original._id })
            if (result.status === 200) {
              this.setState({ workerData: Data });
              swal("Poof! Your Data has been deleted!", {
                icon: "success",
              });
            }

          } else {
            swal("Your Data  is safe!");
          }
        });

    } catch (error) {
      this.setState({ workerData: previousData });
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading:true })
      await this.commonFunction();
      this.setState({ isLoading:false })
    } catch (error) {
      console.log(error);
    }
  }

  commonFunction = async () => {
    await Bridge.getWorker(null,workerUser=>{

      if (workerUser.status == 200) {
        this.setState({
          workerData: workerUser.data
        })
      }else{
        swal(workerUser.message)
      }
    });

    await Bridge.getStores(storeData=>{

      if (storeData.status == 200) {
        let storeList = [];
        if (storeData.data.length) {
          storeData.data.map(ival => {
            storeList.push({ value: ival._id, label: ival.name })
          });
        }
        this.setState({ storeList })
      }else{
        swal(storeData.message)
      }
    });

    await Bridge.getDepartments(result=>{

      if (result.status === 200) {
        let department = [];
        if (result.data.length) {
          result.data.map(ival => {
            department.push({ value: ival._id, label: ival.name })
          });
        }
        this.setState({ department })
      }else{
        swal(result.message)
      }
    });
  }

  handleChange = async (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  HandleDepartment = async (e) => {
    this.setState({
      selectedDepartment: e
    })
  }

  HandleStore  = async (e) => {
    this.setState({
      selectedStore: e
    })
  }

  addWorker = async () => {
    const { firstName, lastName, password, confirmPassword, selectedDepartment, email , selectedStore , phoneNumber } = this.state;
    const validateEmail = await Validators.emailValidation(email);
  
    if (Object.keys(selectedStore).length === 0) {
      swal('Please select the store')
      return;
    }

    if (Object.keys(selectedDepartment).length === 0) {
      swal('Please select the department')
      return;
    }
    if (!firstName) {
      swal('Please enter the first name')
      return;
    }
    if (!lastName) {
      swal('Please enter the last name')
      return;
    }
    const validatePhone = await Validators.phoneNumberValidation(phoneNumber);
    if(validatePhone){
      swal(validatePhone);
      return;
    }
    if (!email) {
      swal('Please enter the email id')
      return;
    } else if (validateEmail !== null) {
      swal('Please enter the valid email id')
      return;
    }

    try {
      const formdata = {};
      formdata.firstName = firstName;
      formdata.lastName = lastName;
      formdata.email = email;
      formdata.department = selectedDepartment.value;
      formdata.store = selectedStore.value;
      formdata.phoneNumber = phoneNumber;
      this.setState({ isLoading :true })
      await Bridge.addWorker(formdata,async result=>{

        if (result.status === 200) {
           this.setState({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            selectedDepartment: {},
            selectedStore:{},
            phoneNumber:'',
           });
           await this.commonFunction();
          swal('Worker added successfully');
        }else{
          swal(result.message)
        }
        this.setState({ isLoading :false })
      });
    } catch (error) {
      console.log(error)
    }

  }

  updateWorker = async () => {
    const { firstName, lastName, password, confirmPassword, selectedDepartment, email, editId, index , phoneNumber , selectedStore } = this.state;
    const validateEmail = await Validators.emailValidation(email);
    
    if (Object.keys(selectedStore).length === 0) {
      swal('Please select the store')
      return;
    }
    if (Object.keys(selectedDepartment).length === 0) {
      swal('Please select the department')
      return;
    }
    if (!firstName) {
      swal('Please enter the first name')
      return;
    }
    if (!lastName) {
      swal('Please enter the last name')
      return;
    }
    const validatePhone = await Validators.phoneNumberValidation(phoneNumber);
    if(validatePhone){
      swal(validatePhone);
      return;
    }
    if (!email) {
      swal('Please enter the email id')
      return;
    } else if (validateEmail !== null) {
      swal('Please enter the valid email id')
      return;
    }
  
    try {

      const formdata = {};
      formdata.firstName = firstName;
      formdata.lastName = lastName;
      formdata.phoneNumber = phoneNumber;
      formdata.email = email;
      formdata.store = selectedStore.value;
      formdata.department = selectedDepartment.value;
      formdata._id = editId;
      this.setState({ isLoading :true })
      await Bridge.editWorker(formdata,async result=>{

        if (result.status === 200) {
          this.setState({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber:'',
            password: '',
            confirmPassword: '',
            roles: [],
            selectedDepartment: {},
            selectedStore:{},
             workerButtonState: true
          })
          await this.commonFunction();
          swal('Worker updated successfully');
        }else{
          swal(result.message)
        }
        this.setState({ isLoading :false })
      });

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { workerButtonState } = this.state;
    return (
      <React.Fragment>
        {this.state.isLoading ? <Loader /> : null }
        <div class="main-content">
          <section class="section">
            <div class="section-body">
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header">
                      <h3>Worker</h3>
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
                            handleChange={d => this.HandleStore(d)}
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
                          <label class="labell2">First Name</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the first name"
                            onChange={this.handleChange}
                            value={this.state.firstName}
                            name="firstName" />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Last Name</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the last name"
                            onChange={this.handleChange}
                            value={this.state.lastName}
                            name="lastName" />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Phone Number</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the phone number"
                            onChange={this.handleChange}
                            onKeyPress={Validators.isNumber}
                            value={this.state.phoneNumber}
                            name="phoneNumber" />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Email Id</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the last name"
                            onChange={this.handleChange}
                            value={this.state.email}
                            name="email" />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div class="row form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                          <button type="button"
                            style={{ width: '100%' }}
                            onClick={workerButtonState === true ? this.addWorker : this.updateWorker}
                            class="btn btn-primary m-t-15 waves-effect">
                            {workerButtonState === true ? "Add Worker Manager" : "Update Worker Manager"}
                          </button>
                        </div>
                        <div className="col-sm-4"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-12">
                          {this.state.workerData.length ? (
                            <Datatable
                              data={this.state.workerData}
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
