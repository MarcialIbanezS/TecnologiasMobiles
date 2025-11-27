import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("./clave-firebase.json");

// Inicializa Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function normalizarCampos() {
  const colecciones = ["fichamedica"]; // 🔹 cambia esto si usas otro nombre

  for (const nombre of colecciones) {
    console.log(`📂 Procesando colección: ${nombre}`);
    const snapshot = await db.collection(nombre).get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const docId = doc.id;

      // 🔸 Crear copia de seguridad
      const backupRef = db.collection(`${nombre}_backup`).doc(docId);
      await backupRef.set({
        ...data,
        backupDate: new Date().toISOString(),
      });

      // 🔸 Crear versión normalizada (todas las claves en minúscula)
      const normalizado = {};
      for (const [clave, valor] of Object.entries(data)) {
        normalizado[clave.toLowerCase()] = valor;
      }

      // 🔸 Reemplazar documento original
      await db.collection(nombre).doc(docId).delete();
      await db.collection(nombre).doc(docId).set(normalizado);

      console.log(`✅ ${docId} normalizado y respaldado.`);
    }
  }

  console.log("🚀 Normalización completada con respaldo exitoso.");
}

normalizarCampos().catch((err) => {
  console.error("❌ Error durante la normalización:", err);
});
