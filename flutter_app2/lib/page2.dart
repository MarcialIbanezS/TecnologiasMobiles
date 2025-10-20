import 'package:flutter/material.dart';
import 'database_service.dart';

class ThirdRoute extends StatefulWidget {
  const ThirdRoute({super.key});

  @override
  State<ThirdRoute> createState() => _ThirdRouteState();
}

class _ThirdRouteState extends State<ThirdRoute> {
  final DatabaseService db = DatabaseService();
  List<Map<String, dynamic>> fichas = [];
  bool cargando = true;
  String? pacienteId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    pacienteId = ModalRoute.of(context)!.settings.arguments as String?;
    if (pacienteId != null) {
      cargarFichas();
    }
  }

  Future<void> cargarFichas() async {
    final lista = await db.obtenerFichasDePaciente(pacienteId!);
    setState(() {
      fichas = lista;
      cargando = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fichas Médicas del Paciente'),
        backgroundColor: Colors.deepPurple,
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : fichas.isEmpty
              ? const Center(child: Text('No hay fichas médicas registradas'))
              : ListView.builder(
                  itemCount: fichas.length,
                  itemBuilder: (context, index) {
                    final f = fichas[index];
                    return Card(
                      color: Colors.white,
                      margin: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 8),
                      elevation: 3,
                      child: ExpansionTile(
                        leading:
                            const Icon(Icons.description, color: Colors.blue),
                        title: Text(
                          f['consulta'] ?? 'Consulta sin nombre',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text('Fecha ingreso: ${f['fechaIngreso']}'),
                        children: [
                          _mostrarLista('Diagnósticos', f['diagnosticos']),
                          _mostrarLista('Alergias', f['alergias']),
                          _mostrarLista('Crónicos', f['cronicos']),
                          _mostrarLista('Medicamentos', f['medicamentos']),
                          _mostrarLista('Operaciones', f['operaciones']),
                          const SizedBox(height: 10),
                        ],
                      ),
                    );
                  },
                ),
      floatingActionButton: FloatingActionButton(
        onPressed: cargarFichas,
        backgroundColor: Colors.purple,
        child: const Icon(Icons.refresh),
      ),
    );
  }

  Widget _mostrarLista(String titulo, dynamic datos) {
    if (datos == null || (datos is List && datos.isEmpty)) {
      return ListTile(
        title: Text(titulo),
        subtitle: const Text('No hay registros'),
      );
    }

    if (datos is List) {
      return ListTile(
        title: Text(titulo),
        subtitle: Text(datos.join(', ')),
      );
    }

    return ListTile(
      title: Text(titulo),
      subtitle: Text(datos.toString()),
    );
  }
}
