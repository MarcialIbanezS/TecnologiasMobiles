const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function crearRelaciones() {
  const fichasSnapshot = await db.collection("fichamedica").get();

  console.log(`Procesando ${fichasSnapshot.size} fichas médicas...`);

  let batch = db.batch();
  let count = 0;

  fichasSnapshot.forEach((doc) => {
    const data = doc.data();
    const idFicha = data.idfichamedica;

    if (data.idalergia) {
      const refAlergia = db.collection("fichaAlergia").doc();
      batch.set(refAlergia, {
        idFichaMedica: idFicha,
        idAlergia: data.idalergia
      });
    }

    if (data.idcronico) {
      const refCronico = db.collection("fichaCronico").doc();
      batch.set(refCronico, {
        idFichaMedica: idFicha,
        idCronico: data.idcronico
      });
    }

    if (data.idoperacion) {
      const refOperacion = db.collection("fichaOperacion").doc();
      batch.set(refOperacion, {
        idFichaMedica: idFicha,
        idOperacion: data.idoperacion
      });
    }

    count++;

    if (count % 500 === 0) {
      batch.commit();
      batch = db.batch();
      console.log(`Procesadas ${count} fichas...`);
    }
  });

  await batch.commit();
  console.log(`✅ Relaciones creadas para ${count} fichas médicas.`);
}

crearRelaciones().catch(console.error);
