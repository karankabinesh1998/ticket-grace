import React from 'react';
import { BrowserRouter, Route , Switch , browserHistory } from 'react-router-dom';
import Admin from '../Screens/Admin/Admin';
import ForgotPassword from '../Screens/Auth/ForgotPassword';
import UserLogin from '../Screens/Auth/UserLogin';
import Dashboard from '../Screens/Dashboard/Dashboard';
import Departments from '../Screens/Departments/Departments';
import Header from '../Screens/Header.js/Header';
import Profile from '../Screens/Profile/Profile';
import SideNavBar from '../Screens/SideNav/SideNavBar';
import Store from '../Screens/Store/Store';
import StoreManager from '../Screens/StoreManager/StoreManager';
import AssignTicket from '../Screens/Ticket/AssignTicket';
import Ticket from '../Screens/Ticket/Ticket';
import Vendor from '../Screens/Vendor/Vendor';
import Worker from '../Screens/Worker/Worker';
import ViewTicket from '../Screens/Ticket/ViewTicket';
import TicketHistory from '../Screens/Ticket/TicketHistory';
import Evaluation from '../Screens/Evaluation/Evaluation';
import EvaluationHistory from '../Screens/Evaluation/EvaluationHistory';
import PageNotFound from '../Screens/ErrorPage/PageNotFound';


export default function Routes() {
  return (
    <BrowserRouter>
    <Switch>
      <Route
        exact
        path={'/'}
        render={(props) => (
          <React.Fragment>
            <UserLogin {...props} />
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/dashboard'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Dashboard {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/department'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Departments {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/admin'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Admin {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/storemanager'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <StoreManager {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/vendor'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Vendor {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/worker'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Worker {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/ticket'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Ticket {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/store'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Store {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/assign-ticket-labour'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <AssignTicket {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/profile'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Profile {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/forgot-password'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <ForgotPassword {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />

      <Route
        exact
        path={'/view-tickets'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <ViewTicket {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />

      <Route
        exact
        path={'/tickets-history'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <TicketHistory {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />

      <Route
        exact
        path={'/performance-evaluation'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <Evaluation {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route
        exact
        path={'/performance-evaluation-history'}
        render={(props) => (
          <React.Fragment>
            <div id="app">
              <div class="main-wrapper main-wrapper-1">
                <Header {...props} />
                <SideNavBar {...props} />
                <div className="app-body">
                  <EvaluationHistory {...props} />
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      />
      <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  )
}