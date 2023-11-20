# Data Analysis Tool

## Introduction

In this readme, we will demonstrate three exciting features that should allow scientists to analyze their data and derive valuable insights.

## Features

### 1. Custom Formula

**Feature Overview:** New columns can be added to the table based on a custom formula.

**How to Use:**

1. Click on the "Custom Formula" button.
2. Define the formula, e.g., "Cell Density * Volume."
3. Input validation will show you if the column exists within the data table, and will also autosuggest columns for you.
4. The new column, "Cell Density * Volume" will be automatically populated with the calculated values.

### 2. Column Aggregations

**Feature Overview:** Column aggregations allow users to perform summary calculations on specific columns, such as determining the maximum cell count within their dataset.

**How to Use:**

1. Click on the "Aggregations" option.
2. Choose the desired aggregation type from a dropdown menu, e.g., "Max."
3. Choose the desired column from a dropdown menu
4. The new aggregation value will be displayed in a new table below

### 3. Rate of Change Calculations

**Feature Overview:** The Rate of Change calculation feature allows scientists to track how a specific metric, such as Cell Count, changes over time.

**How to Use:**

1. Click on the "Rate of Change" button.
2. Choose the desired column from a dropdown menu
3. Choose a desired intial and final time from two dropdown menus
4. The new rate of change value will be displayed in a new table below


## Improvements

While the MVP showcases the essential functionality, there are several possible improvements to consider:

1. **Backend Database:** Implement a backend server to allow users to save their data analysis,  can be a simple express server with a mongoDB database. Authentication and authorization will be highly important.

2. **Advanced Aggregation:** Provide more advanced aggregation calculation, such as finding the maximum cell count between a certain time interval.
   
3. **User Interface Enhancements:** Refine the user interface for better usability and intuitive access to the new features. For instance, I wanted to implement a feature that would allow users to select columns from the table itself, as well as the option to use the dropdown menus or typing. 

2. **Custom Formula Builder:** Implement a visual formula builder to simplify the process of creating calculation columns.

3. **Data Export:** Allow users to export the calculated data for further analysis outside of Opvia.
