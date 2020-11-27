const axios = require("axios");
const inquirer = require("inquirer");

getMovie();

async function getMovie() {
  try {
    const { stuff } = await inquirer.prompt({
      message: "Search for stuff:",
      name: "stuff"
    });

    console.log (stuff);

    const { movie } = await inquirer.prompt({
      message: "Search a movie:",
      name: "movie"
    });

    const { data:myData } = await axios.get(
      `https://www.omdbapi.com/?t=${movie}&apikey=trilogy`
    );

    console.log(myData);
  
  } catch (err) {
    console.log(err);
  }
}
