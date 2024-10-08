import mongoose from "mongoose";

const mongoDBConnect = () => {
  return mongoose.connect(process.env.URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
    .then(() => {
      console.log("MongoDB - Connected");
    })
    .catch((error) => {
      console.log("Error - MongoDB Connection " + error);
    });
};

export default mongoDBConnect;
