// Function that generates a string of random numbers and letters for adding unique ids to the db.json file
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
