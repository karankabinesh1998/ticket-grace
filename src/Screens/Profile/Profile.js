import React, { Component } from 'react'
import Bridge from '../../Middleware/Bridge';
import moment from 'moment';
import Validators from '../../HelperComponents/Validators';
import swal from 'sweetalert';
import './profile.css'
import SelectImage from '../../Components/Media/SelectImage';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName:'',
      lastName:'',
      phoneNumber:'',
      email:'',
      profileImage:null,
      role:null,
      userDetail:{},
      currentPassword:'',
      password:'',
      confirmPassword:'',
      profileImagePreview:null
    }
  }

  async componentDidMount(){
    try {
      await this.commonFunction();
    } catch (error) {
      console.log(error);
    }
  };

  submitChanges=async()=>{
    const { firstName , lastName ,phoneNumber,email,userDetail,currentPassword,password,confirmPassword ,profileImage }=this.state;
    const validateEmail = await Validators.emailValidation(email);
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
    };

   if(currentPassword !==''){
    if (currentPassword == '' || currentPassword == null) {
      swal('Please enter the current password')
      return;
    }

    if (password == '' || password == null) {
      swal('Please enter the new password')
      return;
    }

    if (password !== confirmPassword) {
      swal('Please enter the confirm  new password')
      return;
    }
   }

    try {

      const formdata = new FormData();
      formdata.append("firstName",firstName)
      formdata.append("lastName",lastName)
      formdata.append("phoneNumber",phoneNumber)
      formdata.append("email",email);
      if(currentPassword !==''){
      formdata.append("currentPassword",currentPassword)
      formdata.append("password",password)
      }
      formdata.append("profileImage",profileImage)

      const result = await Bridge.updateProfile(formdata);

      if(result.status===200){
        this.setState({
          currentPassword:'',
          password:"",
          confirmPassword:"",
          profileImage:null,
          profileImagePreview:null
        })
        await this.commonFunction();
        let setLocal = this.state.userDetail;
        setLocal.profileImageUrl = result?.data?.profileImageUrl;
        localStorage.setItem("userDetail",JSON.stringify(setLocal));
        console.log(localStorage.getItem("userDetail"))
        swal("Profile updated successfully");
      }
      
    } catch (error) {
      console.log(error);
    }
  };


  userLogOut = async () => {
    const result = await Bridge.userLogOut();
    if(result.status==200){
      localStorage.removeItem('token');
      localStorage.removeItem('userDetail');
      localStorage.removeItem('roles');
      window.location.href='/';
    }else{
      swal('Something went wrong !!')
    }
}

  commonFunction=async()=>{
    try {
      const result = await Bridge.getProfile();
      if(result.status===200){
        console.log('object',result.data);
        if(result?.data){
          this.setState({
            firstName:result?.data?.firstName,
            lastName:result?.data?.lastName,
            phoneNumber:result?.data?.phoneNumber,
            email:result?.data?.email,
            userDetail:result?.data,
            profileImage:null
          })
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleChange=async(e)=>{
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  handleImageFile=async(e)=>{
    console.log(e);
    this.setState({
      profileImage : e
    })
    var reader = new FileReader();
   var url = reader.readAsDataURL(e);
   reader.onloadend = function (e) {
    this.setState({
      profileImagePreview: [reader.result],
    })
  }.bind(this);
   }

  render() {
    const { firstName , lastName ,phoneNumber,email,userDetail }=this.state;
    return (
      <React.Fragment>
        <div class="main-content">
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet" />
          <div class="container">
            <div class="row flex-lg-nowrap">
              <div class="col">
                <div class="row">
                  <div class="col mb-3">
                    <div class="card">
                      <div class="card-body">
                        <div class="e-profile">
                          <div class="row">
                            <div class="col-12 col-sm-auto mb-3">
                              <div class="mx-auto" style={{ width: '140px' }}>
                                <div class="d-flex justify-content-center align-items-center rounded" style={{ height: '140px', backgroundColor: 'rgb(233, 236, 239)' }}>
                                  {/* <span style={{ color: 'rgb(166, 168, 170)', font: 'bold 8pt Arial' }}>140x140</span> */}
                                  <img src={this.state?.profileImagePreview ? this.state?.profileImagePreview : userDetail?.profileImageUrl} width={150} height={150} />
                                </div>
                              </div>
                            </div>
                            <div class="col d-flex flex-column flex-sm-row justify-content-between mb-3">
                              <div class="text-center text-sm-left mb-2 mb-sm-0">
                                <h6 class="pt-sm-2 pb-1 mb-0 text-nowrap">{firstName} {lastName}</h6>
                                <p class="mb-0">@{firstName}</p>
                                <div class="text-muted"><small>Last seen {userDetail?.lastLoggedinAt ?
                                 moment(userDetail?.lastLoggedinAt).format('MMM Do YY h:mm:ss') : 0 } ago</small></div>
                                <div class="mt-2">
                                  <SelectImage profileImageUrl={this.state.profileImageUrl} handleImageFile={this.handleImageFile}/>
                                  </div>
                              </div>
                              <div class="text-center text-sm-right">
                                <span class="badge badge-secondary">{userDetail?.roles?.[0]?.name}</span>
                                <div class="text-muted"><small>Joined {moment(userDetail?.updatedAt).format("MMM Do YYYY")}</small></div>
                              </div>
                            </div>
                          </div>
                          <div class="tab-content pt-3">
                            <div class="tab-pane active">
                              <form class="form" novalidate="">
                                <div class="row">
                                  <div class="col">
                                    <div class="row">
                                      <div class="col">
                                        <div class="form-group">
                                          <label>Full Name</label>
                                          <input type="text"
                                            class="form-control"
                                            placeholder="Enter the first name"
                                            onChange={this.handleChange}
                                            value={this.state.firstName}
                                            name="firstName" />
                                        </div>
                                      </div>
                                      <div class="col">
                                        <div class="form-group">
                                          <label>Last Name</label>
                                          <input type="text"
                                            class="form-control"
                                            placeholder="Enter the last name"
                                            onChange={this.handleChange}
                                            value={this.state.lastName}
                                            name="lastName" />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col">
                                        <div class="form-group">
                                          <label>Mobile Number</label>
                                          <input type="text"
                                            class="form-control"
                                            placeholder="Enter the phone number"
                                            onChange={this.handleChange}
                                            onKeyPress={Validators.isNumber}
                                            value={this.state.phoneNumber}
                                            name="phoneNumber" />
                                        </div>
                                      </div>
                                      <div class="col">
                                        <div class="form-group">
                                          <label>Email-Id</label>
                                          <input type="text"
                                            class="form-control"
                                            placeholder="Enter the last name"
                                            onChange={this.handleChange}
                                            value={this.state.email}
                                            name="email" />
                                        </div>
                                      </div>
                                    </div>
                                    {/* <div class="row">
                                      <div class="col mb-3">
                                        <div class="form-group">
                                          <label>About</label>
                                          <textarea class="form-control" rows="5" placeholder="My Bio"></textarea>
                                        </div>
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col-12 col-sm-6 mb-3">
                                    <div class="mb-2"><b>Change Password</b></div>
                                    <div class="row">
                                      <div class="col">
                                        <div class="form-group">
                                          <label>Current Password</label>
                                          <input class="form-control" type="password" 
                                           placeholder="Enter the current password"
                                           onChange={this.handleChange}
                                           value={this.state.currentPassword}
                                           name="currentPassword"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col">
                                        <div class="form-group">
                                          <label>New Password</label>
                                          <input class="form-control" type="password" 
                                           placeholder="Enter the new password"
                                           onChange={this.handleChange}
                                           value={this.state.password}
                                           name="password"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row">
                                      <div class="col">
                                        <div class="form-group">
                                          <label>Confirm <span class="d-none d-xl-inline">Password</span></label>
                                          <input class="form-control" type="password" 
                                           placeholder="Enter the confirm password"
                                           onChange={this.handleChange}
                                           value={this.state.confirmPassword}
                                           name="confirmPassword"
                                          />
                                          </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="row">
                                  <div class="col d-flex justify-content-end">
                                    <button class="btn btn-success" type="button" onClick={this.submitChanges} >Save Changes</button>
                                  </div>
                                </div>
                              </form>

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 col-md-3 mb-3">
                    <div class="card mb-3">
                      <div class="card-body">
                        <div class="px-xl-3">
                          <button class="btn btn-block btn-danger" onClick={this.userLogOut}>
                            <i class="fa fa-sign-out"></i>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="card">
                      <div class="card-body">
                        <h6 class="card-title font-weight-bold">Support</h6>
                        <p class="card-text">Get fast, free help from our friendly assistants.</p>
                        <button type="button" class="btn btn-primary">Contact Us</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
