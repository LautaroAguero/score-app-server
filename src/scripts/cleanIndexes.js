import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const cleanIndexes = async () => {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.DB_URI);

    const collection = mongoose.connection.collection("users");

    console.log("Limpiando índices de colección 'users'...");

    // Obtener todos los índices
    const indexes = await collection.listIndexes().toArray();
    console.log("Índices actuales:", indexes);

    // Eliminar todos los índices excepto el _id
    for (const index of indexes) {
      if (index.name !== "_id_") {
        console.log(`Eliminando índice: ${index.name}`);
        await collection.dropIndex(index.name);
      }
    }

    console.log("✅ Índices limpiados exitosamente");

    // Recrear el índice de email como unique
    console.log("Creando índice único en 'email'...");
    await collection.createIndex({ email: 1 }, { unique: true });

    console.log("✅ Índice de email recreado");

    // Mostrar nuevos índices
    const newIndexes = await collection.listIndexes().toArray();
    console.log("Nuevos índices:", newIndexes);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

cleanIndexes();
