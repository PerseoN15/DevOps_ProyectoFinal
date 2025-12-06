import { MongoClient } from "mongodb";

const uri = "mongodb+srv://admin:<itsj>@cluster0.9hug4ig.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);
const dbName = "devops";

export async function connectDB() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
      console.log("MongoDB conectado correctamente");
    }
    return client.db(dbName);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    throw error;
  }
}
