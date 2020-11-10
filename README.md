# Unit 12 MySQL Homework: Employee Tracker

Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as **C**ontent **M**anagement **S**ystems. In this homework assignment, your challenge is to architect and build a solution for managing a company's employees using node, inquirer, and MySQL.

## Instructions
---
1. Run `npm install` to install all dependencies
2. Run `schema.sql` in MySQLWorkbench
    * (Optional) Run `seeds.sql` in MySQLWorkbench
3. Edit MySQL connection properties in the `connectionProperties` object in `employee-tracker.js`
  
## Usage
---
1. Run `node index` to start the application
2. Select from the menu to view, add, remove, or update employees, roles, departments, or managers
3. Follow prompt if presented

## Tool & Resources
---
* [Node.js](https://nodejs.org/en/)
* [MySQLWorkbench](https://www.mysql.com/products/workbench/)
    ### Dependencies
    ---
    * [inquirer](https://www.npmjs.com/package/inquirer) - For the CLI user interface. This will prompt user within the CLI for employee information.
    * [console.table](https://www.npmjs.com/package/console.table) - Used to print MySQL into tables to the console.
    * [mysql](https://www.npmjs.com/package/mysql) - Used to connect to the MySQL database and perform queries
    * [promise-mysql](https://www.npmjs.com/package/promise-mysql) - Used to create promises from MySQL queries 

We can frame this as follows:

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```
![Employee Tracker](assets/Employee-Tracker.gif)
