import 'package:cloud_firestore/cloud_firestore.dart';

import '../medical_record.dart';
import '../patients.dart';

class FirestoreRepository {
  FirestoreRepository({FirebaseFirestore? firestore})
      : _firestore = firestore ?? FirebaseFirestore.instance;

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _patientsRef =>
      _firestore.collection('paciente');
  CollectionReference<Map<String, dynamic>> get _medicalRecordsRef =>
      _firestore.collection('fichamedica');

  Future<List<Paciente>> fetchPatients() async {
    final snapshot = await _patientsRef.get();
    return snapshot.docs
        .map((doc) => Paciente.fromFirestore(doc.data(), doc.id))
        .toList();
  }

  Future<Paciente?> getPatientById(String documentId) async {
    final doc = await _patientsRef.doc(documentId).get();
    if (!doc.exists) return null;
    return Paciente.fromFirestore(doc.data()!, doc.id);
  }

  Future<void> deletePatient(String documentId) async {
    await _patientsRef.doc(documentId).delete();
  }

  Future<List<MedicalRecord>> fetchMedicalRecordsByPatient(
    String patientDocumentId, {
    String? patientCode,
  }) async {
    Future<QuerySnapshot<Map<String, dynamic>>> _runQuery(String id) {
      return _medicalRecordsRef.where('idpaciente', isEqualTo: id).get();
    }

    var snapshot = await _runQuery(patientDocumentId);
    if (snapshot.docs.isEmpty &&
        patientCode != null &&
        patientCode != patientDocumentId) {
      snapshot = await _runQuery(patientCode);
    }

    final records = snapshot.docs
        .map((doc) => MedicalRecord.fromFirestore(doc.data(), doc.id))
        .toList();

    records.sort((a, b) {
      final aDate = a.fechaIngreso ?? DateTime.fromMillisecondsSinceEpoch(0);
      final bDate = b.fechaIngreso ?? DateTime.fromMillisecondsSinceEpoch(0);
      return bDate.compareTo(aDate);
    });

    return records;
  }

  Future<DetailedMedicalRecord?> getMedicalRecordDetails(
    String recordId,
  ) async {
    final doc = await _medicalRecordsRef.doc(recordId).get();
    if (!doc.exists) return null;
    return DetailedMedicalRecord.fromFirestore(doc.data()!, doc.id);
  }

  Future<void> updateMedicalRecord(
    String recordId,
    Map<String, dynamic> payload,
  ) async {
    await _medicalRecordsRef.doc(recordId).update(payload);
  }

  String formatDate(DateTime? date) {
    if (date == null) return '';
    final day = date.day.toString().padLeft(2, '0');
    final month = date.month.toString().padLeft(2, '0');
    final year = date.year.toString();
    return '$day/$month/$year';
  }

  int calculateAge(DateTime? birthDate) {
    if (birthDate == null) return 0;
    final today = DateTime.now();
    var age = today.year - birthDate.year;
    if (today.month < birthDate.month ||
        (today.month == birthDate.month && today.day < birthDate.day)) {
      age--;
    }
    return age;
  }

  String generateMedicalRecordSummary(DetailedMedicalRecord record) {
    final buffer = StringBuffer()
      ..writeln(
        'FICHA MÉDICA - ${record.nombrePaciente ?? 'Paciente sin nombre'}',
      )
      ..writeln('==============================================')
      ..writeln('Paciente ID: ${record.patientId}')
      ..writeln('RUT: ${record.rut ?? 'N/A'}');

    if (record.fechaNacimiento != null) {
      buffer.writeln('Edad: ${calculateAge(record.fechaNacimiento)} años');
    }

    buffer
      ..writeln('Sexo: ${record.sexo ?? 'N/A'}')
      ..writeln('Dirección: ${record.direccion ?? 'N/A'}')
      ..writeln('Fecha de ingreso: ${formatDate(record.fechaIngreso)}');

    if (record.tipoServicio != null) {
      buffer.writeln('Servicio: ${record.tipoServicio}');
    }
    if (record.nombreProfesional != null) {
      buffer.writeln('Profesional: ${record.nombreProfesional}');
    }
    if (record.fechaConsulta != null) {
      buffer.writeln('Fecha de consulta: ${formatDate(record.fechaConsulta)}');
    }
    if (record.idAlergia != null) {
      buffer.writeln('Alergias: ${record.idAlergia}');
    }
    if (record.idCronico != null) {
      buffer.writeln('Condiciones crónicas: ${record.idCronico}');
    }
    if (record.idOperacion != null) {
      buffer.writeln('Operaciones: ${record.idOperacion}');
    }
    if (record.allergies.isNotEmpty) {
      buffer.writeln('Listado alergias: ${record.allergies.join(', ')}');
    }
    if (record.chronicConditions.isNotEmpty) {
      buffer.writeln(
        'Listado condiciones: ${record.chronicConditions.join(', ')}',
      );
    }
    if (record.operations.isNotEmpty) {
      buffer.writeln('Listado operaciones: ${record.operations.join(', ')}');
    }

    buffer.writeln('Generado el: ${formatDate(DateTime.now())}');
    return buffer.toString();
  }
}
