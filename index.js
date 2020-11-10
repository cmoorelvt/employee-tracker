const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");

const connectionProperties = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Uzumaki8!",
    database: "employees_DB"
}

const connection = mysql.createConnection(connectionProperties);
connection.connect((err) => {
    if (err) throw err;
    console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
    mainMenu();
});

function mainMenu() {
    inquirer.prompt(
        {
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
                remRole();
                break;
            case "Remove department":
                remDept();
                break;
            case "View department budgets":
                viewDeptBudget();
                break;
        }
    });
}

function viewAllEmp() {
    let query = "SELECT * FROM employee";
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
        promisemysql.createConnection(connectionProperties)
            .then((conn) => {
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
            message: "Which manager would you like to search?",
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
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
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
        connection.query(`INSERT INTO department (name) VALUES ("${answer.deptName}");`, (err, res) => {
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
        for (i = 0; i < employees.length; i++){
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

function updEmpMan() {
    let employeeArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((employees) => {
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
        }
        return employees;
    }).then((employees) => {
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            },
            {
                name: "manager",
                type: "list",
                message: "Who is their new Manager?",
                choices: employeeArr
            },
        ]).then((answer) => {
            let employeeID;
            let managerID;
            for (i=0; i < employees.length; i++){
                if (answer.employee == employees[i].Employee){
                    employeeID = employees[i].id;
                }
            }
            for (i=0; i < employees.length; i++){
                if (answer.manager == employees[i].Employee){
                    managerID = employees[i].id;
                }
            }
            connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                if(err) return err;
                console.log(`\n ${answer.employee} MANAGER UPDATED TO ${answer.manager}...\n`);
                mainMenu();
            });
        });
    });
}

function remEmp() {
    let employeeArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query("SELECT employee.id, concat(employee.first_name, ' ', employee.last_name) AS employee FROM employee ORDER BY employee ASC"); 
    }).then((employees) => {
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].employee);
        }
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Who would you like to remove?",
                choices: employeeArr
            },
            {
                name: "yesNo",
                type: "list",
                message: "Confirm removal",
                choices: ["NO", "YES"]
            }
        ]).then((answer) => {
            if(answer.yesNo == "YES"){
                let employeeID;
                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].employee){
                        employeeID = employees[i].id;
                    }
                }
                connection.query(`DELETE FROM employee WHERE id=${employeeID};`, (err, res) => {
                    if(err) return err;
                    console.log(`\n EMPLOYEE '${answer.employee}' DELETED...\n `);
                    mainMenu();    
                });   
            }
            else {
                console.log(`\n EMPLOYEE '${answer.employee}' NOT DELETED...\n `);
                mainMenu();
            }
        });
    });    
}

function remRole() {
    let roleArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query("SELECT id, title FROM role");
    }).then((roles) => {
        for (i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }
        inquirer.prompt([
            {
                name: "continueRemove",
                type: "list",
                message: "If you remove a role, this will remove all employees associated with that role. Do you want to continue?",
                choices: ["NO", "YES"]
            }
        ]).then((answer) => {
            if (answer.continueRemove === "NO") {
                mainMenu();
            }
        }).then(() => {
            inquirer.prompt([
                {
                    name: "role",
                    type: "list",
                    message: "Which role would you like to remove?",
                    choices: roleArr
                },
                {
                    name: "confirmRemove",
                    type: "input",
                    message: "Please type the role to confirm removal"
                }
            ]).then((answer) => {
                if(answer.confirmRemove === answer.role){
                    let roleID;
                    for (i = 0; i < roles.length; i++) {
                        if (answer.role == roles[i].title) {
                            roleID = roles[i].id;
                        }
                    }
                connection.query(`DELETE FROM role WHERE id=${roleID};`, (err, res) => {
                    if (err) return err;
                    console.log(`\n ROLE '${answer.role}' REMOVED...\n `);
                    mainMenu();
                });
                } 
                else {
                console.log(`\n ROLE '${answer.role}' NOT REMOVED...\n `);
                mainMenu();
                }
            });
        })
    });
}

function remDept() {
    let deptArr = [];
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return conn.query("SELECT id, name FROM department");
    }).then((depts) => {
        for (i=0; i < depts.length; i++){
            deptArr.push(depts[i].name);
        }
        inquirer.prompt([
            {
                name: "continueRemove",
                type: "list",
                message: "Removing a department will remove all roles and employees associated with the department. Do you want to continue?",
                choices: ["NO", "YES"]
            }
        ]).then((answer) => {
            if (answer.continueRemove === "NO") {
                mainMenu();
            }
        }).then(() => {
            inquirer.prompt([
                {
                    name: "dept",
                    type: "list",
                    message: "Which dept would you like to remove?",
                    choices: deptArr 
                },
                {
                    name: "confirmRemove",
                    type: "Input",
                    message: "Please type the dept to confirm removal." 
                }
            ]).then((answer) => {
                if(answer.confirmRemove === answer.dept){
                    let deptID;
                    for (i=0; i < depts.length; i++){
                        if (answer.dept == depts[i].name){
                            deptID = depts[i].id;
                        }
                    }
                    connection.query(`DELETE FROM department WHERE id=${deptID};`, (err, res) => {
                        if(err) return err;
                        console.log(`\n DEPARTMENT '${answer.dept}' REMOVED...\n `);
                        mainMenu();
                    });
                }
                else {
                    console.log(`\n DEPARTMENT '${answer.dept}' NOT REMOVED...\n `);
                    mainMenu();
                }
            });    
        })
    });
}

function viewDeptBudget() {
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return  Promise.all([
            conn.query("SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"),
            conn.query('SELECT name FROM department ORDER BY name ASC')
        ]);
    }).then(([deptSalaies, departments]) => {
        let deptBudgetArr =[];
        let department;
        for (d=0; d < departments.length; d++){
            let departmentBudget = 0;
            for (i=0; i < deptSalaies.length; i++){
                if (departments[d].name == deptSalaies[i].department){
                    departmentBudget += deptSalaies[i].salary;
                }
            }
            department = {
                Department: departments[d].name,
                Budget: departmentBudget
            }
            deptBudgetArr.push(department);
        }
        console.log("\n");
        console.table(deptBudgetArr);
        mainMenu();
    }); 
}    