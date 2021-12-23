import React, { Component } from 'react';
import { FiAlignJustify } from "react-icons/fi";
import { BiFullscreen } from "react-icons/bi";
import Bridge from '../../Middleware/Bridge';
import swal from 'sweetalert';
import { FaUserCircle } from 'react-icons/fa';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      token: localStorage.getItem('token'),
      userDetail: localStorage.getItem('userDetail'),
      roles : localStorage.getItem('roles') !== null ? JSON.parse(localStorage.getItem('roles')) : null,
      image:null
    }
  }
  async componentDidMount() {
    try {

      let { userDetail } = this.state;
      if (userDetail != null) {
        userDetail = JSON.parse(userDetail);
        this.setState({
          userName: userDetail.firstName,
          image : userDetail?.profileImageUrl
        })
      }else{
        window.location.href='/';
      }

    } catch (error) {
      console.log(error);
    }
  }

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

  render() {
    const { userName ,roles} = this.state;
    return (
      <React.Fragment>
        <div class="navbar-bg"></div>
        <nav class="navbar navbar-expand-lg main-navbar sticky">
          <div class="form-inline mr-auto">
            <ul class="navbar-nav mr-3">
              <li><a href="#" data-toggle="sidebar" class="nav-link nav-link-lg
									collapse-btn">
                <FiAlignJustify size={24} style={{ color: 'black' }} />
              </a></li>
              <li><a href="#" class="nav-link nav-link-lg fullscreen-btn">
                <BiFullscreen size={24} style={{ color: 'black' }} />
              </a></li>
              <li>
              </li>
            </ul>
          </div>
          <ul class="navbar-nav navbar-right">

            <li class="dropdown"><a href="#" data-toggle="dropdown"
              class="nav-link dropdown-toggle nav-link-lg nav-link-user">
                {
                  this.state.image ? 

                  <img alt="image" src={this.state.image} width={30} height={30}
                   class="user-img-radious-style" /> :

                   <FaUserCircle size={30} style={{ width: '25px', color: 'black' }} />
                }
              <span class="d-sm-none d-lg-inline-block"></span></a>
              <div class="dropdown-menu dropdown-menu-right pullDown">
              <div class="dropdown-title">Role : {roles?.name}</div>
                <div class="dropdown-title">Hello {userName}</div>
                <a href="/profile" class="dropdown-item has-icon"> <i class="far
										fa-user"></i> Profile
                </a>
                <div class="dropdown-divider"></div>
                <a href="javascript:void(0)" onClick={this.userLogOut} class="dropdown-item has-icon text-danger"> <i class="fas fa-sign-out-alt"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>

      </React.Fragment>
    )
  }
}
