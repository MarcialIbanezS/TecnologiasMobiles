import 'dart:convert';

import 'package:http/http.dart' as http;

import '../auth_user.dart';
import 'auth_api_service.dart';

class ClientApiService {
  ClientApiService({
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

  Future<List<Map<String, dynamic>>> fetchClients() async {
    final res = await _client.get(_uri('/clients'), headers: _jsonHeaders);
    _throwIfError(res);
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    final list = (data['clients'] as List<dynamic>? ?? []).cast<Map<String, dynamic>>();
    return list;
  }

  Future<Map<String, dynamic>> fetchClient(int id) async {
    final res = await _client.get(_uri('/clients/$id'), headers: _jsonHeaders);
    _throwIfError(res);
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return data['client'] as Map<String, dynamic>? ?? {};
  }

  Future<void> createClient(String nombre) async {
    final res = await _client.post(
      _uri('/clients'),
      headers: _jsonHeaders,
      body: jsonEncode({'cliente': nombre}),
    );
    _throwIfError(res);
  }

  Future<void> updateClient(int id, String nombre) async {
    final res = await _client.put(
      _uri('/clients/$id'),
      headers: _jsonHeaders,
      body: jsonEncode({'cliente': nombre}),
    );
    _throwIfError(res);
  }

  Future<void> deleteClient(int id) async {
    final res = await _client.delete(_uri('/clients/$id'), headers: _jsonHeaders);
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
