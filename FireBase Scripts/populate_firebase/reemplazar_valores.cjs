// IMPORTAR FIREBASE ADMIN SDK (versión CommonJS)
const admin = require("firebase-admin");
const serviceAccount = require("./nueva-clave.json");

// INICIALIZAR FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// DICCIONARIOS DE VALORES
const alergias = {
  1: "Alergia a antibióticos del grupo penicilina",
  2: "Alergia estacional al polen de árboles y flores",
  3: "Alergia a almendras, nueces, avellanas",
  4: "Intolerancia a productos lácteos",
  5: "Celiaquía o sensibilidad al gluten",
};

const cronicos = {
  1: "Diabetes Mellitus Tipo 2",
  2: "Hipertensión Arterial",
  3: "Asma Bronquial",
  4: "Artritis Reumatoide",
  5: "Enfermedad Renal Crónica",
};

const operaciones = {
  1: "Apendicectomía laparoscópica",
  2: "Colecistectomía",
  3: "Herniorrafia inguinal",
  4: "Artroscopia de rodilla",
  5: "Cesárea",
};

// ACTUALIZAR DOCUMENTOS
async function actualizarFichas() {
  const fichasSnapshot = await db.collection("fichamedica").get();

  const batch = db.batch();

  fichasSnapshot.forEach((doc) => {
    const data = doc.data();

    const nuevaData = {};

    if (data.idalergia && alergias[data.idalergia]) {
      nuevaData.idalergia = alergias[data.idalergia];
    }
    if (data.idcronico && cronicos[data.idcronico]) {
      nuevaData.idcronico = cronicos[data.idcronico];
    }
    if (data.idoperacion && operaciones[data.idoperacion]) {
      nuevaData.idoperacion = operaciones[data.idoperacion];
    }

    if (Object.keys(nuevaData).length > 0) {
      batch.update(doc.ref, nuevaData);
    }
  });

  await batch.commit();
  console.log("✅ Campos actualizados correctamente en fichamedica.");
}

actualizarFichas().catch(console.error);
