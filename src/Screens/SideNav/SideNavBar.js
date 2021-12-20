import React, { Component } from 'react';
import AdminSidevNav from './AdminSidevNav';
import StoreManagerSideNav from './StoreManagerSideNav';
import SuperAdminSideNav from './SuperAdminSideNav';
import VendorSideNav from './VendorSideNav';


export default class SideNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails : localStorage.getItem("userDetail") ? JSON.parse(localStorage.getItem("userDetail")) : null ,
      role : localStorage.getItem("roles") ? JSON.parse(localStorage.getItem("roles")) : null 
    }
  };


  GotoLoginPage = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetail');
    localStorage.removeItem('roles');
    window.location.href = '/';
  }

  render() {
    const { role }=this.state;
     return (
      <React.Fragment>
        {
          role?.name === 'super_admin' ? <SuperAdminSideNav />  : 

          role?.name === 'admin' ? <AdminSidevNav /> : 

          role?.name === 'store_manager' ? <StoreManagerSideNav /> :

          role?.name === 'vendor' ? <VendorSideNav /> : 

          this.GotoLoginPage()

        }

      </React.Fragment>
    )
  }
}
