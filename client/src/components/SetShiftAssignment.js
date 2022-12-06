import React, { useState, useEffect } from 'react';
import ReactPortal from './ReactPortal';
import Select from 'react-select';
import { assignShift, validateAssignment } from '../utils/ShiftDataMethods';

const SetShiftAssignment = ({ setIsOpen, nurseData, shiftData, updateShiftData }) => {
    const [nurse, setNurse] = useState();
    const [shift, setShift] = useState();
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    let disableButton = false;

    if (!nurse || !shift || formErrors.nurse || formErrors.shift) {
        disableButton = true;
    }

    const getShiftOptions = (shift) => {
        const option = {value: "", label: ""};
        option.value = shift.id;
        option.label = shift.name;

        return option;
      }

    const getNurseOptions = (nurse) => {
        const option = {value: "", label: ""};
        option.value = nurse.id;
        option.label = `${nurse.first_name} ${nurse.last_name}, ${nurse.qualification}`

        return option;
    }

    const selectorStyles = {
        control: (styles, state) => ({ ...styles, backgroundColor: '#FFFFFF', textColor: 'black', border: state.isSelected || state.isFocused? '1.5px solid #6366F1' : '1.5px solid black', "&:hover": {
            borderColor: '#6366F1'
          }
        }),
        singleValue: (styles) => ({ ...styles, color: 'black'}),
        option: (styles, state) => ({ ...styles, color: state.isSelected ? '#6366F1' : 'black', backgroundColor: state.isFocused ? '#C7D2FE' : 'white'}),
        dropdownIndicator: (styles) => ({ ...styles, color: 'black', "&:hover": {
            color: '#6366F1'
          }}),
        indicatorSeparator: () => null,
    }

    const handleShiftChange = (e) => {
        setShift(e.value);
        setFormErrors(validateAssignment(e.value, nurse, shiftData, nurseData));
    };

    const handleNurseChange = (e) => {
        setNurse(e.value);
        setFormErrors(validateAssignment(shift, e.value, shiftData, nurseData));
    }; 

    const submitForm = () => {
        const requestOptions = {
            method: 'PUT',
            params: { 'shiftID': shift },
            body: { 'nurseID': nurse },
        };
            assignShift(requestOptions)
            .then(
                (data) => {
                    shiftData.forEach((shift) => {
                        if (shift.id.toString() === data.shiftID) {
                            shift.nurse_id = nurse;
                        }
                    });
                    updateShiftData(shiftData);
                    handleClose();
                },
                (error) => {
                    const errors = {};
                    errors.save = "Error saving assignment.";
                    setFormErrors(errors);
                }
            )
    } 

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmitting) {
          submitForm();
        }
      });

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validateAssignment(shift, nurse, shiftData, nurseData));
        setIsSubmitting(true);
    };

    let shiftOptions = [];
    shiftData.forEach((shift) => {
        const option = getShiftOptions(shift);
        shiftOptions.push(option);
    });

    let nurseOptions = [];
    nurseData.forEach((nurse) => {
        const option = getNurseOptions(nurse);
        nurseOptions.push(option);
    });

    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <ReactPortal wrapperId='react-portal-modal-container'>
            <div className="modal">
                <div className="modal-container">
                    <div className="x-button">
                        <button
                        onClick={handleClose}
                        >X</button>
                    </div>
                    <div className="modal-title">
                        <h1>Set Shift Assignment</h1>
                    </div>
                    <div>
                    {Object.keys(formErrors).length === 0 && isSubmitting}
                        <form
                        onSubmit={handleSubmit} noValidate
                        >
                            <div className="selector">
                                <Select
                                className="selector-control"
                                name="shift"
                                options={shiftOptions} 
                                onChange={handleShiftChange}
                                getOptionValue={(option) => option.label}
                                placeholder={"Select Shift..."}
                                styles={selectorStyles}
                                />{formErrors.shift && (
                                    <span className="error">{formErrors.shift}</span>
                                )}
                            </div> 
                            <div className="selector">
                                <Select
                                className="selector-control"
                                name="nurse"
                                options={nurseOptions} 
                                onChange={handleNurseChange}
                                getOptionValue={(option) => option.label}
                                placeholder={"Select Nurse..."}
                                styles={selectorStyles}
                                />
                                {formErrors.nurse && (
                                <span className="error">{formErrors.nurse}</span>
                            )}
                            </div> 
                            <div className="modal-footer">
                                <button
                                disabled={disableButton}
                                type="submit"
                                >Save Assignment</button>
                                <button 
                                onClick={handleClose}
                                id="cancelBtn"
                                >Cancel
                                </button>
                            </div>
                            {formErrors.save && (
                                <span className="error">{formErrors.save}</span>
                                )}
                        </form>
                    </div>
                    
                </div>
            </div>
        </ReactPortal>
        
      );
}

export default SetShiftAssignment;