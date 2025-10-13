// LLAMADO DE DATOS CRUD A LA BDD - Patient Model and Service

import 'dart:convert';
import 'package:http/http.dart' as http;

/// Patient model class representing a patient record
class Patient {
  final int? idpaciente;
  final String nombre;
  final String? apellidopaterno;
  final String? apellidomaterno;
  final String rut;
  final DateTime? fechanacimiento;
  final String? genero;
  final String? telefono;
  final String? email;
  final String? direccion;
  final int? idcliente;
  final List<int>? allergies;
  final List<int>? chronicDiseases;

  Patient({
    this.idpaciente,
    required this.nombre,
    this.apellidopaterno,
    this.apellidomaterno,
    required this.rut,
    this.fechanacimiento,
    this.genero,
    this.telefono,
    this.email,
    this.direccion,
    this.idcliente,
    this.allergies,
    this.chronicDiseases,
  });

  /// Factory constructor to create Patient from JSON
  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      idpaciente: json['idpaciente'] as int?,
      nombre: json['nombre'] as String,
      apellidopaterno: json['apellidopaterno'] as String?,
      apellidomaterno: json['apellidomaterno'] as String?,
      rut: json['rut'] as String,
      fechanacimiento: json['fechanacimiento'] != null
          ? DateTime.parse(json['fechanacimiento'] as String)
          : null,
      genero: json['genero'] as String?,
      telefono: json['telefono'] as String?,
      email: json['email'] as String?,
      direccion: json['direccion'] as String?,
      idcliente: json['idcliente'] as int?,
      allergies: (json['allergies'] as List<dynamic>?)
          ?.map((e) => e as int)
          .toList(),
      chronicDiseases: (json['chronicDiseases'] as List<dynamic>?)
          ?.map((e) => e as int)
          .toList(),
    );
  }

  /// Convert Patient to JSON
  Map<String, dynamic> toJson() {
    return {
      if (idpaciente != null) 'idpaciente': idpaciente,
      'nombre': nombre,
      if (apellidopaterno != null) 'apellidopaterno': apellidopaterno,
      if (apellidomaterno != null) 'apellidomaterno': apellidomaterno,
      'rut': rut,
      if (fechanacimiento != null)
        'fechanacimiento': fechanacimiento!.toIso8601String(),
      if (genero != null) 'genero': genero,
      if (telefono != null) 'telefono': telefono,
      if (email != null) 'email': email,
      if (direccion != null) 'direccion': direccion,
      if (idcliente != null) 'idcliente': idcliente,
      if (allergies != null) 'allergies': allergies,
      if (chronicDiseases != null) 'chronicDiseases': chronicDiseases,
    };
  }

  /// Create a copy of the patient with updated fields
  Patient copyWith({
    int? idpaciente,
    String? nombre,
    String? apellidopaterno,
    String? apellidomaterno,
    String? rut,
    DateTime? fechanacimiento,
    String? genero,
    String? telefono,
    String? email,
    String? direccion,
    int? idcliente,
    List<int>? allergies,
    List<int>? chronicDiseases,
  }) {
    return Patient(
      idpaciente: idpaciente ?? this.idpaciente,
      nombre: nombre ?? this.nombre,
      apellidopaterno: apellidopaterno ?? this.apellidopaterno,
      apellidomaterno: apellidomaterno ?? this.apellidomaterno,
      rut: rut ?? this.rut,
      fechanacimiento: fechanacimiento ?? this.fechanacimiento,
      genero: genero ?? this.genero,
      telefono: telefono ?? this.telefono,
      email: email ?? this.email,
      direccion: direccion ?? this.direccion,
      idcliente: idcliente ?? this.idcliente,
      allergies: allergies ?? this.allergies,
      chronicDiseases: chronicDiseases ?? this.chronicDiseases,
    );
  }
}

/// Service class for patient CRUD operations
class PatientService {
  static const String baseUrl = 'http://localhost:3000/api'; // Update with your API URL
  
  /// Get all patients
  static Future<List<Patient>> getAllPatients() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/patients'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['success'] == true) {
          final List<dynamic> patientsJson = data['patients'] as List<dynamic>;
          return patientsJson
              .map((patientJson) => Patient.fromJson(patientJson as Map<String, dynamic>))
              .toList();
        } else {
          throw Exception('Failed to fetch patients');
        }
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } catch (error) {
      print('Get patients error: $error');
      throw Exception('Failed to fetch patients: $error');
    }
  }

  /// Get patient by ID
  static Future<Patient?> getPatientById(int patientId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/patients/$patientId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['success'] == true) {
          return Patient.fromJson(data['patient'] as Map<String, dynamic>);
        } else {
          return null;
        }
      } else if (response.statusCode == 404) {
        return null; // Patient not found
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } catch (error) {
      print('Get patient error: $error');
      throw Exception('Failed to fetch patient: $error');
    }
  }

  /// Create new patient
  static Future<int> createPatient(Patient patient) async {
    try {
      // Validate required fields
      if (patient.nombre.isEmpty || patient.rut.isEmpty) {
        throw Exception('Name and RUT are required');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/patients'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(patient.toJson()),
      );

      if (response.statusCode == 201) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['success'] == true) {
          return data['patientId'] as int;
        } else {
          throw Exception('Failed to create patient');
        }
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to create patient');
      }
    } catch (error) {
      print('Create patient error: $error');
      throw Exception('Failed to create patient: $error');
    }
  }

  /// Update patient
  static Future<bool> updatePatient(int patientId, Patient patient) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/patients/$patientId'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(patient.toJson()),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['success'] == true;
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to update patient');
      }
    } catch (error) {
      print('Update patient error: $error');
      throw Exception('Failed to update patient: $error');
    }
  }

  /// Delete patient
  static Future<bool> deletePatient(int patientId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/patients/$patientId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return data['success'] == true;
      } else if (response.statusCode == 404) {
        throw Exception('Patient not found');
      } else {
        final Map<String, dynamic> errorData = json.decode(response.body);
        throw Exception(errorData['error'] ?? 'Failed to delete patient');
      }
    } catch (error) {
      print('Delete patient error: $error');
      throw Exception('Failed to delete patient: $error');
    }
  }
}