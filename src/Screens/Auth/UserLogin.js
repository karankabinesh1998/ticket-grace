import React, { Component } from 'react';
import Logo from './logo.png';
import './auth.css';
import Validators from '../../HelperComponents/Validators';
import Bridge from '../../Middleware/Bridge';
import swal from 'sweetalert';
import Loader from '../../Components/Loader/Loader';
export default class UserLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: null,
      password: null,
      errorEmail: null,
      errorPassword: null,
      isLoading :false
    }
  }

  async componentDidMount() {
    try {
      const userDetailCheck = localStorage.getItem('userDetail');
      if (userDetailCheck != null) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleChangeImput = async (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  initiateLogin = async () => {
   try {
    const { emailAddress, password } = this.state;
    const validateEmail = await Validators.emailValidation(emailAddress);
    const validatePassword = await Validators.passwordValidation(password);
    if (validateEmail == null) {
      this.setState({ errorEmail: null });
    } else {
      this.setState({ errorEmail: validateEmail });
      return false;
    }
    if (validatePassword == null) {
      this.setState({ errorPassword: null });
    } else {
      this.setState({ errorPassword: validatePassword });
      return false;
    }
    const formdata = new FormData();
    formdata.append('email', emailAddress);
    formdata.append('password', password);
    let data = {
      email: emailAddress,
      password: password
    };
      this.setState({
        isLoading : true
      })
     const resultData = await Bridge.userLogin(data, (result) => {
       if (result.status === 200) {
         localStorage.setItem('token', result.data.token);
         localStorage.setItem('userDetail', JSON.stringify(result.data));
         localStorage.setItem('roles', JSON.stringify(result.data.roles[0]));
         window.location.href = '/dashboard';
       } else {
         swal(result.message)
       }
       this.setState({
        isLoading : false
      })
     });
    
   } catch (error) {
     console.log(error);
   }
  };

  render() {
    const { emailAddress, password, errorEmail, errorPassword , isLoading } = this.state;
    return (
      <React.Fragment>
        {isLoading ? <Loader /> : null }
        
        <div id="app">
          <section class="section">
            <div class="container mt-5">
              <div class="row">
                <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
                  <div class="card card-primary">
                    <img className='loginImage' src={Logo} alt='logoImg' />
                    <div class="card-header">
                      <h4>Login</h4>
                    </div>
                    <div class="card-body">
                      <form method="POST" action="#" class="needs-validation" novalidate="">
                        <div class="form-group">
                          <label for="email">Email</label>
                          <input id="email" type="email" class="form-control" name="emailAddress" tabindex="1" value={emailAddress} onChange={this.handleChangeImput} />
                          <div class="error-feedback">{errorEmail}</div>
                        </div>
                        <div class="form-group">
                          <div class="d-block">
                            <label for="password" class="control-label">Password</label>
                            <div class="float-right">
                              <a href="#" class="text-small">
                                Forgot Password?
                              </a>
                            </div>
                          </div>
                          <input id="password" type="password" class="form-control" name="password" tabindex="2" value={password} onChange={this.handleChangeImput} />
                          <div class="error-feedback">{errorPassword}</div>
                        </div>
                        {/* <div class="form-group">
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" name="remember" class="custom-control-input" tabindex="3" id="remember-me" />
                            <label class="custom-control-label" for="remember-me">Remember Me</label>
                          </div>
                        </div> */}
                        <div class="form-group">
                          <button type="button" onClick={this.initiateLogin} class="btn btn-primary btn-lg btn-block" tabindex="4">
                            Login
                          </button>
                        </div>
                      </form>
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
