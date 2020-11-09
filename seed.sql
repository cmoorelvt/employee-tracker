USE employees_DB;

----- Department -----

INSERT INTO department (id, name)
VALUES (1, "Sales");

INSERT INTO department (id, name)
VALUES (2, "Engineering");

INSERT INTO department (id, name)
VALUES (3, "Finance");

INSERT INTO department (id, name)
VALUES (4, "Legal");

----- Roles -----

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Salesperson", 80000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Sales Lead", 100000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Store Manager", 75000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Lead Engineer", 150000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "Software Engineer", 120000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "Accountant", 125000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Legal Team Lead", 250000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Lawyer", 190000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (9, "Lead Engineer", 150000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (10, "Business Partner", 150000, 2);

----- Employees -----

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "John", "Doe", 1, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Mike", "Chan", 1, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Ashley", "Rodriguez", 2, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Kevin", "Tupik", 3, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, "Joshua", "Shequin", 4, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Malia", "Brown", 5, 7);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, "Sarah", "Lourd", 6, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8, "Tom", "Allen", 7, 10);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Tammer", "Galal", 8, 10);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (10, "Christine", "Moore", 9, null);