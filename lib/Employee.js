// TODO: Write code to define and export the Employee class

class Employee {
    constructor (name = "Bill", id = Employee.nextID, email = "wild.bill@gmail.com") {
        this.name = name;
        this.id = id;
        this.email = email;

        if (id === Employee.nextID) {
            Employee.nextID++;
        }
    }

    getName () {
        return (this.name);
    }

    getId () {
        return (this.id);
    }

    getEmail () {
        return (this.email);
    }

    getRole () {
        return (`Employee`);
    }
}

Employee.nextID = 0;

module.exports = Employee;