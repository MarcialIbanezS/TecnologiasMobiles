// patients.dart
// Modelo adaptado al Firebase usado por el proyecto Ionic

class Paciente {
  final String id;              // id del documento en Firestore
  final String idpaciente;      // id interno del paciente (P05639, etc.)
  final String nombrePaciente;  // nombre corregido (de "nomberPaciente")
  final String apellidoPaciente;
  final String rut;
  final String sexo;            // antes era "genero"
  final String direccion;
  final String fechaNacimiento;

  Paciente({
    required this.id,
    required this.idpaciente,
    required this.nombrePaciente,
    required this.apellidoPaciente,
    required this.rut,
    required this.sexo,
    required this.direccion,
    required this.fechaNacimiento,
  });

  factory Paciente.fromFirestore(Map<String, dynamic> data, String id) {
    return Paciente(
      id: id,
      idpaciente: data['idpaciente'] ?? '',
      nombrePaciente: data['nomberPaciente'] ?? data['nombrePaciente'] ?? '',
      apellidoPaciente: data['apellidoPaciente'] ?? '',
      rut: data['rut'] ?? '',
      sexo: data['sexo'] ?? data['genero'] ?? '',
      direccion: data['direccion'] ?? '',
      fechaNacimiento: data['fechaNacimiento'] ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'idpaciente': idpaciente,
      'nombrePaciente': nombrePaciente,
      'apellidoPaciente': apellidoPaciente,
      'rut': rut,
      'sexo': sexo,
      'direccion': direccion,
      'fechaNacimiento': fechaNacimiento,
    };
  }

  /// 🔹 Campo de conveniencia para mostrar nombre completo
  String get nombreCompleto => '$nombrePaciente $apellidoPaciente'.trim();
}