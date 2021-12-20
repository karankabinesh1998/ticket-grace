import React, { Component } from 'react'
import Bridge from '../../Middleware/Bridge';
import Datatable from "../../Components/Datatable/Datatable";
import swal from 'sweetalert';
import '../commonStyle.css';
import Loader from '../../Components/Loader/Loader';
import moment from 'moment';


export default class Store extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeData: [],
      name: null,
      address: null,
      errorName: '',
      storeButtonState: true,
      editId: null,
      index: null,
      column: [
        {
          Header: "Name",
          accessor: "name"
        },
        {
          Header: "Address",
          accessor: "address"
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
          accessor: "name",
          Cell: (d) => this.editStore(d),
        },
        {
          Header: "Delete",
          accessor: "delete",
          Cell: (d) => this.deleteStore(d),
        },
      ],
      isLoading:false
    }
  }

  async componentDidMount() {
    try {
      this.setState({ isLoading : true })
       await Bridge.getStores(result=>{
        if (result.status === 200) {
          this.setState({ storeData: result.data })
        } else{
          swal(result.message)
        }
        this.setState({ isLoading :false })
      });

    } catch (error) {
      console.log(error)
    }
  }

  editStore = (d) => {
    let value = d;
    return (
      <center>
        <button
          type="button"
          className="btn btn-info"
          data-toggle="modal"
          data-target="#addvendar"
          onClick={() => this.editionStore(value)}
        >
          Edit
        </button>
      </center>
    );
  }

  editionStore = async (d) => {
    this.setState({
      name: d.original.name,
      address: d.original.address,
      storeButtonState: false,
      index: d.index,
      editId: d.original._id
    })
  }

  deleteStore = (d) => {
    return (
      <center>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => this.deletionStore(d)}
        >
          Delete
        </button>
      </center>
    );
  }

  deletionStore = async (value) => {
    const previousData = [...this.state.storeData];
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
             await Bridge.deleteStore({ _id: value.original._id },result=>{

               if (result.status === 200) {
                 this.setState({ storeData: Data });
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
      this.setState({ storeData: previousData });
      console.log(error);
    }
  }

  handleChange = async (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  addStore = async () => {
    const { name , address } = this.state;
    try {
      if (!name) {
        swal('Please enter the name')
        return false;
      }
      if(!address){
        swal('Please enter the address')
        return false;
      };
      this.setState({ isLoading : true })
      const formdata = { name: name, address: address }
      await Bridge.addStore(formdata,result=>{

        if (result.status === 200) {
         this.setState({
            storeData: [result.data, ...this.state.storeData],
            name: '',
            address:''
          })
          swal('Store added successfully')
        } else{
          swal(result.message)
        }
        this.setState({ isLoading : false })
      });
    } catch (error) {
      console.log(error)
      //TODO: handle error
    }
  }

  updateStore = async () => {
    try {
      const { name, editId, index , address } = this.state;
      if (!name) {
        swal('Please enter the name')
        return false;
      };
      this.setState({ isLoading : true })
      const formdata = { _id: editId, name: name , address };
       await Bridge.editStore(formdata,result=>{

        if (result.status === 200) {
          const upadatestoreData = [...this.state.storeData];
          upadatestoreData[index] = result.data;
          this.setState({
            name: '',
            storeData: upadatestoreData,
            storeButtonState: true,
            address:''
          });
          swal('Store updated successfully')
        }else{
          swal(result.message);
        }
        this.setState({ isLoading : false })
      });
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { storeButtonState , isLoading } = this.state;
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
                      <h3>Store</h3>
                    </div>

                    <div class="card-body">

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Store Name</label>
                        </div>
                        <div className="col-sm-4">
                          <input type="text"
                            class="form-control"
                            placeholder="Enter the name"
                            onChange={this.handleChange}
                            value={this.state.name}
                            name="name" />
                        </div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-2"></div>
                        <div className="col-sm-2">
                          <label class="labell2">Store Address</label>
                        </div>
                        <div className="col-sm-4">
                          <textarea type="text"
                            class="form-control"
                            placeholder="Enter the address"
                            onChange={this.handleChange}
                            value={this.state.address}
                            name="address"> </textarea>
                        </div>
                      </div>

                      <div class="row form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                          <button type="button"
                            style={{ width: '100%' }}
                            onClick={storeButtonState === true ? this.addStore : this.updateStore}
                            class="btn btn-primary m-t-15 waves-effect">
                            {storeButtonState === true ? "Add Store" : "Update Store"}
                          </button>
                        </div>
                        <div className="col-sm-4"></div>
                      </div>

                      <div className="row form-group">
                        <div className="col-sm-12">
                          {this.state.storeData.length ? (
                            <Datatable
                              data={this.state.storeData}
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
