// backend/db/mongo.js
import mongoose from "mongoose";

const uri =
  "mongodb+srv://andy:LkT4KD4uKzkEiLUK@devops.u72s4oa.mongodb.net/devops?retryWrites=true&w=majority&appName=devops";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("MongoDB conectado exitosamente con Mongoose");
    return mongoose.connection;
  } catch (error) {
    console.error("Error conectando a MongoDB (mongoose):", error);
    throw error;
  }
}

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  { collection: "users" } 
);

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
