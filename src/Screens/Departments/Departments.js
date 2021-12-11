import React, { Component } from 'react'
import Bridge from '../../Middleware/Bridge';
import Datatable from "../../Components/Datatable/Datatable";
import swal from 'sweetalert';
import '../commonStyle.css';


export default class Departments extends Component {
    constructor(props){
        super(props);
        this.state={
            departmentsData :[],
            name:null,
            errorName:'',
            DepartmentButtonState:true,
            editId:null,
            index:null,
            column: [
                {
                    Header: "Name",
                    accessor: "name"
                },
               {
                    Header: "Edit",
                    accessor: "name",
                    Cell: (d) => this.editDepartment(d),
                },
                {
                    Header: "Delete",
                    accessor: "delete",
                    Cell: (d) => this.deleteDepartment(d),
                },
            ]
        }
    }

    async componentDidMount(){
        try {
            const result = await Bridge.getDepartments();
            if(result.status===200){
                this.setState({departmentsData:result.data})
            }else if(result.status===500){
                swal('Something went wrong !!!')
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    editDepartment=(d)=>{
        let value = d;
        return (
          <center>
            <button
              type="button"
              className="btn btn-info"
              data-toggle="modal"
               data-target="#addvendar"
               onClick={() => this.editionDepartment(value)}
            >
              Edit
            </button>
          </center>
        );
    }

    editionDepartment=async(d)=>{
        this.setState({
            name : d.original.name,
            DepartmentButtonState:false,
            index:d.index,
            editId:d.original._id
        })
    }

    deleteDepartment=(d)=>{
        return (
            <center>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => this.deletionDepartment(d)}
          >
            Delete
          </button>
          </center>
        );
    }

    deletionDepartment = async (value) => {
        const previousData = [...this.state.departmentsData];
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
                        const result = await Bridge.deleteDepartment({ _id: value.original._id })
                        if (result.status === 200) {
                            this.setState({ departmentsData: Data });
                            swal("Poof! Your Data has been deleted!", {
                                icon: "success",
                            });
                        }

                    } else {
                        swal("Your Data  is safe!");
                    }
                });

        } catch (error) {
            this.setState({ departmentsData: previousData });
            console.log(error);
        }
    }

    handleChange=async(e)=>{
        this.setState({
            [e.target.name] : e.target.value
        })
    };

    addDepartment=async()=>{
        const{name}=this.state;
        try {
            if(!name){
                swal('Please enter the name')
                return false;
            }
            const formdata = { name : name }
            const result = await Bridge.addDepartment(formdata);
            if(result.status===200){
                let insertDepartment = result.data;
                const AppendDepartment = [insertDepartment,...this.state.departmentsData];
                this.setState({
                    departmentsData:AppendDepartment,
                    name:'',
                    errorName:''
                })
                swal('Department added successfully')
            }else if(result.status===409){
                swal('Department were already exists')
            }
        } catch (error) {
            console.log(error)
            //TODO: handle error
        }
    }

    updateDepartment=async()=>{
        try {
            const{name,editId,index}=this.state;
            if(!name){
                swal('Please enter the name')
                return false;
            }
            const formdata = {_id : editId ,name : name }
            const result = await Bridge.editDepartment(formdata);
            if(result.status===200){
                const upadateDepartment = [...this.state.departmentsData];
                upadateDepartment[index].name = result.data.name;
                this.setState({
                    name:'',
                    departmentsData:upadateDepartment,
                    DepartmentButtonState:true,
                });
                swal('Department updated successfully')
            }
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const{DepartmentButtonState}=this.state;
        return (
            <React.Fragment>
            <div class="main-content">
            <section class="section">
               <div class="section-body">
               <div class="row">
               <div class="col-12">
               <div class="card">
               <div class="card-header">
               <h3>Department</h3>
               </div>
              
               <div class="card-body">
                
               <div className="row form-group">
               <div className="col-sm-2"></div>
               <div className="col-sm-2">
               <label class="labell2">Department Name</label>
               </div>
               <div className="col-sm-4">
               <input type="text"
               class="form-control"
               placeholder="Enter the name"
               onChange={this.handleChange}
               value={this.state.name}
               name="name"/>
               </div>
               <div className="col-sm-3"> <span class="errormsg">{this.state.errorName}</span> </div>
               </div>

               <div class="row form-group">
               <div className="col-sm-4"></div>
               <div className="col-sm-4">
               <button type="button"
               style={{width:'100%'}} 
               onClick={ DepartmentButtonState === true ? this.addDepartment : this.updateDepartment  }
               class="btn btn-primary m-t-15 waves-effect">
                   {DepartmentButtonState === true ? "Add Department" : "Update Department" }
                   </button>
               </div>
               <div className="col-sm-4"></div>
               </div>

               <div className="row form-group">
               <div className="col-sm-12">
               {this.state.departmentsData.length ? (
                   <Datatable
                   data={this.state.departmentsData}
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
