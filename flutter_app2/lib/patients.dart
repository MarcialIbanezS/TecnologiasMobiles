import 'package:flutter/material.dart';
import 'database_service.dart';
import 'package:intl/intl.dart';

class PatientsPage extends StatefulWidget {
  const PatientsPage({super.key});

  @override
  State<PatientsPage> createState() => _PatientsPageState();
}

class _PatientsPageState extends State<PatientsPage> {
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
        final nombre = (p['nombre'] ?? '').toLowerCase();
        final rut = (p['rut'] ?? '').toLowerCase();
        return nombre.contains(filtro) || rut.contains(filtro);
      }).toList();
    });
  }

  String calcularEdad(String fecha) {
    try {
      final nacimiento = DateTime.parse(fecha);
      final hoy = DateTime.now();
      int edad = hoy.year - nacimiento.year;
      if (hoy.month < nacimiento.month ||
          (hoy.month == nacimiento.month && hoy.day < nacimiento.day)) {
        edad--;
      }
      return "$edad años";
    } catch (e) {
      return "-";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Pacientes'),
        backgroundColor: Colors.green,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: cargarPacientes,
          ),
        ],
      ),
      body: cargando
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: TextField(
                    onChanged: filtrarPacientes,
                    decoration: InputDecoration(
                      labelText: 'Buscar paciente...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: filtrados.isEmpty
                      ? const Center(child: Text('No hay pacientes encontrados'))
                      : ListView.builder(
                          itemCount: filtrados.length,
                          itemBuilder: (context, index) {
                            final p = filtrados[index];
                            return Card(
                              color: Colors.white,
                              margin: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              elevation: 3,
                              child: ListTile(
                                leading: const Icon(Icons.person_outline,
                                    color: Colors.green),
                                title: Text(p['nombre'] ?? 'Sin nombre'),
                                subtitle: Text(
                                  'RUT: ${p['rut']} | ${p['sexo']}'
                                  '\nEdad: ${calcularEdad(p['fechaNacimiento'] ?? '')}',
                                ),
                                isThreeLine: true,
                                trailing: IconButton(
                                  icon: const Icon(Icons.chevron_right),
                                  onPressed: () {
                                    Navigator.pushNamed(
                                      context,
                                      '/third',
                                      arguments: p['id'],
                                    );
                                  },
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final ref = await db.crearPaciente(
              nombre: 'Nuevo Paciente ${DateFormat("HH:mm:ss").format(DateTime.now())}',
              rut: '99999999-9',
              fechaNacimiento: '2000-01-01',
              sexo: 'Femenino',
              direccion: 'Dirección genérica',
            );
          await db.crearFichaMedica(
            pacienteId: ref.id,
            fechaIngreso: DateFormat("yyyy-MM-dd").format(DateTime.now()),
            consulta: 'Consulta de Prueba',
            profesional: 'Dr. Sistema',
            diagnosticos: ['Evaluación inicial'],
            alergias: [],
            cronicos: [],
            medicamentos: [],
            operaciones: [],
          );
          cargarPacientes();
        },
        icon: const Icon(Icons.person_add),
        label: const Text('Agregar'),
        backgroundColor: Colors.green,
      ),
    );
  }
}
