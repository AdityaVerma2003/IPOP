import React, { useState } from 'react';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoIosRemoveCircleOutline } from "react-icons/io";

const inputTypes = ['text', 'number', 'date', 'select'];

const AdminGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [fields, setFields] = useState([
    { fieldName: '', fieldType: 'text', fieldOptions: [] },
  ]);

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    if (key === 'fieldOptions') {
      // Split the input string into an array of trimmed values
      updatedFields[index][key] = value.split(',').map(opt => opt.trim());
    } else {
      updatedFields[index][key] = value;
    }
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([...fields, { fieldName: '', fieldType: 'text', fieldOptions: [] }]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const groupData = { groupName, fields };
    console.log('Group Data:', groupData);

    axios.post('http://localhost:3000/api/groups', groupData)
      .then((response) => {
        console.log('Group created successfully:', response.data);
        alert('Group created successfully!');
        setGroupName('');
        setFields([{ fieldName: '', fieldType: 'text', fieldOptions: [] }]);
      })
      .catch((error) => {
        console.error('Error creating group:', error);
      });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded shadow flex flex-col mt-20 mb-20">
      <h1 className="text-3xl font-bold mb-6 text-center ">Admin Group Form</h1>
      <h2 className="text-xl font-bold mb-4">Create a Group</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Group Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
        </div>

        {fields.map((field, index) => (
          <div key={index} className="mb-4 border p-3 rounded">
            <label className="block mb-1 font-medium">Field Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded mb-2"
              value={field.fieldName}
              onChange={(e) => handleFieldChange(index, 'fieldName', e.target.value)}
              required
            />

            <label className="block mb-1 font-medium">Input Type</label>
            <select
              className="w-full border px-3 py-2 rounded mb-2"
              value={field.fieldType}
              onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
            >
              {inputTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {field.fieldType === 'select' && (
              <div>
                <label className="block mb-1 font-medium">Dropdown Options (comma-separated)</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={field.fieldOptions}
                  onChange={(e) => handleFieldChange(index, 'fieldOptions', e.target.value)}
                />
              </div>
            )}
            <div className="mt-6 text-center align-center flex justify-between flex-row">

              <button
                type="button"
                onClick={addField}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center flex-row"
              >
                <IoIosAddCircleOutline /> Add Field
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center flex-row"
                onClick={() => removeField(index)}
                disabled={fields.length === 1}
              >
               <IoIosRemoveCircleOutline /> Remove Field
              </button>

            </div>


          </div>



        ))}



        <div className="mt-6 text-center align-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Group
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminGroupForm;
