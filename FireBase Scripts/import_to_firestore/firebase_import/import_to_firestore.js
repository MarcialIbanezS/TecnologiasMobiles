import admin from "firebase-admin";
import fs from "fs";
import path from "path";

admin.initializeApp({
  credential: admin.credential.cert("./serviceAccountKey.json")
});

const db = admin.firestore();
const folderPath = path.join(".", "export_json");

async function importData() {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const collectionName = file.replace(".json", "");
      const data = JSON.parse(fs.readFileSync(path.join(folderPath, file), "utf8"));

      const batch = db.batch();
      data.forEach((item) => {
        // Usa item.id si quieres mantener el mismo ID que en SQL
        const docRef = item.id
          ? db.collection(collectionName).doc(String(item.id))
          : db.collection(collectionName).doc();

        batch.set(docRef, item);
      });

      await batch.commit();
      console.log(`✅ Importada colección: ${collectionName}`);
    }
  }

  console.log("🎉 Migración completada");
}

importData().catch(console.error);
