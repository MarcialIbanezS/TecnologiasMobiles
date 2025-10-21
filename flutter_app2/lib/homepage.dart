import 'package:flutter/material.dart';
import 'database_service.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class HomeRoute extends StatefulWidget {
  const HomeRoute({super.key});

  @override
  State<HomeRoute> createState() => _HomeRouteState();
}

class _HomeRouteState extends State<HomeRoute> {
  final db = DatabaseService();
  String? dogImageUrl;
  bool loadingDog = false;

  /// 🔹 Llama a la Dog API
  Future<void> fetchRandomDog() async {
    setState(() => loadingDog = true);
    try {
      final response =
          await http.get(Uri.parse("https://dog.ceo/api/breeds/image/random"));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          dogImageUrl = data["message"];
          loadingDog = false;
        });
      } else {
        throw Exception("Error al obtener imagen del perro");
      }
    } catch (e) {
      setState(() => loadingDog = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    fetchRandomDog(); // carga una imagen al iniciar
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio - Ficha Médica Firebase'),
        backgroundColor: Colors.blueAccent,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 10),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              /// 🐶 Imagen de la Dog API
              const Text(
                "🐾 Imagen aleatoria de perro 🐾",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),

              Container(
                height: 250,
                width: double.infinity,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(15),
                  color: Colors.blue.shade50,
                ),
                child: loadingDog
                    ? const CircularProgressIndicator()
                    : dogImageUrl != null
                        ? ClipRRect(
                            borderRadius: BorderRadius.circular(15),
                            child: Image.network(
                              dogImageUrl!,
                              height: 250,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          )
                        : const Text("No se pudo cargar la imagen 🐶"),
              ),

              const SizedBox(height: 10),

              ElevatedButton.icon(
                icon: const Icon(Icons.refresh),
                label: const Text("Cambiar perro"),
                onPressed: fetchRandomDog,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orangeAccent,
                ),
              ),

              const SizedBox(height: 40),

              /// 🔹 Botones originales
              ElevatedButton.icon(
                icon: const Icon(Icons.cloud_done),
                label: const Text('Probar conexión Firebase'),
                onPressed: db.testFirestore,
              ),
              const SizedBox(height: 20),

              ElevatedButton.icon(
                icon: const Icon(Icons.upload),
                label: const Text('Cargar listas base'),
                onPressed: db.crearListasBase,
              ),
              const SizedBox(height: 20),

              ElevatedButton.icon(
                icon: const Icon(Icons.person_add),
                label: const Text('Agregar paciente de prueba'),
                onPressed: () async {
                  final ref = await db.crearPaciente(
                    nombre: 'santiago gei',
                    rut: '11111678-9',
                    fechaNacimiento: '2004-03-15',
                    sexo: 'Masculino',
                    direccion: 'Av. Libertador 1234, Santiago',
                    telefono: '+56987654321',
                  );

                  await db.crearFichaMedica(
                    pacienteId: ref.id,
                    fechaIngreso: '2025-09-20',
                    consulta: 'Consulta Externa',
                    profesional: 'Dr. Matías Sandoval',
                    diagnosticos: ['Gripe común'],
                    alergias: ['Penicilina'],
                    cronicos: ['Diabetes Mellitus Tipo 2'],
                    medicamentos: ['Paracetamol 500mg'],
                    operaciones: [],
                  );
                },
              ),
              const SizedBox(height: 20),

              ElevatedButton.icon(
                icon: const Icon(Icons.list),
                label: const Text('Ver pacientes'),
                onPressed: () {
                  Navigator.pushNamed(context, '/second');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
