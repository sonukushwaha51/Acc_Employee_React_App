import React, { useRef, useState } from "react";
import { Button } from "reactstrap";

function Employee() {

    const [employee,setEmployee] = useState([]);
    const [employeeById,setEmployeeById] = useState({
    });
    const [errorMessage,setErrorMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState({
        statusCode: 200,
        message: "Employee Removed from record."
    });
    const myRef = useRef("1001");
    const delRef = useRef();
    const allTabs = document.querySelectorAll(".tab-content");
    const getAllEmployees = () => {
        allTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        const allemployeesTab = document.querySelector(".tab-content.all-employees-tab");
        allemployeesTab.classList.add("active");
        fetch("http://localhost:9090/employees/allemployees").then(result => result.json()).then(emp => setEmployee(emp))
        console.log(employee)
    }
    const getEmployeeById = () => {
        allTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        const employeesTab = document.querySelector(".tab-content.employee-by-id-tab");
        employeesTab.classList.add("active");  
    }
    
    const delEmployeeById = () => {
        allTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        const employeesTab = document.querySelector(".tab-content.remove-employee-by-id-tab");
        employeesTab.classList.add("active");
        
    }

    const searchEmployee = () => {
        const searchResult = document.querySelector(".employee-information");
        searchResult.classList.add("active");
        setEmployeeById({});
        fetch(`http://localhost:9090/employees/employeeid/${myRef.current.value}`).then(res => {
            if(res.ok) {return res.json()}
            return Promise.reject(res);
        }).then(emp => setEmployeeById(emp))
        .catch(error => error.json().then(err => setErrorMessage(err.message)));
        console.log(errorMessage);
        console.log(employeeById);
    }

    const deleteEmployee = () => {
        const searchResult = document.querySelector(".deletion-confirmation");
        fetch(`http://localhost:9090/employees/deleteemployee/${delRef.current.value}`,{
            method: "DELETE",
        }).then(response => {
            if(response.ok) { return response.json() } 
            return Promise.reject(response);
        }).then(success => setDeleteMessage(success)).catch(error => error.json().then(message => setDeleteMessage(message)))
        searchResult.classList.add("active");
    }
    return(
        <React.Fragment>
            <div className="container">
                <div className="row">
                    <h1>Employee Details Page:</h1>
                        <div className="action-buttons">
                            <Button color="primary" className="btn-primary all-employees-button" onClick={getAllEmployees}>Get list of all employees</Button>
                            <Button color="primary" className="btn-primary employee-by-id-button" onClick={getEmployeeById}>Get employee BY ID</Button> 
                            <Button color="primary" className="btn-primary employee-by-id-button" onClick={getEmployeeById}>Update employee BY ID</Button>
                            <Button color="danger" className="btn-primary employee-by-id-button" onClick={delEmployeeById}>Remove Employee</Button>
                        </div>
                        <div className="tab-content all-employees-tab">
                            {employee.length > 0 ? 
                                employee.map(emp => {
                                    return(
                                        <div key={emp.employeeId} className={`employee ${emp.employeeId}`}>
                                            <h2>Employee Name: {emp.employeeName}</h2>
                                            <h3>Contact: {emp.contact}</h3>
                                        </div>
                                    )
                                }) : <p>No Employees Found</p>
                            }
                        </div>
                        <div className="tab-content employee-by-id-tab">
                            <div className="employee-input-field">
                                <label htmlFor="text-field" className="employee-search-label">Enter employee Id:</label>
                                <input ref={myRef} type="text" className="employee-search-text-field" id="text-field" placeholder="Enter Employee ID"/>
                                <Button color="primary" className="btn-primary search-employee" onClick={searchEmployee}>Search Employee</Button>
                            </div>
                            <div className="employee-information"> 
                                {Object.keys(employeeById).length !== 0 ?
                                    <div>
                                        <h2>Employee Name: {employeeById.employeeName}</h2>
                                        <h3>Contact: {employeeById.contact}</h3>
                                    </div>
                                : <p className="not-found-error-message">{errorMessage}</p>
                                }
                            </div>
                        </div>
                        <div className="tab-content update-employee-by-id-tab"> 
                            
                        </div>
                        <div className="tab-content remove-employee-by-id-tab">
                            <div className="employee-input-field">
                                <label htmlFor="text-field" className="employee-search-label">Enter employee Id:</label>
                                <input ref={delRef} type="text" className="employee-search-text-field" id="text-field" placeholder="Enter Employee ID"/>
                                <Button color="primary" className="btn-primary search-employee" onClick={deleteEmployee}>Remove Employee</Button>
                                <p className="deletion-confirmation not-found-error-message">{deleteMessage.message}</p>
                            </div>
                        </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Employee;