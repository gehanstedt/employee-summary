// TODO: Write code to define and export the Engineer class.  HINT: This class should inherit from Employee.
const Employee = require ("./employee.js");

class Engineer extends Employee {
    constructor (name = "Bill", id = Employee.nextID, email = "wild.bill@gmail.com", github = "wildBill355") {
        super (name, id, email);

        this.github = github;
    }

    getGithub () {
        return this.github;
    }

    getRole () {
        return (`Engineer`);
    }
}

Engineer.nextID = 100;

module.exports = Engineer;