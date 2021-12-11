import React, { Component } from 'react';
import Bridge from '../../Middleware/Bridge';
import Datatable from "../../Components/Datatable/Datatable";
import SingleSelect from '../../Components/SingleSelect';
import swal from 'sweetalert';
import '../commonStyle.css';
import Validators from '../../HelperComponents/Validators';

export default class Vendor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      roles: [],
      department: null,
      password: null,
      confirmPassword: null,
      adminData: [],
      adminButtonState: true,
      selectedDepartment: {},
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
          Header: "Department",
          accessor: "department",
          Cell: (d) => this.viewDepartment(d)
        },
        {
          Header: "Edit",
          accessor: "firstname",
          Cell: (d) => this.editAdminUser(d),
        },
        {
          Header: "Delete",
          accessor: "delete",
          Cell: (d) => this.deleteAdminUser(d),
        }
      ]
    }
  }

  viewDepartment = (d) => {
    return d.original.department.name
  }

  editAdminUser = (d) => {
    let value = d;
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#addvendar"
          onClick={() => this.editionAdmin(value)}
        >
          Edit
        </button>
      </center>
    );
  };

  editionAdmin = async (d) => {
    let value = d.original;
    let selectedDepartment = { value: value.department._id, label: value.department.name };
    this.setState({
      index: d.index,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      editId: value._id,
      selectedDepartment,
      adminButtonState: false
    })
  }

  deleteAdminUser = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.deletionAdmin(d)}
        >
          Delete
        </button>
      </center>
    );
  };

  deletionAdmin=async(value)=>{
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
                        const result = await Bridge.deleteUser({ _id: value.original._id })
                        if (result.status === 200) {
                            this.setState({ adminData: Data });
                            swal("Poof! Your Data has been deleted!", {
                                icon: "success",
                            });
                        }

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
      const adminUser = await Bridge.getUserData();
      if (adminUser.status == 200) {
        this.setState({
          adminData: adminUser.data.filter(item=>{
            if(item.roles[0].name=='vendor'){
                return item
            }
        })
        })
      }
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

      const rolesData = await Bridge.getUserRole();
      if (rolesData.status === 200) {
        let roles = [];
        rolesData.data.map(item => {
          if (item.name == 'vendor') {
            roles.push(item._id);
          }
          this.setState({
            roles
          })
        })
      }

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

  addVendor = async () => {
    const { firstName, lastName, password, confirmPassword, selectedDepartment, roles, email } = this.state;
    const validateEmail = await Validators.emailValidation(email);
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
      formdata.department = selectedDepartment.value;
      formdata.roles = roles;
      formdata.password = password
      const result = await Bridge.addUserRole(formdata);
      if (result.status === 200) {
        result.data.department = { _id: selectedDepartment.value, name: selectedDepartment.label }
        this.setState({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          roles: [],
          selectedDepartment: {},
          adminData: [result.data, ...this.state.adminData]
        })
        swal('Vendor added successfully');
      }
    } catch (error) {
      console.log(error)
    }

  }

  updateVendor = async () => {
    const { firstName, lastName, password, confirmPassword, selectedDepartment, roles, email, editId, index } = this.state;
    const validateEmail = await Validators.emailValidation(email);
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
      formdata.department = selectedDepartment.value;
      formdata.roles = roles;
      formdata._id = editId;

      const result = await Bridge.updateUserRole(formdata);
      if(result.status===200){
        formdata.department = { _id: selectedDepartment.value, name: selectedDepartment.label };
        const previousAdminData = [...this.state.adminData];
        previousAdminData[index] = formdata
        this.setState({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          roles: [],
          selectedDepartment: {},
          adminData: previousAdminData,
          adminButtonState:true
        })
        swal('Vendor updated successfully');
      }

    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { adminButtonState } = this.state;
    return (
      <React.Fragment>
        <div class="main-content">
          <section class="section">
            <div class="section-body">
              <div class="row">
                <div class="col-12">
                  <div class="card">
                    <div class="card-header">
                      <h3>Vendor</h3>
                    </div>

                    <div class="card-body">

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
                            onClick={adminButtonState === true ? this.addVendor : this.updateVendor}
                            class="btn btn-primary m-t-15 waves-effect">
                            {adminButtonState === true ? "Add Vendor" : "Update Vendor"}
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
