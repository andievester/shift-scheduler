export const getShifts = async () => {
    const resp = await fetch("/shifts");
    if (resp.status === 200)
        return resp.json();
    else
        throw new Error("Error retrieving data.");
};

export const getNurses = async () => {
    const resp = await fetch("/nurses");
    if (resp.status === 200)
        return resp.json();
    else
        throw new Error("Error retrieving data.");
};

export const assignShift = async (req) => {
    const resp = await fetch(`/shifts/${req.params.shiftID}`, req);
    if (resp.status === 200)
        return resp.json();
    else
        throw new Error("Error retrieving data.");
};

export const validateAssignment = (selectedShiftID, selectedNurseID, shiftData, nurseData) => {
    let errors = {};

        const validateQualification  = "Not qualified for selected shift."
        const validateShiftOverlap = "Overlap with one or more current assigned shifts."
        const alreadyScheduled = "Already scheduled for selected shift."

        const selectedShift = shiftData.find((shift) => shift.id === selectedShiftID);
        const selectedNurse = nurseData.find((nurse) => nurse.id === selectedNurseID);

        if (selectedShift && selectedShift.qual_required === "RN") {
            if (selectedNurse && selectedNurse.qualification !== "RN") {
                errors.nurse = validateQualification ;
            }
        } else if (selectedShift && selectedShift.qual_required === "LPN") {
            if (selectedNurse && selectedNurse.qualification === "CNA") {
                errors.nurse = validateQualification ;
            }
        } 

        let alreadyAssignedShifts = shiftData.filter((s) => s.nurse_id === selectedNurseID);
        if (selectedShift) {
            alreadyAssignedShifts.forEach((s) => {
                const assignedShiftStart = new Date(s.start);
                const assignedShiftEnd = new Date(s.end);
                const selectedShiftStart = new Date(selectedShift.start);
                const selectedShiftEnd = new Date(selectedShift.end);
    
                if ((selectedShiftEnd > assignedShiftStart && selectedShiftEnd < assignedShiftEnd)
                    || (selectedShiftStart > assignedShiftStart && selectedShiftStart < assignedShiftEnd)) {
                        errors.shift = validateShiftOverlap;
                }
                if (selectedShiftEnd === assignedShiftEnd && selectedShiftStart === assignedShiftStart) {
                    errors.nurse = alreadyScheduled;
                }
            });
        }
        
        return errors;
}

