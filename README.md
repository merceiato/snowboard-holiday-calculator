# Snowboarding Holiday Budget Calculator

## Description
The Snowboarding Holiday Budget Calculator is an interactive web application that helps users plan their snowboarding trips by calculating total costs and comparing them against a user-defined budget. Users can select locations, budget tiers, and equipment options, specify custom costs if needed, and input travel dates. The app dynamically calculates expenses and provides a detailed breakdown, displaying a happy or sad face depending on whether the budget is sufficient.

## Features
- **Customizable Inputs**:
  - Locations: Predefined options (AU Local, Interstate, Japan, Canada) and custom input.
  - Budget Tiers: Low, Mid, High, or custom.
  - Equipment Options: Hire, Gear Transport, N/A, or custom.
- **Interactive Calculations**:
  - Automatically calculates costs based on trip details.
  - Option to input custom costs for flexibility.
- **Dynamic Feedback**:
  - Displays happy or sad face images based on budget outcome.
- **User-Friendly Design**:
  - Simple and responsive interface with a snow-capped mountain theme.
  - Hover and click effects for enhanced user experience.
- **Informative Dialogue**:
  - Provides details on budget tier options via a popup dialogue.

## Folder Structure

project-folder/
│
├── index.html
├── styles.css
├── main.js
└── images/
    ├── background.jpg (Snow-capped mountains)
    ├── happy_face.jpg
    └── sad_face.jpg


## How to Use
### 1. **Unzip the Project Folder**
   Extract the contents of the project folder to your desired location.

### 2. **Run a Local Server**
   Use Python’s built-in HTTP server to serve the application locally:
   - Open a terminal or command prompt in the project folder.
   - Run the following command:
     
     python3 -m http.server
     
   - Navigate to `http://localhost:8000` in your browser to load the application.

### 3. **Open the Application**
   - Load the `index.html` file in your browser.

### 4. **Fill in the Form**
   - Enter your budget and trip details:
     - Select a location or input custom costs.
     - Choose a budget tier or provide custom costs for food and transfers.
     - Decide on equipment options or specify custom costs.
     - Pick a date range for your trip.

### 5. **Calculate Costs**
   - Press the "Calculate" button to view the results.

### 6. **View Results**
   - Review the detailed breakdown of costs:
     - Accommodation
     - Transport
     - Lift Tickets
     - Food
     - Transfers
     - Equipment
   - Compare the total cost against your budget.

### 7. **Reset**
   - Refresh the page to reset all inputs.

## Notes
- **Custom Fields**:
  - Additional fields appear dynamically when "Custom" is selected in any dropdown.
- **Budget Tier Details**:
  - Click the "?" button next to the Budget Tier dropdown to view descriptions of each tier.
- **Browser Compatibility**:
  - For optimal performance, use the latest version of Chrome, Firefox, or Edge.
- **Local Server Requirement**:
  - Ensure the application is served via a local server to load assets correctly (e.g., images).

## Future Enhancements
- Add a reset button for clearing inputs without refreshing the page.
- Include more predefined locations and budget tiers.
- Add accessibility features for improved usability.

Enjoy planning your snowboarding trip!