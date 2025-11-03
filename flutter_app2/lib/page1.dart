import 'package:flutter/material.dart';
import 'database_service.dart';

class SecondRoute extends StatefulWidget {
  const SecondRoute({super.key});

  @override
  State<SecondRoute> createState() => _SecondRouteState();
}

class _SecondRouteState extends State<SecondRoute> {
  final DatabaseService db = DatabaseService();
  List<Map<String, dynamic>> pacientes = [];
  List<Map<String, dynamic>> filtrados = [];
  bool cargando = true;
  String filtro = "";

  @override
  void initState() {
    super.initState();
    cargarPacientes();
  }

  Future<void> cargarPacientes() async {
    final lista = await db.listarPacientes();
    setState(() {
      pacientes = lista;
      filtrados = lista;
      cargando = false;
    });
  }

  void filtrarPacientes(String texto) {
    setState(() {
      filtro = texto.toLowerCase();
      filtrados = pacientes.where((p) {
        final nombre = (p['nombreCompleto'] ?? '').toLowerCase();
        final rut = (p['rut'] ?? '').toLowerCase();
        return nombre.contains(filtro) || rut.contains(filtro);
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      appBar: AppBar(
        title: const Text(
          'Búsqueda de Pacientes',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF009688),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // busqueda
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: TextField(
                    onChanged: filtrarPacientes,
                    decoration: InputDecoration(
                      hintText: 'Buscar RUT o Nombre...',
                      prefixIcon: const Icon(Icons.search, color: Colors.grey),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(
                          vertical: 15, horizontal: 20),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),

                // Lista de pacientes
                Expanded(
                  child: filtrados.isEmpty
                      ? const Center(
                          child: Text(
                            'No se encontraron pacientes',
                            style: TextStyle(
                                color: Colors.black54,
                                fontSize: 16,
                                fontWeight: FontWeight.w500),
                          ),
                        )
                        
                      : ListView.builder(
                          itemCount: filtrados.length,
                          itemBuilder: (context, index) {
                            final p = filtrados[index];
                            return Card(
                              color: Colors.white,
                              margin: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 6),
                              elevation: 2,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(15),
                              ),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.teal.shade100,
                                  child: const Icon(Icons.person,
                                      color: Colors.teal),
                                ),
                                title: Text(
                                  p['nombreCompleto'] ?? 'Sin nombre',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                subtitle: Text(
                                  'RUT: ${p['rut']}\nSexo: ${p['sexo']}\nFecha Nac: ${p['fechaNacimiento']}',
                                ),
                                trailing: const Icon(
                                  Icons.arrow_forward_ios_rounded,
                                  color: Colors.grey,
                                  size: 18,
                                ),
                                onTap: () {
                                  Navigator.pushNamed(
                                    context,
                                    '/profile',
                                    arguments: p['id'],
                                  );
                                },

                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: cargarPacientes,
        backgroundColor: const Color(0xFF00796B),
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
