// backend/db/mongo.js
import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://andy:Test1234!@devops.u72s4oa.mongodb.net/?retryWrites=true&w=majority&appName=devops";

// Cliente preparado para backend Express (según documentación oficial)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "devops";

export async function connectDB() {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();

      await client.db("admin").command({ ping: 1 });

      console.log("MongoDB conectado correctamente (ping exitoso)");
    }

    return client.db(dbName);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    throw error;
  }
}
