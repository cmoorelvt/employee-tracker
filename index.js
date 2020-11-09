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
    });
}

function viewAllEmp() {
    let query = "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ', m.last_name) AS manager FROM employee e :EFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id + role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    connection.query(query, function(err, res) {
        if(err) return err;
        console.log("\n");
        console.table(res);
        mainMenu();
    });
}

function viewAllEmpByRole() {
    let roleArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query('SELECT title FROM role');
    }).then(function(roles){
        for (i = 0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }
    }).then(() => {
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to search?",
            choices: roleArr
        })
        .then((answer) => {
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE role.title = '${answer.role}' ORDER BY ID ASC`;
        connection.query(query, (err, res) => {
            if(err) return err;
            console.log("\n");
            console.table(res);
            mainMenu();
        });
        });
    });
}

function viewAllEmpByDept() {
    let deptArr = []
        promisemysql.createConnection(connectionProperties
            ).then((conn) => {
                return conn.query('SELECT name FROM department');
            }).then(function(value) {
                deptQuery = value;
                for (i = 0; i < value.length; i++){
                    deptArr.push(value[i].name);
                }
            })
            .then(() => {
                inquirer.prompt({
                    name: "department",
                    type: "list",
                    message: "Which dept would you like to search for?",
                    choices: deptArr
                })
            }).then((answer) => {
                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
                connection.query(query, (err, res) => {
                    if(err) return err;
                    console.log("\n");
                    console.table(res);
                    mainMenu();
                });
            });
}