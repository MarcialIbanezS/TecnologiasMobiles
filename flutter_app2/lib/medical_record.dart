import 'package:cloud_firestore/cloud_firestore.dart';

DateTime? _parseDate(dynamic value) {
  if (value == null) return null;
  if (value is Timestamp) return value.toDate();
  if (value is DateTime) return value;
  if (value is String && value.isNotEmpty) {
    return DateTime.tryParse(value);
  }
  return null;
}

class MedicalRecord {
  final String id;
  final String patientId;
  final DateTime? fechaIngreso;
  final DateTime? fechaConsulta;
  final String? idAlergia;
  final String? idCronico;
  final String? idOperacion;
  final String? nombrePaciente;
  final String? rut;
  final DateTime? fechaNacimiento;
  final String? sexo;
  final String? direccion;
  final String? tipoServicio;
  final String? nombreProfesional;

  const MedicalRecord({
    required this.id,
    required this.patientId,
    this.fechaIngreso,
    this.fechaConsulta,
    this.idAlergia,
    this.idCronico,
    this.idOperacion,
    this.nombrePaciente,
    this.rut,
    this.fechaNacimiento,
    this.sexo,
    this.direccion,
    this.tipoServicio,
    this.nombreProfesional,
  });

  factory MedicalRecord.fromFirestore(
    Map<String, dynamic> data,
    String id,
  ) {
    return MedicalRecord(
      id: id,
      patientId: data['idpaciente']?.toString() ?? '',
      fechaIngreso: _parseDate(data['fechaingreso']),
      fechaConsulta: _parseDate(data['fechaConsulta']),
      idAlergia: data['idalergia']?.toString(),
      idCronico: data['idcronico']?.toString(),
      idOperacion: data['idoperacion']?.toString(),
      nombrePaciente: data['nombrePaciente']?.toString(),
      rut: data['rut']?.toString(),
      fechaNacimiento: _parseDate(
        data['fechaNacimiento'] ?? data['fecha_nacimiento'],
      ),
      sexo: data['sexo']?.toString() ?? data['genero']?.toString(),
      direccion: data['direccion']?.toString(),
      tipoServicio: data['tipoServicio']?.toString(),
      nombreProfesional: data['nombreProfesional']?.toString(),
    );
  }

  MedicalRecord copyWith({
    String? nombrePaciente,
    String? rut,
    String? direccion,
    String? idAlergia,
    String? idCronico,
    String? idOperacion,
    String? tipoServicio,
    String? nombreProfesional,
  }) {
    return MedicalRecord(
      id: id,
      patientId: patientId,
      fechaIngreso: fechaIngreso,
      fechaConsulta: fechaConsulta,
      idAlergia: idAlergia ?? this.idAlergia,
      idCronico: idCronico ?? this.idCronico,
      idOperacion: idOperacion ?? this.idOperacion,
      nombrePaciente: nombrePaciente ?? this.nombrePaciente,
      rut: rut ?? this.rut,
      fechaNacimiento: fechaNacimiento,
      sexo: sexo,
      direccion: direccion ?? this.direccion,
      tipoServicio: tipoServicio ?? this.tipoServicio,
      nombreProfesional: nombreProfesional ?? this.nombreProfesional,
    );
  }
}

class DetailedMedicalRecord extends MedicalRecord {
  final List<String> allergies;
  final List<String> chronicConditions;
  final List<String> operations;

  DetailedMedicalRecord({
    required super.id,
    required super.patientId,
    super.fechaIngreso,
    super.fechaConsulta,
    super.idAlergia,
    super.idCronico,
    super.idOperacion,
    super.nombrePaciente,
    super.rut,
    super.fechaNacimiento,
    super.sexo,
    super.direccion,
    super.tipoServicio,
    super.nombreProfesional,
    this.allergies = const [],
    this.chronicConditions = const [],
    this.operations = const [],
  });

  factory DetailedMedicalRecord.fromFirestore(
    Map<String, dynamic> data,
    String id,
  ) {
    final base = MedicalRecord.fromFirestore(data, id);
    return DetailedMedicalRecord(
      id: base.id,
      patientId: base.patientId,
      fechaIngreso: base.fechaIngreso,
      fechaConsulta: base.fechaConsulta,
      idAlergia: base.idAlergia,
      idCronico: base.idCronico,
      idOperacion: base.idOperacion,
      nombrePaciente: base.nombrePaciente,
      rut: base.rut,
      fechaNacimiento: base.fechaNacimiento,
      sexo: base.sexo,
      direccion: base.direccion,
      tipoServicio: base.tipoServicio,
      nombreProfesional: base.nombreProfesional,
      allergies: (data['allergies'] as List<dynamic>? ?? [])
          .map((item) => item.toString())
          .toList(),
      chronicConditions: (data['chronicConditions'] as List<dynamic>? ?? [])
          .map((item) => item.toString())
          .toList(),
      operations: (data['operations'] as List<dynamic>? ?? [])
          .map((item) => item.toString())
          .toList(),
    );
  }

  @override
  DetailedMedicalRecord copyWith({
    String? nombrePaciente,
    String? rut,
    String? direccion,
    String? idAlergia,
    String? idCronico,
    String? idOperacion,
    String? tipoServicio,
    String? nombreProfesional,
    List<String>? allergies,
    List<String>? chronicConditions,
    List<String>? operations,
  }) {
    return DetailedMedicalRecord(
      id: id,
      patientId: patientId,
      fechaIngreso: fechaIngreso,
      fechaConsulta: fechaConsulta,
      idAlergia: idAlergia ?? this.idAlergia,
      idCronico: idCronico ?? this.idCronico,
      idOperacion: idOperacion ?? this.idOperacion,
      nombrePaciente: nombrePaciente ?? this.nombrePaciente,
      rut: rut ?? this.rut,
      fechaNacimiento: fechaNacimiento,
      sexo: sexo,
      direccion: direccion ?? this.direccion,
      tipoServicio: tipoServicio ?? this.tipoServicio,
      nombreProfesional: nombreProfesional ?? this.nombreProfesional,
      allergies: allergies ?? this.allergies,
      chronicConditions: chronicConditions ?? this.chronicConditions,
      operations: operations ?? this.operations,
    );
  }
}
