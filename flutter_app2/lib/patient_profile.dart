import 'package:flutter/material.dart';

import 'patients.dart';
import 'services/firestore_repository.dart';
import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';

class PatientProfilePage extends StatefulWidget {
  const PatientProfilePage({super.key});

  @override
  State<PatientProfilePage> createState() => _PatientProfilePageState();
}

class _PatientProfilePageState extends State<PatientProfilePage> {
  final FirestoreRepository _repository = FirestoreRepository();
  Paciente? _patient;
  bool _isLoading = true;
  String? _error;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is Paciente) {
      _setPatient(args);
    } else if (args is String) {
      _loadPatientById(args);
    } else {
      final stored = NavigationService.instance.selectedPatient;
      if (stored != null) {
        _setPatient(stored);
      } else {
        setState(() {
          _isLoading = false;
          _error = 'Selecciona un paciente desde el listado.';
        });
      }
    }
  }

  Future<void> _loadPatientById(String id) async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    final patient = await _repository.getPatientById(id);
    if (!mounted) return;
    if (patient == null) {
      setState(() {
        _isLoading = false;
        _error = 'Paciente no encontrado.';
      });
    } else {
      _setPatient(patient);
    }
  }

  void _setPatient(Paciente patient) {
    NavigationService.instance.setSelectedPatient(patient);
    setState(() {
      _patient = patient;
      _isLoading = false;
      _error = null;
    });
  }

  void _openMedicalRecord() {
    if (_patient == null) return;
    Navigator.pushNamed(
      context,
      '/fichaMedica',
      arguments: _patient,
    );
  }

  @override
  Widget build(BuildContext context) {
    final breadcrumbs =
        NavigationService.instance.buildPatientProfileBreadcrumbs(_patient);
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Perfil del paciente'),
        actions: [
          IconButton(
            icon: Icon(Icons.person, color: colorScheme.onSurface),
            onPressed: () => Navigator.pushNamed(context, '/perfilUsuario'),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? _ErrorView(message: _error!)
              : _patient == null
                  ? _ErrorView(
                      message: 'Paciente no disponible',
                      action: () => Navigator.pushNamed(context, '/pacientes'),
                    )
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          BreadcrumbBar(
                            breadcrumbs: breadcrumbs,
                            onTap: (crumb) {
                              if (crumb.route != '/perfilPaciente') {
                                Navigator.pushNamed(
                                  context,
                                  crumb.route,
                                  arguments: crumb.arguments,
                                );
                              }
                            },
                          ),
                          const SizedBox(height: 20),
                          Center(
                            child: Column(
                              children: [
                                CircleAvatar(
                                  radius: 50,
                                  backgroundColor:
                                      colorScheme.primaryContainer,
                                  child: Icon(
                                    Icons.person,
                                    size: 50,
                                    color: colorScheme.onPrimaryContainer,
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  _patient!.nombreCompleto,
                                  style: textTheme.headlineSmall?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text('RUT: ${_patient!.rut}'),
                                Text('Sexo: ${_patient!.sexo}'),
                                Text(_patient!.direccion),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          Card(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18),
                            ),
                            color: colorScheme.surface,
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Información general',
                                    style: textTheme.titleMedium?.copyWith(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  _infoRow(
                                    Icons.badge,
                                    'ID paciente',
                                    _patient!.idpaciente,
                                  ),
                                  _infoRow(
                                    Icons.cake,
                                    'Fecha de nacimiento',
                                    _patient!.fechaNacimiento,
                                  ),
                                  _infoRow(
                                    Icons.home,
                                    'Dirección',
                                    _patient!.direccion,
                                  ),
                                  _infoRow(
                                    Icons.phone,
                                    'Teléfono',
                                    _patient!.telefono ?? '-',
                                  ),
                                  _infoRow(
                                    Icons.email,
                                    'Email',
                                    _patient!.email ?? '-',
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: _openMedicalRecord,
                              icon: const Icon(Icons.description),
                              label: const Text('Ver ficha médica'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: colorScheme.primary,
                                foregroundColor: colorScheme.onPrimary,
                                padding:
                                    const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(22),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
    );
  }

  Widget _infoRow(IconData icon, String label, String value) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, color: colorScheme.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              value,
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, this.action});

  final String message;
  final VoidCallback? action;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            message,
            style: TextStyle(color: colorScheme.onSurfaceVariant),
          ),
          if (action != null)
            TextButton(
              onPressed: action,
              child: const Text('Volver al listado'),
            ),
        ],
      ),
    );
  }
}
