import React, { Component } from 'react';
import { FiAlignJustify } from "react-icons/fi";
import { BiFullscreen } from "react-icons/bi";
import Bridge from '../../Middleware/Bridge';
import swal from 'sweetalert';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      token: localStorage.getItem('token'),
      userDetail: localStorage.getItem('userDetail')
    }
  }
  async componentDidMount() {
    try {

      let { userDetail } = this.state;
      if (userDetail != null) {
        userDetail = JSON.parse(userDetail);
        this.setState({
          userName: userDetail.firstName
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
    const { userName } = this.state;
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
                <form class="form-inline mr-auto">
                  <div class="search-element">
                    <input class="form-control" type="search" placeholder="Search" aria-label="Search" data-width="200" />
                    <button class="btn" type="submit">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </form>
              </li>
            </ul>
          </div>
          <ul class="navbar-nav navbar-right">

            <li class="dropdown"><a href="#" data-toggle="dropdown"
              class="nav-link dropdown-toggle nav-link-lg nav-link-user">
              <img alt="image" src="assets/img/user.png"
                class="user-img-radious-style" />
              <span class="d-sm-none d-lg-inline-block"></span></a>
              <div class="dropdown-menu dropdown-menu-right pullDown">
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
