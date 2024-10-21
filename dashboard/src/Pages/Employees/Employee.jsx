import AddEmployee from '@/Layout/Employees/AddEmployee'
import EditEmployee from '@/Layout/Employees/EditEmployee';
import GetAllEmployee from '@/Layout/Employees/GetAllEmployee';
import React, { useState } from 'react'
const EmployeeFunctions = [
  {
    name: "Add Employee",
    comp: <AddEmployee />
  },
  {
    name: "Edit Employee",
    comp: <EditEmployee />
  },
  {
    name: "Get All Employee",
    comp: <GetAllEmployee />
  }
];
function Employee() {
  const [selectedComponent, setSelectedComponent] = useState(<AddEmployee />);

  const handleSelectChange = (event) => {
    const selectedName = event.target.value;
    const selectedFunction = EmployeeFunctions.find(
      (func) => func.name === selectedName
    );
    console.log(selectedFunction)
    setSelectedComponent(selectedFunction.comp);
  };


    return ( 
      <div className='w-[80vw] mt-10 h-max min-h-[80vh] py-4 px-3 '>
        <select name="" id=""  onChange={(e) => handleSelectChange(e)}>
          {EmployeeFunctions.map(func=>(
            <option key={func.name}>{func.name}</option>
          ))}
        </select>
        <div style={{ marginTop: "20px" }}>
          {selectedComponent}
        </div>
      </div>
    )
}

export default Employee