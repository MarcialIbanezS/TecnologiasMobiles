import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../auth_user.dart';

class AuthApiService {
  AuthApiService({http.Client? client}) : _client = client ?? http.Client();

  static const String _storageKey = 'medical_app_user';
  static const String _defaultApiUrl = 'http://localhost:3000/api';
  static const String _envApiUrl = String.fromEnvironment('API_URL');

  final http.Client _client;

  String get _apiBaseUrl =>
      _envApiUrl.isNotEmpty ? _envApiUrl : _defaultApiUrl;

  String get apiBaseUrl => _apiBaseUrl;

  Uri _buildUri(String path) {
    final base = _apiBaseUrl.endsWith('/')
        ? _apiBaseUrl.substring(0, _apiBaseUrl.length - 1)
        : _apiBaseUrl;
    final normalizedPath = path.startsWith('/') ? path : '/$path';
    return Uri.parse('$base$normalizedPath');
  }

  Future<AuthUser?> login(String username, String password) async {
    final response = await _client.post(
      _buildUri('/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode >= 400) {
      throw Exception('Credenciales inválidas (${response.statusCode})');
    }

    final body = jsonDecode(response.body) as Map<String, dynamic>;
    if (body['success'] == true && body['user'] != null) {
      final user = AuthUser.fromJson(body['user'] as Map<String, dynamic>);
      await _persistUser(user);
      return user;
    }

    throw Exception(body['message']?.toString() ?? 'Inicio de sesión fallido');
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
  }

  Future<AuthUser?> getStoredUser() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString(_storageKey);
    if (data == null) return null;
    try {
      final parsed = jsonDecode(data) as Map<String, dynamic>;
      return AuthUser.fromJson(parsed);
    } catch (_) {
      return null;
    }
  }

  Future<bool> hasSession() async {
    return (await getStoredUser()) != null;
  }

  Future<void> _persistUser(AuthUser user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_storageKey, jsonEncode(user.toJson()));
  }

  void dispose() {
    _client.close();
  }
}
