import AddEmployee from '@/Layout/Employees/AddEmployee'
import EditEmployee from '@/Layout/Employees/EditEmployee';
import React, { useState } from 'react'
const EmployeeFunctions = [
  {
    name: "Add Employee",
    comp: <AddEmployee />
  },
  {
    name: "Edit Employee",
    comp: <EditEmployee />
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
      <div className='w-[80vw] h-screen py-4 px-3 '>
        <select name="" id=""  onChange={(e) => handleSelectChange(e)}>
          {EmployeeFunctions.map(func=>(
            <option key={func.name}>{func.name}</option>
          ))}
        </select>
        {/* Add EMpl */}
        
        {/* Get ALl emp */}

        {/* Edit Role change */}

        <div style={{ marginTop: "20px" }}>
          {selectedComponent}
        </div>
      </div>
    )
}

export default Employee