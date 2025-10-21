// lib/services/dog_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class DogService {
  static Future<String> getRandomDogImage() async {
    final url = Uri.parse("https://dog.ceo/api/breeds/image/random");
    final response = await http.get(url);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['message']; // URL de la imagen
    } else {
      throw Exception("Error al cargar imagen de perro");
    }
  }
}
