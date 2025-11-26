import 'package:cloud_firestore/cloud_firestore.dart';

class Paciente {
  final String id;
  final String idpaciente;
  final String nombrePaciente;
  final String apellidoPaciente;
  final String rut;
  final String sexo;
  final String direccion;
  final String fechaNacimiento;
  final String? telefono;
  final String? email;

  const Paciente({
    required this.id,
    required this.idpaciente,
    required this.nombrePaciente,
    required this.apellidoPaciente,
    required this.rut,
    required this.sexo,
    required this.direccion,
    required this.fechaNacimiento,
    this.telefono,
    this.email,
  });

  factory Paciente.fromFirestore(Map<String, dynamic> data, String id) {
    return Paciente(
      id: id,
      idpaciente: (data['idpaciente'] ?? id).toString(),
      nombrePaciente: data['nomberPaciente']?.toString() ??
          data['nombrePaciente']?.toString() ??
          '',
      apellidoPaciente: data['apellidoPaciente']?.toString() ?? '',
      rut: data['rut']?.toString() ?? '',
      sexo: data['sexo']?.toString() ?? data['genero']?.toString() ?? '',
      direccion: data['direccion']?.toString() ?? '',
      fechaNacimiento: _formatDate(data['fechaNacimiento']),
      telefono: data['telefono']?.toString(),
      email: data['email']?.toString(),
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
      if (telefono != null) 'telefono': telefono,
      if (email != null) 'email': email,
    };
  }

  String get nombreCompleto => '$nombrePaciente $apellidoPaciente'.trim();
}

String _formatDate(dynamic value) {
  if (value == null) return '';
  if (value is String) return value;
  if (value is Timestamp) {
    final date = value.toDate();
    final month = date.month.toString().padLeft(2, '0');
    final day = date.day.toString().padLeft(2, '0');
    return '${date.year}-$month-$day';
  }
  return value.toString();
}
