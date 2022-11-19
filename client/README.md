# Shift Scheduler

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### About this project

This small application allows the user to set a selected nurse to a selected shift, provided that nurse has the appropriate qualifications and is not already assigned to an overlapping shift. 

### Supporting libraries/packages used

- React-Select provides a customizable and attractive select component for the dropdowns used in the shift assignment form
- React-Table provides a simple table to render the shift data 

### Improvements
- Styling improvements
  - Make table header and Set Shift Assignment button sticky 
  - Improve responsive design
- Accessibilty improvements
  - Respond to different keystrokes (i.e. escape key to exit modal)
- Additional feature ideas
  - Column sort could be useful
  - Instead of form validators, shift selector could populate with only the appropriate shifts based on nurse selection and vice versa 
  
