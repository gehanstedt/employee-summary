const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const argc = process.argv.length;
const argv = process.argv;
let outputFilename = "team.html";
let employeeArray = [];
var nextEmployeeID = 100;

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// Array for choices to be displayed after the first employee is entered.
const continuationChoices = [
    {
        name: "Add an Intern",
        value: "Intern",
        short: "Intern"
    },
    {
        name: "Add an Engineer",
        value: "Engineer",
        short: "Engineer"
    },
    {
        name: `I am finshed - write out ${outputFilename}`,
        value: "None",
        short: "None"
    }];


const render = require("./lib/htmlRenderer");
const Employee = require("./lib/Employee");


// If more than two arguments, show the usage information.  Ignore indenting.                        
if (argc > 3) {
    console.log (`Usage:  
    node app.js [output_filename]
    app generate a HTML file of your organization.  You'll be prompted to enter one manager and then one or
    more interns or engineers to include in the organization.  Once completed, the program will create a
    team.html file to represent your organization.  But, you can specify an alternate  
    filename as an optional parameter.  
    
    output_filename - (optional) - write out to your specified file instead of team.html  
    `);
    // Resume normal indenting
  
    // Since we had too many arguments, let's just exit with a return
    return;
}

// Test if user entered one argument.  If so, we will assume that is the filename they want to 
// which they want to write the generated readme.
else if (argc === 3) {
    outputFilname = argv [2];
}

showIntroduction ();
handleEmployees ();  

// console.log (employeeArray);
  

// Show introdutory information on how the Node.js script is used.
function showIntroduction () {
    // Show introduction to user.  Ignore indenting
    console.log (`Welcome to app.js - the Organization Builder!
You will be prompted to information on a manager.  Afterwards, you can input one or more employees - either
interns or engineers.  Once you have entered all employees, it will generate an HTML file ${outputFilename}
with your organization.
`);
}

// Main function that prompts for manager, then allows the user to add additional Interns and Engineers

async function handleEmployees () {
    var keepGoing = true;
    var employeeType = "Manager";
    var extraQuestion;

    try {
        // Prompt users for each employee to be added.  User must enter a manager first, so we control flow with a 
        // do - while loop
        do {
            // Determine question to be asked based on the employee type we are gathering data for
            switch (employeeType) {
                case "Manager":
                    extraQuestion = "What is the Manager's office number?"
                    break;

                case "Intern":
                    extraQuestion = "What is the school the Intern is attending?"
                    break;
            
                case "Engineer":
                    extraQuestion = "What is the Engineer's GitHub Username?";
                    break;
            }

            var { name } = await inquirer.prompt (
            {
                type: "input",
                message: `What is the ${employeeType}'s name?`,
                name: "name"
            });
            
            var { emailAddress } = await inquirer.prompt (
            {
                type: "input",
                message: `What is the ${employeeType}'s Email Address?`,
                name: "emailAddress"
            });

            var { extraAnswer } = await inquirer.prompt (
            {
                type: "input",
                message: extraQuestion,
                name: "extraAnswer"
            });

            switch (employeeType) {
                case "Manager":
                    let managerObject = new Manager (name, nextEmployeeID++, emailAddress, extraAnswer);
                    employeeArray.push (managerObject);
                    break;

                case "Intern":
                    let internObject = new Intern (name, nextEmployeeID++, emailAddress, extraAnswer);
                    employeeArray.push (internObject);
                    break;
            
                case "Engineer":
                    let engineerObject = new Engineer (name, nextEmployeeID++, emailAddress, extraAnswer);
                    employeeArray.push (engineerObject);
                    break;
            }

            var { employeeType } = await inquirer.prompt (
            {
                    type: "list",
                    message: `Add another employee?  If so, what type?`,
                    name: "employeeType",
                    choices: continuationChoices
            });
        } while (employeeType !== "None")
    }

    catch (error) {
        console.log (error);
    }

    const htmlOutput = render (employeeArray);

    try {
        await writeFileAsync(
            outputFilename,
            htmlOutput,
            "utf8"
        );
    }

    catch (error) {
        console.log (error);
    }
}   


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
