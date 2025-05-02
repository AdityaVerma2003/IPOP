import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoIosAddCircleOutline } from "react-icons/io";
import { GrFormNextLink } from "react-icons/gr";

const UserScreen = () => {
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [formEntries, setFormEntries] = useState([{}]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/groups')
      .then(res => setGroups(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleInputChange = (index, fieldName, value) => {
    const updated = [...formEntries];
    updated[index][fieldName] = value;
    setFormEntries(updated);
  };

  const addFormEntry = () => {
    setFormEntries([...formEntries, {}]);
  };

  const handleSubmit = () => {
    const flattenedEntries = [];
    formEntries.forEach(entryObj => {
      Object.entries(entryObj).forEach(([key, val]) => {
        flattenedEntries.push({
          fieldName: key,
          value: val
        });
      });
    });
    const data = {
        groupName: groups[currentGroupIndex].groupName,
        entries: flattenedEntries,
    }
    axios.post('http://localhost:3000/api/user', data)
      .then(res => {
        console.log('Data submitted successfully:', res.data);
        setFormEntries([{}]);
        setCurrentGroupIndex(prev => prev + 1);
      })
      .catch(err => console.error('Error submitting data:', err));
  };
  const nextGroup = () => {
    handleSubmit();
  };

  
  const currentGroup = groups[currentGroupIndex];

  if (!currentGroup) return <div className="flex flex-row justify-center align-center mt-12">
   <h1 className='font-bold text-4xl '>All Groups Completed ! Thank you for Submitting </h1> 
</div>;

  return (
    <div className="container mx-auto">
      <div>
        <h1 className='text-4xl text-center font-bold mt-8 mb-4'>User Screen</h1>
      </div>
      <h2 className="text-2xl font-bold mb-4">{currentGroup.groupName}</h2>

      {formEntries.map((entry, idx) => (
        <div key={idx} className="mb-6 p-4 border rounded shadow">
          <h4 className="font-semibold">Entry {idx + 1}</h4>

          {currentGroup.fields.map(field => (
            <div key={field.fieldName} className="mb-2">
              <label className="block mb-1">{field.fieldName}</label>

              {field.fieldType === 'select' ? (
                <select
                  className="border p-2 w-full"
                  value={entry[field.fieldName] || ''}
                  onChange={(e) => handleInputChange(idx, field.fieldName, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.fieldOptions?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.fieldType}
                  className="border p-2 w-full"
                  value={entry[field.fieldName] || ''}
                  onChange={(e) => handleInputChange(idx, field.fieldName, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    <div className="flex justify-center mt-4">
      <button onClick={addFormEntry} className="bg-green-500 text-white px-4 py-2 rounded mr-4 flex items-center">
        <IoIosAddCircleOutline /> Add More
      </button>

     {currentGroup == groups[groups.length - 1] ? (
        <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2 rounded">
          Submit
        </button>
     ) : (
        <button onClick={nextGroup} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
        Next Group <GrFormNextLink />
      </button>
     )}
    </div>
    </div>
  );
};

export default UserScreen;