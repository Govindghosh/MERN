import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import app from "./app.js";
dotenv.config({
  path: "./.env",
});
const port = process.env.POST || 8000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`📶 Server is running at port ⋙   http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection is failed ❗  `, error);
  });

/*
import express from "express"
const app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/

//require("dotenv").config();
// import express from "express";

// const app = express();

// const port = process.env.PORT || 8000;

// app.get("/", (req, res) => {
//   res.send("Server is Ready");
// });
// app.get("/api/friends", (req, res) => {
//   const friends = [
//     {
//       id: 1,
//       name: "Raghav",
//       age: 25,
//       MarriedStatus: "Single",
//     },
//     {
//       id: 2,
//       name: "Govind",
//       age: 24,
//       MarriedStatus: "Single",
//     },
//     {
//       id: 3,
//       name: "Rahul",
//       age: 28,
//       MarriedStatus: "Married",
//     },
//     {
//       id: 4,
//       name: "Tannu",
//       age: 23,
//       MarriedStatus: "Single",
//     },
//     {
//       id: 5,
//       name: "Sonam",
//       age: 23,
//       MarriedStatus: "Single",
//     },
//   ];
//   res.send(friends);
// });
// app.listen(port, () => {
//   console.log(`Example app listening on port http://localhost:${port}`);
// });
