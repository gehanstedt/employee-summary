// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.

const Employee = require ("./employee.js");

class Manager extends Employee {
    constructor (name = "Bill", id = Employee.nextID, email = "wild.bill@gmail.com", officeNumber = 55) {
        super (name, id, email);

        this.officeNumber = officeNumber;
    }

    getOfficeNumber () {
        return this.officeNumber;
    }

    getRole () {
        return (`Manager`);
    }
}

module.exports = Manager;