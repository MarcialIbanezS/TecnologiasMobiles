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
  /// 🔹 Crear listas base de pacientes de ejemplo (para pruebas locales)
Future<void> crearListasBase() async {
  final pacientesEjemplo = [
    {
      'idpaciente': 'P05639',
      'nomberPaciente': 'Matías',
      'apellidoPaciente': 'Flores',
      'rut': '73047497-7',
      'sexo': 'Femenino',
      'direccion': 'Camino del Río 22, Pueblo Nuevo',
      'fechaNacimiento': '1965-05-03'
    },
    {
      'idpaciente': 'P09785',
      'nomberPaciente': 'Ana',
      'apellidoPaciente': 'Hernández',
      'rut': '72498311-5',
      'sexo': 'Masculino',
      'direccion': 'Calle Falsa 123, Springfield',
      'fechaNacimiento': '2009-02-23'
    },
    {
      'idpaciente': 'P06452',
      'nomberPaciente': 'Diego',
      'apellidoPaciente': 'Vega',
      'rut': '39921439-7',
      'sexo': 'Masculino',
      'direccion': 'Pasaje Los Álamos 10, Villa Verde',
      'fechaNacimiento': '1976-08-29'
    },
  ];

  for (var paciente in pacientesEjemplo) {
    await _db.collection('paciente').add(paciente);
  }

  print("✅ Se crearon ${pacientesEjemplo.length} pacientes de ejemplo en Firebase.");
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
  Future<void> crearListasBaseConFichas() async {
  final pacientesEjemplo = [
    {
      'idpaciente': 'P05639',
      'nomberPaciente': 'Matías',
      'apellidoPaciente': 'Flores',
      'rut': '22222222-7',
      'sexo': 'Femenino',
      'direccion': 'Camino del Río 22, Pueblo Nuevo',
      'fechaNacimiento': '1965-05-03'
    },
    {
      'idpaciente': 'P09785',
      'nomberPaciente': 'Ana',
      'apellidoPaciente': 'Hernández',
      'rut': '72498311-5',
      'sexo': 'Masculino',
      'direccion': 'Calle Falsa 123, Springfield',
      'fechaNacimiento': '2009-02-23'
    },
    {
      'idpaciente': 'P06452',
      'nomberPaciente': 'Diego',
      'apellidoPaciente': 'Vega',
      'rut': '39921439-7',
      'sexo': 'Masculino',
      'direccion': 'Pasaje Los Álamos 10, Villa Verde',
      'fechaNacimiento': '1976-08-29'
    },
  ];

  for (var paciente in pacientesEjemplo) {
    // 🔹 Crear paciente
    final docRef = await _db.collection('paciente').add(paciente);

    // 🔹 Crear ficha médica asociada
    await _db.collection('fichamedica').add({
      'idpaciente': docRef.id,
      'fechaingreso': '2025-10-01',
      'idconsulta': 'Consulta General',
      'nombreProfesional': 'Dr. Matías Sandoval',
      'diagnosticos': ['Chequeo general'],
      'alergias': ['Ninguna'],
      'cronicos': [],
      'medicamentos': [],
      'operaciones': [],
    });

    print("✅ Paciente '${paciente['nomberPaciente']}' creado con ficha médica.");
  }
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
