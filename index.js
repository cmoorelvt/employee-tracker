const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");

const connectionProperties = {
    host: "local host",
    port: 3306,
    user: "root",
    password: "Uzumaki8!",
    database: "employees_DB"
}

const connection = mySql.createConnection(connectionProperties);

connection.connect((err) => {
    if (err) throw err;
    console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
    mainMenu();
});

function mainMenu() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "MAIN MENU",
        choices: [
            "View all employees",
            "View all employess by role",
            "View all employees by department",
            "View all employees by manager",
            "Add employee",
            "Add role",
            "Add department",
            "Update employee role",
            "Update employee manager",
            "Remove employee",
            "Remove role",
            "Remove department",
            "View department budgets"
        ]
    })

    .then((answer) => {
        switch (answer.action) {
            case "View all employees":
                viewAllEmp();
                break;
            case "View all employees by role":
                viewAllEmpByRole();
                break;
            case "View all employees by department":
                viewAllEmpByDept();
                break;
            case "View all employees by manager":
                viewAllEmpByMan();
                break;
            case "Add Employee":
                addEmp();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDept();
                break;
            case "Update employee role":
                updEmpRole();
                break; 
            case "Update employee manager":
                updEmpMan();
                break;
            case "Remove employee":
                remEmp();
                break;
            case "Remove role":
                RemRole();
                break;
            case "Remove department":
                RemDept();
                break;
            case "View department budgets":
                viewDeptBudget();
                break;

        }
    })
}