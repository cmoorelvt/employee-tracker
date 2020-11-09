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