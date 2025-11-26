import 'dart:convert';

import 'package:http/http.dart' as http;

import '../medical_record.dart';
import 'auth_api_service.dart';

class MedicalRecordApiService {
  MedicalRecordApiService({
    http.Client? client,
    AuthApiService? authService,
  })  : _client = client ?? http.Client(),
        _authService = authService ?? AuthApiService();

  final http.Client _client;
  final AuthApiService _authService;

  String get _base => _authService.apiBaseUrl;

  Uri _uri(String path) {
    final base = _base.endsWith('/') ? _base.substring(0, _base.length - 1) : _base;
    final normalized = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$base$normalized');
  }

  Map<String, String> get _jsonHeaders => {'Content-Type': 'application/json'};

  Future<List<MedicalRecord>> fetchByPatient(String patientId) async {
    final res = await _client.get(_uri('/medical-records/patient/$patientId'), headers: _jsonHeaders);
    _throwIfError(res);
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final list = (data['records'] as List<dynamic>? ?? [])
        .map((e) => MedicalRecord.fromFirestore(e as Map<String, dynamic>, '${e['idfichamedica'] ?? e['id'] ?? ''}'))
        .toList();
    return list;
  }

  Future<DetailedMedicalRecord?> fetchDetails(String recordId) async {
    final res = await _client.get(_uri('/medical-records/$recordId'), headers: _jsonHeaders);
    _throwIfError(res);
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final record = data['record'] as Map<String, dynamic>?;
    if (record == null) return null;
    return DetailedMedicalRecord.fromFirestore(record, '${record['idfichamedica'] ?? recordId}');
  }

  Future<void> updateRecord(String recordId, Map<String, dynamic> payload) async {
    final res = await _client.put(
      _uri('/medical-records/$recordId'),
      headers: _jsonHeaders,
      body: jsonEncode(payload),
    );
    _throwIfError(res);
  }

  Future<void> createRecord(Map<String, dynamic> payload) async {
    final res = await _client.post(
      _uri('/medical-records'),
      headers: _jsonHeaders,
      body: jsonEncode(payload),
    );
    _throwIfError(res);
  }

  void _throwIfError(http.Response res) {
    if (res.statusCode >= 400) {
      throw Exception('Error HTTP ${res.statusCode}: ${res.body}');
    }
  }

  void dispose() {
    _client.close();
  }
}
