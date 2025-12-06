import { MongoClient } from "mongodb";

const uri = "mongodb+srv://andy:LkT4KD4uKzkEiLUK@devops.u72s4oa.mongodb.net/devops?retryWrites=true&w=majority&appName=devops";

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
