//using to connect
const mongoose = require('mongoose');

// to be able to get  mongoURI file
const config = require('config'); // require config package
const db = config.get('mongoURI'); // actually getting the mongoURI string

// using async/await beacues its the new standard and makes code much smoother
// connectDB function
const connectDB = async () => {
  // putting this in try catch --> in case of some errors happen
  try {
    // await the result of mongoose.connect
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });

    console.log('MongoDB Connected...'); // connection succeeded
  } catch (err) {
    // catching errors
    console.error(err.message); // message property
    // Exit process with failure
    process.exit(1); // we want the app to fail if eerors hapen
  }
};

// export the connectDB method -- why?
module.exports = connectDB;
