import 'package:cloud_firestore/cloud_firestore.dart';
import 'patients.dart';

class DatabaseService {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  // 🔹 Prueba de conexión a Firestore
  Future<void> testFirestore() async {
    try {
      final snapshot = await _db.collection('paciente').limit(1).get();
      if (snapshot.docs.isNotEmpty) {
        print("✅ Conectado correctamente a Firestore");
      } else {
        print("⚠️ Conexión exitosa, pero colección vacía.");
      }
    } catch (e) {
      print("❌ Error conectando a Firestore: $e");
    }
  }

  // 🔹 Crear listas base (para inicializar datos de prueba)
  Future<void> crearListasBase() async {
    await _db.collection('paciente').add({
      'nombrePaciente': 'Paciente de Prueba',
      'rut': '11111111-1',
      'genero': 'Masculino',
      'fechaNacimiento': '1990-01-01',
      'direccion': 'Santiago Centro'
    });
    print("🧾 Paciente de prueba creado correctamente.");
  }

  // 🔹 Listar todos los pacientes (equivalente a listarPacientes)
  Future<List<Map<String, dynamic>>> listarPacientes() async {
    final snapshot = await _db.collection('paciente').get();

    return snapshot.docs.map((doc) {
      final data = doc.data();
      data['id'] = doc.id;

      // 🔹 Normalizar nombres de campo
      // "nomberPaciente" -> "nombrePaciente"
      data['nombrePaciente'] = data['nomberPaciente'] ?? data['nombrePaciente'] ?? '';
      data['apellidoPaciente'] = data['apellidoPaciente'] ?? '';
      data['sexo'] = data['sexo'] ?? data['genero'] ?? '';
      data['idpaciente'] = data['idpaciente'] ?? '';

      // 🔹 Crear un campo combinado para mostrar el nombre completo
      data['nombreCompleto'] = '${data['nombrePaciente']} ${data['apellidoPaciente']}'.trim();

      return data;
    }).toList();

  }

  // 🔹 Obtener lista de pacientes como modelos (si prefieres objetos Paciente)
  Future<List<Paciente>> getPacientes() async {
    final snapshot = await _db.collection('paciente').get();
    return snapshot.docs
        .map((doc) => Paciente.fromFirestore(doc.data(), doc.id))
        .toList();
  }

  // 🔹 Crear un nuevo paciente
  Future<DocumentReference> crearPaciente({
    required String nombre,
    required String rut,
    required String fechaNacimiento,
    required String sexo,
    required String direccion,
    String? telefono,
  }) async {
    final ref = await _db.collection('paciente').add({
      'nombrePaciente': nombre,
      'rut': rut,
      'genero': sexo,
      'fechaNacimiento': fechaNacimiento,
      'direccion': direccion,
      'telefono': telefono ?? '',
    });
    print("✅ Paciente creado con ID: ${ref.id}");
    return ref;
  }

  // 🔹 Crear una ficha médica dentro del paciente
  Future<void> crearFichaMedica({
    required String pacienteId,
    required String fechaIngreso,
    required String consulta,
    required String profesional,
    required List<String> diagnosticos,
    required List<String> alergias,
    required List<String> cronicos,
    required List<String> medicamentos,
    required List<String> operaciones,
  }) async {
    final fichasRef =
        _db.collection('paciente').doc(pacienteId).collection('fichas');

    await fichasRef.add({
      'fechaIngreso': fechaIngreso,
      'consulta': consulta,
      'profesional': profesional,
      'diagnosticos': diagnosticos,
      'alergias': alergias,
      'cronicos': cronicos,
      'medicamentos': medicamentos,
      'operaciones': operaciones,
    });

    print("📋 Ficha médica creada para paciente $pacienteId");
  }

  // 🔹 Obtener fichas médicas de un paciente
  Future<List<Map<String, dynamic>>> obtenerFichasDePaciente(String id) async {
    final snapshot =
        await _db.collection('paciente').doc(id).collection('fichas').get();

    return snapshot.docs.map((doc) {
      final data = doc.data();
      data['id'] = doc.id;
      return data;
    }).toList();
  }

  // 🔹 Eliminar paciente
  Future<void> eliminarPaciente(String id) async {
    await _db.collection('paciente').doc(id).delete();
    print("🗑️ Paciente eliminado: $id");
  }
}
