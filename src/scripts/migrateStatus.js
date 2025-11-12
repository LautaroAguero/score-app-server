import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const migrateStatus = async () => {
  try {
    console.log("Conectando a MongoDB...");
    await mongoose.connect(process.env.DB_URI);
    
    const collection = mongoose.connection.collection("tournaments");
    
    console.log("Migrando documentos con status 'upcoming' a 'setup'...");
    
    // Actualizar todos los documentos que tienen status "upcoming" a "setup"
    const result = await collection.updateMany(
      { status: "upcoming" },
      { $set: { status: "setup" } }
    );
    
    console.log(`✅ ${result.modifiedCount} documentos actualizados`);
    
    // Mostrar estadísticas
    const stats = await collection.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    console.log("\nEstadísticas de status:");
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} documentos`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

migrateStatus();
