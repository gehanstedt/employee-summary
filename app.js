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
    outputFilename = argv [2];
}

showIntroduction ();
handleEmployees ();  

// console.log (employeeArray);
  

// Show introdutory information on how the Node.js script is used.
function showIntroduction () {
    // Show introduction to user.  Ignore indenting
    console.log (`Welcome to app.js - the Organization Builder!
You will be prompted for information on your organization.  First, the name of yoru team.  The, the manager
of the team.  Afterwards, you can input one or more employees - either interns or engineers.  Once you have
entered all employees, it will generate an HTML file ${outputFilename} with the organization.
`);
}

// Main function that prompts for manager, then allows the user to add additional Interns and Engineers

async function handleEmployees () {
    var keepGoing = true;
    var employeeType = "Manager";
    var extraQuestion;
    var teamName;

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

    try {
        // Prompt for the team name and eventually store in variable teamName
        // A bit of a workaround to have the teamName2 variable survive outside the try
        const { teamName2 } = await inquirer.prompt (
            {
                type: "input",
                message: `What is the name of the team?`,
                name: "teamName2"
            });
        teamName = teamName2;            

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

            // Prompt for employee's name and store in name
            var { name } = await inquirer.prompt (
            {
                type: "input",
                message: `What is the ${employeeType}'s name?`,
                name: "name"
            });
            
            // Prompt for the employee's ID.  By default, display the next employee ID.  If it is used, we'll
            // increment that ID
            var { id } = await inquirer.prompt (
                {
                    type: "input",
                    message: `What is the ${employeeType}'s ID?`,
                    default: nextEmployeeID,
                    name: "id"
                });
            if (id === nextEmployeeID) {
                nextEmployeeID++;
            }
                
            // Prompt for employee's email address and store in email address
            var { emailAddress } = await inquirer.prompt (
            {
                type: "input",
                message: `What is the ${employeeType}'s Email Address?`,
                name: "emailAddress"
            });

            // Prompt for the extra answer associated with the type of employee.  This questions was generated
            // above in the switch statement and the results will be stored in extraQuestion
            var { extraAnswer } = await inquirer.prompt (
            {
                type: "input",
                message: extraQuestion,
                name: "extraAnswer"
            });

            // Now that we have the input, based again on the employee type we are adding we will call the
            // appropriate new class to instantiate a new object of that type and then added it to 
            // the employeeArray
            switch (employeeType) {
                case "Manager":
                    let managerObject = new Manager (name, id, emailAddress, extraAnswer);
                    employeeArray.push (managerObject);
                    break;

                case "Intern":
                    let internObject = new Intern (name, id, emailAddress, extraAnswer);
                    employeeArray.push (internObject);
                    break;
            
                case "Engineer":
                    let engineerObject = new Engineer (name, id, emailAddress, extraAnswer);
                    employeeArray.push (engineerObject);
                    break;
            }

            // Prompt if another Engineer or Intern should be added.  Answer to be stored back into employeeType.
            // If "None", we'll exit the do - while loop

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

    // Render the array of employees to HTML and store in the variable htmlOutput
    const htmlOutput = render (employeeArray, teamName);

    // Write the htmlOutput to the file.  By default, this is "team.html" unless an argument is provided.
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
