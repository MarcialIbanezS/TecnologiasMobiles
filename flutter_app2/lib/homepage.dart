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
              icon: const Icon(Icons.person_add),
              label: const Text('Agregar paciente de prueba'),
              onPressed: () async {
                final ref = await db.crearPaciente(
                  nombre: 'santiago gei',
                  rut: '11111678-9',
                  fechaNacimiento: '2004-03-15',
                  sexo: 'Masculon',
                  direccion: 'Av. Libertador 1234, Santiago',
                  telefono:'+56987654321',
                );

                await db.crearFichaMedica(
                  pacienteId: ref.id,
                  fechaIngreso: '2025-09-20',
                  consulta: 'Consulta Externa',
                  profesional: 'Dr. matias sandoval',
                  diagnosticos: ['Gripe comun'],
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
    );
  }
}
