

import 'package:cloud_firestore/cloud_firestore.dart';

class DatabaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;


  Future<DocumentReference> crearPaciente({
    required String nombre,
    required String rut,
    required String fechaNacimiento,
    required String sexo,
    required String direccion,
    required String telefono,
  }) async {
    final pacienteRef = await _db.collection('pacientes').add({
      'nombre': nombre,
      'rut': rut,
      'fechaNacimiento': fechaNacimiento,
      'sexo': sexo,
      'direccion': direccion,
      'creado': FieldValue.serverTimestamp(),
      'telefono': telefono,
    });
    print(' Paciente creado con ID: ${pacienteRef.id}');
    return pacienteRef;
  }

  // Crear ficha médica dentro de un paciente
  Future<void> crearFichaMedica({
    required String pacienteId,
    required String fechaIngreso,
    required String consulta,
    required String profesional,
    List<String>? diagnosticos,
    List<String>? alergias,
    List<String>? cronicos,
    List<String>? medicamentos,
    List<String>? operaciones,
  }) async {
    final pacienteRef = _db.collection('pacientes').doc(pacienteId);
    await pacienteRef.collection('fichasMedicas').add({
      'fechaIngreso': fechaIngreso,
      'consulta': consulta,
      'profesional': profesional,
      'diagnosticos': diagnosticos ?? [],
      'alergias': alergias ?? [],
      'cronicos': cronicos ?? [],
      'medicamentos': medicamentos ?? [],
      'operaciones': operaciones ?? [],
      'creado': FieldValue.serverTimestamp(),
    });
    print('Ficha médica agregada a paciente $pacienteId');
  }

  // Crear colecciones maestras (listas base)
  Future<void> crearListasBase() async {
    final listas = {
      'alergias': [
        'Penicilina',
        'Polen',
        'Frutos secos',
        'Lactosa',
        'Gluten'
      ],
      'cronicos': [
        'Diabetes Mellitus Tipo 2',
        'Hipertensión Arterial',
        'Asma Bronquial',
        'Artritis Reumatoide',
        'Enfermedad Renal Crónica'
      ],
      'diagnosticos': [
        'Infección respiratoria aguda',
        'Gastroenteritis viral',
        'Fractura de radio distal',
        'Migraña común',
        'Hipertensión arterial esencial'
      ],
      'medicamentos': [
        'Amoxicilina 500mg',
        'Ibuprofeno 400mg',
        'Paracetamol 500mg',
        'Enalapril 10mg',
        'Metformina 850mg',
        'Eutirox 50mg'
      ],
      'operaciones': [
        'Apendicectomía laparoscópica',
        'Colecistectomía',
        'Herniorrafia inguinal',
        'Artroscopia de rodilla',
        'Cesárea'
      ],
      'servicios': [
        'Consulta Externa',
        'Urgencias',
        'Hospitalización',
        'Cirugía Ambulatoria',
        'Laboratorio Clínico'
      ],
      'profesionales': [
        'Dr. Carlos Mendoza - Medicina General',
        'Dra. Patricia Rojas - Cardiología',
        'Dr. Miguel Sánchez - Traumatología',
        'Dra. Isabel Vargas - Neurología',
        'Dr. Fernando López - Medicina General'
      ],
    };

    for (final entry in listas.entries) {
      final collection = _db.collection(entry.key);
      for (final item in entry.value) {
        await collection.add({'nombre': item});
      }
      print('✅ Colección ${entry.key} creada correctamente');
    }
  }

  
  Future<List<Map<String, dynamic>>> listarPacientes() async {
    final snapshot = await _db.collection('pacientes').get();
    return snapshot.docs.map((doc) {
      final data = doc.data();
      return {'id': doc.id, ...data};
    }).toList();
  }

  //  Obtener fichas médicas de un paciente
  Future<List<Map<String, dynamic>>> obtenerFichasDePaciente(String pacienteId) async {
    final snapshot = await _db
        .collection('pacientes')
        .doc(pacienteId)
        .collection('fichasMedicas')
        .orderBy('fechaIngreso', descending: true)
        .get();

    return snapshot.docs.map((doc) {
      final data = doc.data();
      return {'id': doc.id, ...data};
    }).toList();
  }

  //  Eliminar paciente
  Future<void> eliminarPaciente(String pacienteId) async {
    final pacienteRef = _db.collection('pacientes').doc(pacienteId);
    final fichas = await pacienteRef.collection('fichasMedicas').get();

    for (var ficha in fichas.docs) {
      await ficha.reference.delete();
    }
    await pacienteRef.delete();
    print('🗑️ Paciente $pacienteId eliminado correctamente');
  }

  //Prueba
  Future<void> testFirestore() async {
    await _db.collection('pruebas').add({
      'mensaje': 'Hola desde Flutter 🔥',
      'fecha': DateTime.now(),
    });
    print(' Conexión Firestore funcionando');
  }
}
