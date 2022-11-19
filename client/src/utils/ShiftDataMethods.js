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

