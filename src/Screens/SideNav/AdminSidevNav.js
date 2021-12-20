import React from 'react';
import './side.css';
import { AiOutlineDashboard, AiOutlineFolderAdd } from 'react-icons/ai';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import { TiTicket } from 'react-icons/ti';
import { BsGraphUp } from 'react-icons/bs';
import { MdOutlineLocalGroceryStore } from 'react-icons/md';

export default function AdminSidevNav() {
    return (
        <div class="main-sidebar sidebar-style-2">
        <aside id="sidebar-wrapper">
          <div class="sidebar-brand">
            <a href="/dashboard"> <img alt="image" src="assets/logo_grace.jpeg" class="header-logo" /> <span
              class="logo-name">Grace Super Market</span>
            </a>
          </div>
          <ul class="sidebar-menu">
            <li class="menu-header">Menu</li>
            <li class="dropdown active">
              <a href="/dashboard" class="nav-link">
                <AiOutlineDashboard size={24} style={{ width: '20px', color: 'black' }} />
                <span class="Sidenav" >Dashboard</span></a>
            </li>
            <li class="dropdown">
              <a href="#" class="menu-toggle nav-link has-dropdown"> <HiOutlineOfficeBuilding size={24} style={{ width: '20px', color: 'black' }} />
                <span class="Sidenav">Departments</span></a>
              <ul class="dropdown-menu">
                <li><a class="nav-link" href="/department">Add Department</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="menu-toggle nav-link has-dropdown"> <MdOutlineLocalGroceryStore size={24} style={{ width: '20px', color: 'black' }} />
                <span class="Sidenav">Store</span></a>
              <ul class="dropdown-menu">
                <li><a class="nav-link" href="/store">Add Store</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="menu-toggle nav-link has-dropdown">
                <AiOutlineFolderAdd size={24} style={{ width: '20px', color: 'black' }} /> <span class="Sidenav">
                  Staffs</span></a>
              <ul class="dropdown-menu">
                <li><a class="nav-link" href="/storemanager">Add Store Manager</a></li>
                <li><a class="nav-link" href="/vendor">Add Vendor</a></li>
                <li><a class="nav-link" href="/worker">Add Worker</a></li>
              </ul>
            </li>

            <li class="dropdown">
              <a href="#" class="menu-toggle nav-link has-dropdown"><TiTicket size={24} style={{ width: '20px', color: 'black' }} />
                <span class="Sidenav">
                  Tickets </span></a>
              <ul class="dropdown-menu">
                <li><a class="nav-link" href="/ticket">Add Tickets</a></li>
                <li><a class="nav-link" href="/assign-ticket-labour">Assign Tickets</a></li>
                <li><a class="nav-link" href="/view-tickets">View Tickets</a></li>
                <li><a class="nav-link" href="/tickets-history">Tickets History</a></li>
              </ul>
            </li>
            <li class="dropdown">
              <a href="#" class="menu-toggle nav-link has-dropdown"><BsGraphUp size={24} style={{ width: '20px', color: 'black' }} />
                <span class="Sidenav">
                  Performance Evaluation </span></a>
              <ul class="dropdown-menu">
                <li><a class="nav-link" href="/performance-evaluation">Active Evaluation</a></li>
                <li><a class="nav-link" href="/performance-evaluation-history">Evaluation History</a></li>
                 </ul>
            </li>
          </ul>
        </aside>
      </div>

    )
}
