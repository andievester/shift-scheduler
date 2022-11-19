import { ShiftTable } from './components/ShiftTable';
import React, { useState, useEffect, useMemo } from 'react';
import { getShifts, getNurses } from './utils/ShiftDataMethods';
import SetShiftAssignment from './components/SetShiftAssignment';
import './App.scss';

function App() {
  const [shiftData, setShiftData] = useState([]);
  const [error, setError] = useState(null);
  const [nurseData, setNurseData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const updateShiftData = (shiftData) => {
    setShiftData(shiftData);
  }

  useEffect(() => {
    getShifts()
    .then(
        (data) => {
            setShiftData(data);
        },
        (error) => {
            setError(error);
        }
    )
  }, []); 

  useEffect(() => {
    getNurses()
    .then(
        (data) => {
            setNurseData(data);
        },
        (error) => {
            setError(error);
        }
    )
  }, []);

  const columns = useMemo(() => [
        {
          Header: "Shift",
          accessor: "name",
        },
        {
          Header: "Start Time",
          accessor: "start",
        },
        {
          Header: "End Time",
          accessor: "end",
        },
        {
          Header: "Certification Required",
          accessor: "qual_required",
        },
        {
          Header: "Assigned Nurse",
          accessor: "nurse_name"
        }
  ],[]);

  const transformDate = (date) => {
    return new Date(date).toLocaleString();
  }

  shiftData.forEach((shift) => {
      shift.start = transformDate(shift.start);
      shift.end = transformDate(shift.end);

      const shiftNurse = nurseData.find((nurse) => nurse.id === shift.nurse_id);
      if (shiftNurse) {
          shift.nurse_name = shiftNurse.first_name + " " + shiftNurse.last_name + ", " + shiftNurse.qualification
      }
  });

  if (error) {
      return <div className="error">Error: Could not fetch data</div>;
  } else {
      return (
        <div className="app-container">
          <div className="button-container">
            <button className="set-shift-button" 
            type="button"
            onClick={() => setIsOpen(true)}
            >Set Shift Assignment
            </button>
          </div>
          {isOpen && <SetShiftAssignment setIsOpen={setIsOpen} nurseData={nurseData} shiftData={shiftData} updateShiftData={updateShiftData}/>}
          <div>
            < ShiftTable columns={columns} data={shiftData}/>
          </div>
        </div>
      );
    }
  }

export default App;
