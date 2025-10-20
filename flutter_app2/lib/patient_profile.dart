import 'package:flutter/material.dart';
import 'database_service.dart';

class PatientProfilePage extends StatefulWidget {
  final String pacienteId;
  const PatientProfilePage({super.key, required this.pacienteId});

  @override
  State<PatientProfilePage> createState() => _PatientProfilePageState();
}

class _PatientProfilePageState extends State<PatientProfilePage> {
  final DatabaseService db = DatabaseService();
  Map<String, dynamic>? paciente;
  bool cargando = true;

  @override
  void initState() {
    super.initState();
    cargarPaciente();
  }

  Future<void> cargarPaciente() async {
    try {
      final snapshot = await db.listarPacientes();
      final encontrado =
          snapshot.firstWhere((p) => p['id'] == widget.pacienteId, orElse: () => {});
      setState(() {
        paciente = encontrado;
        cargando = false;
      });
    } catch (e) {
      print("Error cargando paciente: $e");
      setState(() => cargando = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (cargando) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (paciente == null || paciente!.isEmpty) {
      return Scaffold(
        appBar: AppBar(
          title: const Text("Perfil del Paciente"),
          backgroundColor: Colors.teal,
        ),
        body: const Center(child: Text("Paciente no encontrado")),
      );
    }

    final p = paciente!;
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text("Perfil del Paciente"),
        backgroundColor: const Color(0xFF009688),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            CircleAvatar(
              radius: 60,
              backgroundColor: Colors.teal.shade100,
              child: const Icon(Icons.person, size: 60, color: Colors.teal),
            ),
            const SizedBox(height: 20),
            Text(
              p['nombre'] ?? 'Sin nombre',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF004D40),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              "RUT: ${p['rut'] ?? '-'}",
              style: const TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 8),
            Text(
              p['sexo'] ?? '',
              style: const TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 8),
            Text(
              p['direccion'] ?? '',
              style: const TextStyle(color: Colors.black54),
            ),
            const SizedBox(height: 25),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Información General",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.teal,
                    ),
                  ),
                  const SizedBox(height: 10),
                  _infoRow(Icons.cake, "Fecha de nacimiento",
                      p['fechaNacimiento'] ?? '-'),
                  _infoRow(Icons.home, "Dirección", p['direccion'] ?? '-'),
                  _infoRow(Icons.phone, "Teléfono", p['telefono'] ?? '-'),
                ],
              ),
            ),
            const SizedBox(height: 40),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/third',
                  arguments: widget.pacienteId,
                );
              },
              icon: const Icon(Icons.description),
              label: const Text("Ver Ficha Médica"),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF009688),
                padding:
                    const EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, color: Colors.teal, size: 22),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              "$label: ",
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ),
          Flexible(
            flex: 2,
            child: Text(
              value,
              style: const TextStyle(color: Colors.black54),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
