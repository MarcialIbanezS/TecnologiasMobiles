import 'package:flutter/material.dart';
import 'database_service.dart';

class HomeRoute extends StatelessWidget {
  const HomeRoute({super.key});

  @override
  Widget build(BuildContext context) {
    final db = DatabaseService();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Inicio - Ficha Médica Firebase'),
        backgroundColor: Colors.blueAccent,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
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
              icon: const Icon(Icons.playlist_add),
              label: const Text('Cargar pacientes de ejemplo'),
              onPressed: () async {
                await db.crearListasBaseConFichas();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('✅ Pacientes de ejemplo creados con fichas médicas'),
                    duration: Duration(seconds: 3),
                  ),
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
    );
  }
}
