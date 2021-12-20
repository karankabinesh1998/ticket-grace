import React, { Component } from 'react';
import Bridge from '../../Middleware/Bridge';
import Datatable from "../../Components/Datatable/Datatable";
import SingleSelect from '../../Components/InputComponent/SingleSelect';
import swal from 'sweetalert';
import '../commonStyle.css';
import Validators from '../../HelperComponents/Validators';
import Loader from '../../Components/Loader/Loader';
import moment from 'moment';

export default class StoreManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      roles: [],
      department: null,
      phoneNumber:null,
      isLoading:false,
      selectedStore:{},
      password: null,
      confirmPassword: null,
      adminData: [],
      adminButtonState: true,
      selectedDepartment: {},
      storeList:[],
      editId: null,
      index: null,
      column: [
        {
          Header: "Name",
          accessor: "firstName"
        },
        {
          Header: "Email",
          accessor: "email"
        },
        {
          Header: "Mobile",
          accessor: "phoneNumber"
        },
        {
          Header: "Store",
          accessor: "store",
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
          Cell: (d) => this.editStoreManager(d),
        },
        {
          Header: "Delete",
          accessor: "delete",
          Cell: (d) => this.deleteStoreManager(d),
        }
      ]
    }
  }

  viewDepartment = (d) => {
    return d.original?.store?.name
  }

  editStoreManager = (d) => {
    let value = d;
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#addvendar"
          onClick={() => this.editionStoreManager(value)}
        >
          Edit
        </button>
      </center>
    );
  };

  editionStoreManager = async (d) => {
    let value = d.original;
    let selectedStore = { value: value?.store?._id, label: value?.store?.name };
    this.setState({
      index: d.index,
      firstName: value.firstName,
      lastName: value.lastName,
      phoneNumber:value.phoneNumber,
      email: value.email,
      editId: value._id,
      selectedStore,
      adminButtonState: false
    })
  }

  deleteStoreManager = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.deletionStoreManager(d)}
        >
          Delete
        </button>
      </center>
    );
  };

  deletionStoreManager = async (value) => {
    const previousData = [...this.state.adminData];
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
             await Bridge.deleteUser({ _id: value.original._id },result=>{

               if (result.status === 200) {
                 this.setState({ adminData: Data });
                 swal("Poof! Your Data has been deleted!", {
                   icon: "success",
                 });
               }else{
                 swal(result.message);
               }
            })

          } else {
            swal("Your Data  is safe!");
          }
        });

    } catch (error) {
      this.setState({ adminData: previousData });
      console.log(error);
    }
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading :true })
      await this.commonFunction();
      this.setState({ isLoading :false })
    } catch (error) {
      console.log(error);
    }
  };

  commonFunction=async()=>{
    try {
       await Bridge.getUserRole(rolesData=>{

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
        }else{
          swal(rolesData.message)
        }
      });
      
       await Bridge.getUserData(`?role=${this.state.roles[0]}`,adminUser=>{

         if (adminUser.status == 200) {
           this.setState({
             adminData: adminUser.data
             })
         }else{
           swal(adminUser.message)
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
    } catch (error) {
      console.log(error);
    }
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

  HandleStore = async (e) => {
    this.setState({
      selectedStore: e
    })
  }

  addStoreManager = async () => {
    const { firstName, lastName, password, confirmPassword, selectedDepartment,selectedStore,phoneNumber ,roles, email } = this.state;
    const validateEmail = await Validators.emailValidation(email);
    if (Object.keys(selectedStore).length === 0) {
      swal('Please select the store')
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
    if (!password) {
      swal('Please enter the password')
      return;
    }
    if (!confirmPassword) {
      swal('Please enter the confirm password')
      return;
    }
    if (password !== confirmPassword) {
      swal('confirm password does not match the password')
      return;
    }

    try {
      const formdata = {};
      formdata.firstName = firstName;
      formdata.lastName = lastName;
      formdata.email = email;
      formdata.store = selectedStore.value;
      formdata.phoneNumber=phoneNumber;
      formdata.roles = roles;
      formdata.password = password;
      this.setState({ isLoading:true })
      await Bridge.addUserRole(formdata, async result => {
        if (result.status === 200) {
          this.setState({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            selectedStore: {},
            roles: [],
            selectedDepartment: {},
          });
          await this.commonFunction();
          swal('Store Manager added successfully');
        } else {
          swal(result.message)
        }
        this.setState({ isLoading:false })
      });
    } catch (error) {
      console.log(error)
    }

  }

  updateStoreManager = async () => {
    const { firstName, lastName, password, confirmPassword, selectedDepartment, roles, email, editId, index , selectedStore , phoneNumber } = this.state;
    const validateEmail = await Validators.emailValidation(email);
    if (Object.keys(selectedStore).length === 0) {
      swal('Please select the store')
      return;
    }
    if (!firstName) {
      swal('Please enter the first name')
      return;
    }
    if (!lastName) {
      swal('Please enter the last name')
      return;
    };
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
    if (!password) {
      swal('Please enter the password')
      return;
    }
    if (!confirmPassword) {
      swal('Please enter the confirm password')
      return;
    }
    if (password !== confirmPassword) {
      swal('confirm password does not match the password')
      return;
    }
    try {

      const formdata = {};
      formdata.firstName = firstName;
      formdata.lastName = lastName;
      formdata.email = email;
      // formdata.department = selectedDepartment.value;
      formdata.roles = roles;
      formdata._id = editId;
      formdata.phoneNumber=phoneNumber;
      formdata.store = selectedStore.value;
      this.setState({ isLoading:true });
      await Bridge.updateUserRole(formdata,async result=>{

        if(result.status===200){
          this.setState({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            roles: [],
            selectedDepartment: {},
            phoneNumber:{},
            selectedStore:{},
             adminButtonState:true,
             phoneNumber:'',
             selectedStore:{}
          });
          await this.commonFunction()
          swal('Store Manager updated successfully');
        }else{
          swal(result.message);
        };
        this.setState({ isLoading:false })
      });

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { adminButtonState } = this.state;
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
                      <h3>Store Manager</h3>
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
                      {/* <div className="row form-group">
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
                      </div> */}

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

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Password</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the password"
                            onChange={this.handleChange}
                            value={this.state.password}
                            name="password" />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Confirm Password</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the confirm password"
                            onChange={this.handleChange}
                            value={this.state.confirmPassword}
                            name="confirmPassword" />
                        </div>
                        <div className="col-sm-3"></div>
                      </div>

                      <div class="row form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                          <button type="button"
                            style={{ width: '100%' }}
                            onClick={adminButtonState === true ? this.addStoreManager : this.updateStoreManager}
                            class="btn btn-primary m-t-15 waves-effect">
                            {adminButtonState === true ? "Add Store Manager" : "Update Store Manager"}
                          </button>
                        </div>
                        <div className="col-sm-4"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-12">
                          {this.state.adminData.length ? (
                            <Datatable
                              data={this.state.adminData}
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
