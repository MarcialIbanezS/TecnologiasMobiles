import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBko6PFIC3QOZ3CXtsyN-4vrFJR2ooAeas",
  authDomain: "appmoviles-b5003.firebaseapp.com",
  projectId: "appmoviles-b5003",
  storageBucket: "appmoviles-b5003.firebasestorage.app",
  messagingSenderId: "264276022373",
  appId: "1:264276022373:web:66db567fd6ee7d225b628c",
  measurementId: "G-RXGREWNXX8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split("T")[0];
}

async function populateFichaMedica() {
  const pacientesRef = collection(db, "paciente");
  const fichasRef = collection(db, "fichamedica");

  console.log("Leyendo pacientes...");
  const pacientesSnap = await getDocs(pacientesRef);
  if (pacientesSnap.empty) {
    console.log("No se encontraron pacientes en la colección 'paciente'. Asegúrate de poblarla primero.");
    return;
  }

  // Cargar todas las fichas existentes para evitar duplicados y encontrar el max idFichaMedica
  console.log("Leyendo fichas médicas existentes...");
  const fichasSnap = await getDocs(fichasRef);
  const existingPacienteIds = new Set();
  let maxIdFicha = 0;
  fichasSnap.forEach((d) => {
    const data = d.data();
    if (data && data.idPaciente) existingPacienteIds.add(data.idPaciente);
    if (data && typeof data.idFichaMedica === 'number' && data.idFichaMedica > maxIdFicha) {
      maxIdFicha = data.idFichaMedica;
    }
  });

  let nextId = maxIdFicha + 1;
  let created = 0;
  const batchSize = 500;
  let counter = 0;

  console.log(`Iniciando creación de fichas médicas. Empezando en idFichaMedica=${nextId}`);

  for (const pacienteDoc of pacientesSnap.docs) {
    const pacienteId = pacienteDoc.id; // usar el id del documento como idPaciente

    if (existingPacienteIds.has(pacienteId)) {
      // ya existe una ficha para este paciente
      continue;
    }

    const ficha = {
      idAlergia: Math.floor(Math.random() * 5) + 1,
      idCronico: Math.floor(Math.random() * 5) + 1,
      idFichaMedica: nextId++,
      idOperacion: Math.floor(Math.random() * 5) + 1,
      idPaciente: pacienteId,
      fechaIngreso: randomDate(new Date(2015, 0, 1), new Date(2025, 0, 1)),
    };

    try {
      await addDoc(fichasRef, ficha);
      created++;
      existingPacienteIds.add(pacienteId);
    } catch (e) {
      console.error(`Error añadiendo ficha para paciente ${pacienteId}:`, e);
    }

    counter++;
    if (counter % batchSize === 0) {
      console.log(`Creadas ${created} fichas... esperando 3 segundos antes de continuar...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log(`✅ Poblamiento de fichas médicas completado. Nuevas fichas creadas: ${created}`);
}

// Ejecutar la función que garantiza una ficha por cada paciente.
// Si quieres poblar pacientes primero, llama a populatePacientes() manualmente.
populateFichaMedica().catch(error => {
    console.error('Error executing populateFichaMedica:', error);
});
