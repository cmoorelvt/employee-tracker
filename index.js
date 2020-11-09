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
            }).then(() => {
                inquirer.prompt({
                    name: "department",
                    type: "list",
                    message: "Which dept would you like to search for?",
                    choices: deptArr
                }).then((answer) => {
                const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, concat(m.first_name, ' ' ,  m.last_name) AS Manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = '${answer.department}' ORDER BY ID ASC`;
                connection.query(query, (err, res) => {
                    if(err) return err;
                    console.log("\n");
                    console.table(res);
                    mainMenu();
                });
            });
        });
}

function viewAllEmpByMan() {
    let managerArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e INNER JOIN employee m ON e.manager_id = m.id");
    }).then(function(managers) {
        for (i = 0; i < managers.length; i++) {
            managerArr.push(managers[i].manager);
        }
        return managers;
    }).then((managers) => {
        inquirer.prompt({
            name: "manager",
            type: "list",
            message: "Which manager would oyu like to search?",
            choices: managerArr
        })
        .then((answer) => {
            let managerID;
            for (i = 0; i < managers.length; i++){
                if (answer.manager == managers[i].manager){
                    managerID = managers[i].id;
                }
            }
            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager from employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE e.manager_id = ${managerID};`;
            connection.query(query, (err, res) => {
                if (err) return err;
                console.log("\n");
                console.table(res);
                mainMenu();
            });
        });
    });
}

function addEmp() {
    let roleArr = [];
    let managerArr = [];
    promisemysql.createConnection(connectionProperties
        ).then((conn) => {
            return Promise.all([
                conn.query('SELECT id, title FROM role ORDER BY title ASC'),
                conn.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name AS employee FROM employee ORDER BY employee ASC")
            ]);
        }).then(([roles, managers]) => {
            for (i = 0; i < roles.length; i++){
                roleArr.push(roles[i].title);
            }
            for (i = 0; i < managers.length; i++){
                managerArr.push(managers[i].Employee);
            }
            return Promise.all([roles, managers]);
        }).then(([roles, managers]) => {
            managerArr.unshift('--');
            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "First Name: ",
                    validate: function(input){
                        if (input === ""){
                            console.log("FIELD REQUIRED");
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Last Name: ",
                    validate: function(input){
                        if (input === ""){
                            console.log("FIELD REQUIRED");
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their role?",
                    choices: roleArr
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is there manager?",
                    choices: managerArr
                }
            ]).then((answer) => {
                let roleID;
                let managerID = null;
                for (i = 0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }
                for (i = 0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employee){
                        managerID = managers[i].id;
                    }
                }
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`,
                (err, res) => {
                    if(err) return err;
                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
        });
}

function addRole() {
    let departmentArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query('SELECT id, name FROM department ORDER BY name ASC');
    }).then((departments) => {
        for (i = 0; i < departments.length; i++){
            departmentArr.push(departments[i].name);
        }
        return departments;
    }).then((departments) => {
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Role Title: "
            },
            {
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {
                name: "dept",
                type: "list",
                message: "Department",
                choices: departmentArr
            }]).then((answer) => {
                let deptID;
                for (i = 0; i < departments.length; i++){
                    if (answer.dept == departments[i].name){
                        deptID = departments[i].id;
                    }
                }
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`,
                (err, res) => {
                    if (err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainMenu();
                });
            });
    });
}

function addDept() {
    inquirer.prompt({
        name: "deptName",
        type: "input",
        message: "Department Name: "
    }).then((answer) => {
        connection.query(`INSERT INTO department (name) VALUES ("${answer.deptName}");`, (err, res) =>
        if (err) return err;
        console.log("\n DEPARTMENT ADDED...\n");
        mainMenu();
        });
    });
}

function updEmpRole() {
    let employeeArr = [];
    let roleArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS employee FROM employee ORDER BY employee ASC")
        ]);
    }).then(([roles, employees]) => {
        for (i = 0; i < roles.length; i++){
            role.Arr.push(roles[i].title);
        }
        for (i = 0; < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }
    }).then(([roles, employees]) => {
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            },
            {
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },
        ]).then((answer) => {
            let roleID;
            let employeeID;
            for (i = 0; i < roles.length; i++){
                if (answer.role == roles[i].title){
                    roleID = roles[i].id;
                }
            }
            for (i = 0; i < employees.length; i++){
                if (answer.employee == employees[i].Employee){
                    employeeID = eomployees[i].id;
                }
            }
            connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                if (err) return err;
                console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n`);
                mainMenu();
            });
        });
    });
}