import 'package:flutter/material.dart';

import 'patients.dart';
import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';
import 'app_localizations.dart';

class InicioPage extends StatefulWidget {
  const InicioPage({super.key});

  @override
  State<InicioPage> createState() => _InicioPageState();
}

class _InicioPageState extends State<InicioPage> {
  Paciente? _selectedPatient;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is Paciente) {
      _selectedPatient = args;
      NavigationService.instance.setSelectedPatient(args);
    } else {
      _selectedPatient = NavigationService.instance.selectedPatient;
    }
  }

  void _goToList() {
    Navigator.pushNamed(context, '/pacientes');
  }

  void _goToMedicalRecord() {
    if (_selectedPatient == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecciona un paciente primero.')),
      );
      return;
    }

    Navigator.pushNamed(
      context,
      '/fichaMedica',
      arguments: _selectedPatient,
    );
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    final l10n = AppLocalizations.of(context)!;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.homeTitle),
        actions: [
          IconButton(
            icon: CircleAvatar(
              backgroundColor: colorScheme.primaryContainer,
              child: Icon(Icons.person, color: colorScheme.onPrimaryContainer),
            ),
            onPressed: () => Navigator.pushNamed(context, '/perfilUsuario'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BreadcrumbBar(
              breadcrumbs: NavigationService.instance.buildInicioBreadcrumbs(
                inicioLabel: l10n.homeTitle,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              l10n.mainPanelTitle,
              style: textTheme.titleLarge?.copyWith(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            _selectedPatient != null
                ? _SelectedPatientCard(
                    patient: _selectedPatient!,
                    onTap: _goToMedicalRecord,
                  )
                : _EmptyPatientCard(onTap: _goToList),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _goToList,
              icon: const Icon(Icons.search),
              label: Text(l10n.searchBasic),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(50),
                backgroundColor: colorScheme.primary,
                foregroundColor: colorScheme.onPrimary,
              ),
            ),
            const SizedBox(height: 20),
            GestureDetector(
              onTap: () => Navigator.pushNamed(context, '/fingerprint'),
              child: Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(22),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Row(
                    children: [
                      Icon(
                        Icons.fingerprint,
                        size: 64,
                        color: colorScheme.secondary,
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              l10n.fingerprintCardTitle,
                              style: textTheme.titleMedium?.copyWith(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              l10n.fingerprintCardSubtitle,
                              style: textTheme.bodyMedium?.copyWith(
                                color: colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(Icons.chevron_right),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SelectedPatientCard extends StatelessWidget {
  const _SelectedPatientCard({
    required this.patient,
    required this.onTap,
  });

  final Paciente patient;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      color: colorScheme.surface,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              patient.nombreCompleto,
              style: textTheme.titleMedium?.copyWith(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 6),
            Text('${l10n.rut}: ${patient.rut}'),
            Text('${l10n.sex}: ${patient.sexo}'),
            Text('${l10n.address}: ${patient.direccion}'),
            const SizedBox(height: 12),
            Align(
              alignment: Alignment.centerRight,
              child: TextButton.icon(
                onPressed: onTap,
                icon: const Icon(Icons.description),
                label: Text(l10n.viewMedicalRecord),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyPatientCard extends StatelessWidget {
  const _EmptyPatientCard({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      color: colorScheme.surface,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              l10n.noPatientSelected,
              style: textTheme.titleSmall?.copyWith(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              l10n.selectPatientHint,
              textAlign: TextAlign.center,
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: onTap,
              child: const Text('Ir al listado'),
            ),
          ],
        ),
      ),
    );
  }
}
