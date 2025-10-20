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
                  nombre: 'María González López',
                  rut: '12345678-9',
                  fechaNacimiento: '1985-03-15',
                  sexo: 'Femenino',
                  direccion: 'Av. Libertador 1234, Santiago',
                );

                await db.crearFichaMedica(
                  pacienteId: ref.id,
                  fechaIngreso: '2025-09-20',
                  consulta: 'Consulta Externa',
                  profesional: 'Dr. Carlos Mendoza',
                  diagnosticos: ['Infección respiratoria aguda'],
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
