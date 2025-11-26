import 'dart:convert';
import 'dart:typed_data';
// ignore: avoid_web_libraries_in_flutter
import 'dart:html' as html;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'app_localizations.dart';

import 'medical_record.dart';
import 'patients.dart';
import 'services/firestore_repository.dart';
import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';

class MedicalRecordPage extends StatefulWidget {
  const MedicalRecordPage({super.key});

  @override
  State<MedicalRecordPage> createState() => _MedicalRecordPageState();
}

class _MedicalRecordPageState extends State<MedicalRecordPage> {
  final FirestoreRepository _repository = FirestoreRepository();
  List<MedicalRecord> _records = [];
  DetailedMedicalRecord? _selectedRecord;
  Paciente? _patient;
  bool _isLoading = true;
  String? _error;

  MedicalRecord _withPatientFallback(MedicalRecord record) {
    if (_patient == null) return record;
    final patient = _patient!;
    return record.copyWith(
      nombrePaciente: (record.nombrePaciente?.isNotEmpty ?? false)
          ? record.nombrePaciente
          : patient.nombreCompleto,
      rut: (record.rut?.isNotEmpty ?? false) ? record.rut : patient.rut,
      direccion: (record.direccion?.isNotEmpty ?? false)
          ? record.direccion
          : patient.direccion,
    );
  }

  DetailedMedicalRecord _withPatientFallbackDetail(
    DetailedMedicalRecord record,
  ) {
    if (_patient == null) return record;
    final patient = _patient!;
    return record.copyWith(
      nombrePaciente: (record.nombrePaciente?.isNotEmpty ?? false)
          ? record.nombrePaciente
          : patient.nombreCompleto,
      rut: (record.rut?.isNotEmpty ?? false) ? record.rut : patient.rut,
      direccion: (record.direccion?.isNotEmpty ?? false)
          ? record.direccion
          : patient.direccion,
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is Paciente) {
      _patient = args;
      NavigationService.instance.setSelectedPatient(args);
      _loadRecords();
    } else {
      final stored = NavigationService.instance.selectedPatient;
      if (stored == null) {
        setState(() {
          _isLoading = false;
          _error = 'Selecciona un paciente para ver su ficha.';
        });
      } else {
        _patient = stored;
        _loadRecords();
      }
    }
  }

  Future<void> _loadRecords() async {
    final l10n = AppLocalizations.of(context)!;
    if (_patient == null) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final records = await _repository.fetchMedicalRecordsByPatient(
        _patient!.id,
        patientCode: _patient!.idpaciente,
      );
      final enriched = records.map(_withPatientFallback).toList();
      setState(() {
        _records = enriched;
      });
      if (records.isNotEmpty) {
        await _loadRecordDetails(records.first.id);
      } else {
        setState(() {
          _isLoading = false;
          _selectedRecord = null;
          _error = l10n.noRecords;
        });
      }
    } catch (e) {
      setState(() {
        _error = l10n.errorLoadingRecords;
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _loadRecordDetails(String recordId) async {
    final l10n = AppLocalizations.of(context)!;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    final record = await _repository.getMedicalRecordDetails(recordId);
    if (!mounted) return;
    setState(() {
      _selectedRecord =
          record != null ? _withPatientFallbackDetail(record) : null;
      _isLoading = false;
    });
  }

  Future<void> _refresh() async {
    await _loadRecords();
  }

  void _downloadRecord() {
    if (_selectedRecord == null) return;
    final l10n = AppLocalizations.of(context)!;
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.description),
                title: Text(l10n.downloadTxt),
                onTap: () {
                  Navigator.pop(context);
                  _downloadTxt();
                },
              ),
              ListTile(
                leading: const Icon(Icons.picture_as_pdf),
                title: Text(l10n.downloadPdf),
                onTap: () {
                  Navigator.pop(context);
                  _downloadPdf();
                },
              ),
              ListTile(
                leading: const Icon(Icons.copy),
                title: Text(l10n.copyText),
                onTap: () {
                  Navigator.pop(context);
                  final summary =
                      _repository.generateMedicalRecordSummary(_selectedRecord!);
                  Clipboard.setData(ClipboardData(text: summary));
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(l10n.copiedMessage)),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _downloadTxt() {
    if (_selectedRecord == null) return;
    final summary = _repository.generateMedicalRecordSummary(_selectedRecord!);
    if (kIsWeb) {
      final bytes = utf8.encode(summary);
      final blob = html.Blob([bytes], 'text/plain', 'native');
      final url = html.Url.createObjectUrlFromBlob(blob);
      final anchor = html.AnchorElement(href: url)
        ..setAttribute(
            'download',
            'ficha-medica-${_selectedRecord?.nombrePaciente ?? 'paciente'}.txt')
        ..click();
      html.Url.revokeObjectUrl(url);
    } else {
      Printing.sharePdf(
        bytes: Uint8List.fromList(summary.codeUnits),
        filename: 'ficha-medica.txt',
      );
    }
  }

  Future<void> _downloadPdf() async {
    if (_selectedRecord == null) return;
    final record = _selectedRecord!;
    final doc = pw.Document();
    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                'Ficha médica',
                style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold),
              ),
              pw.SizedBox(height: 12),
              pw.Text('Paciente: ${record.nombrePaciente ?? 'N/A'}'),
              pw.Text('RUT: ${record.rut ?? 'N/A'}'),
              pw.Text('Dirección: ${record.direccion ?? 'N/A'}'),
              pw.SizedBox(height: 12),
              pw.Text('Fecha ingreso: ${_repository.formatDate(record.fechaIngreso)}'),
              pw.Text('Servicio: ${record.tipoServicio ?? 'N/A'}'),
              pw.Text('Profesional: ${record.nombreProfesional ?? 'N/A'}'),
              pw.Text('Fecha consulta: ${_repository.formatDate(record.fechaConsulta)}'),
              pw.SizedBox(height: 12),
              pw.Text('Alergia: ${record.idAlergia ?? 'N/A'}'),
              pw.Text('Condición crónica: ${record.idCronico ?? 'N/A'}'),
              pw.Text('Operación: ${record.idOperacion ?? 'N/A'}'),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      name: 'ficha-medica-${record.nombrePaciente ?? 'paciente'}.pdf',
      onLayout: (format) async => doc.save(),
    );
  }

  Future<void> _editRecord() async {
    if (_selectedRecord == null) return;
    final record = _selectedRecord!;
    final l10n = AppLocalizations.of(context)!;
    final formKey = GlobalKey<FormState>();
    final nombreController =
        TextEditingController(text: record.nombrePaciente ?? '');
    final rutController = TextEditingController(text: record.rut ?? '');
    final direccionController =
        TextEditingController(text: record.direccion ?? '');
    final alergiaController =
        TextEditingController(text: record.idAlergia ?? '');
    final cronicoController =
        TextEditingController(text: record.idCronico ?? '');
    final operacionController =
        TextEditingController(text: record.idOperacion ?? '');

    final result = await showModalBottomSheet<bool>(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom + 16,
          left: 16,
          right: 16,
          top: 24,
        ),
        child: Form(
          key: formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                l10n.editMedicalRecord,
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              _buildField(l10n.userLabel, nombreController, requiredField: true),
              _buildField(l10n.rut, rutController),
              _buildField(l10n.address, direccionController),
              _buildField(l10n.allergy, alergiaController),
              _buildField(l10n.chronicCondition, cronicoController),
              _buildField(l10n.operation, operacionController),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: Text(l10n.cancel),
                    ),
                  ),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        if (formKey.currentState?.validate() ?? false) {
                          Navigator.pop(context, true);
                        }
                      },
                      child: Text(l10n.save),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );

    if (result == true) {
      await _repository.updateMedicalRecord(record.id, {
        'nombrePaciente': nombreController.text.trim(),
        'rut': rutController.text.trim(),
        'direccion': direccionController.text.trim(),
        'idalergia': alergiaController.text.trim(),
        'idcronico': cronicoController.text.trim(),
        'idoperacion': operacionController.text.trim(),
      });
      await _loadRecordDetails(record.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ficha actualizada')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final breadcrumbs = NavigationService.instance.buildMedicalRecordBreadcrumbs(
      _patient,
      inicioLabel: l10n.homeTitle,
      patientsLabel: l10n.patients,
      recordLabel: l10n.medicalRecordTitle,
    );
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.medicalRecordTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, '/perfilUsuario'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BreadcrumbBar(
              breadcrumbs: breadcrumbs,
              onTap: (crumb) {
                if (crumb.route != '/fichaMedica') {
                  Navigator.pushNamed(
                    context,
                    crumb.route,
                    arguments: crumb.arguments,
                  );
                }
              },
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: _selectedRecord == null ? null : _downloadRecord,
                  icon: const Icon(Icons.download),
                  label: Text(l10n.download),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colorScheme.primary,
                    foregroundColor: colorScheme.onPrimary,
                  ),
                ),
                const SizedBox(width: 8),
                OutlinedButton.icon(
                  onPressed: _isLoading ? null : _refresh,
                  icon: const Icon(Icons.refresh),
                  label: Text(l10n.refresh),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: colorScheme.onSurface,
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: _selectedRecord == null ? null : _editRecord,
                  icon: const Icon(Icons.edit),
                  label: Text(l10n.edit),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colorScheme.primaryContainer,
                    foregroundColor: colorScheme.onPrimaryContainer,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_records.isNotEmpty)
              SizedBox(
                height: 48,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: _records.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (context, index) {
                    final record = _records[index];
                    final isSelected =
                        _selectedRecord != null && _selectedRecord!.id == record.id;
                    return ChoiceChip(
                      label: Text(
                        _repository.formatDate(record.fechaIngreso),
                      ),
                      selected: isSelected,
                      selectedColor: colorScheme.primary,
                      backgroundColor: colorScheme.surfaceVariant,
                      labelStyle: TextStyle(
                        color: isSelected
                            ? colorScheme.onPrimary
                            : colorScheme.onSurface,
                      ),
                      onSelected: (_) => _loadRecordDetails(record.id),
                    );
                  },
                ),
              ),
            const SizedBox(height: 16),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _error != null
                      ? Center(child: Text(_error!))
                      : _selectedRecord == null
                          ? Center(
                              child: Text(l10n.noRecordSelected),
                            )
                          : _MedicalRecordDetail(
                              record: _selectedRecord!,
                              repository: _repository,
                            ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller,
      {bool requiredField = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: TextFormField(
        controller: controller,
        validator: requiredField
            ? (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Campo requerido';
                }
                return null;
              }
            : null,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }
}

class _MedicalRecordDetail extends StatelessWidget {
  const _MedicalRecordDetail({
    required this.record,
    required this.repository,
  });

  final DetailedMedicalRecord record;
  final FirestoreRepository repository;

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return SingleChildScrollView(
      child: Column(
        children: [
          _DashboardCard(
            title: record.nombrePaciente ?? 'Paciente sin nombre',
            subtitle: record.rut ?? 'Sin RUT',
            icon: Icons.person,
            children: [
              _info(context, l10n.address, record.direccion ?? 'N/A'),
              _info(context, l10n.admissionDate,
                  repository.formatDate(record.fechaIngreso)),
              _info(context, l10n.service, record.tipoServicio ?? 'N/A'),
              _info(context, l10n.professional,
                  record.nombreProfesional ?? 'N/A'),
            ],
          ),
          _DashboardCard(
            title: 'Alergias',
            icon: Icons.warning_amber,
            children: [
              Text(record.idAlergia ?? 'Sin alergias registradas'),
            ],
          ),
          _DashboardCard(
            title: 'Condiciones crónicas',
            icon: Icons.medical_services,
            children: [
              Text(record.idCronico ?? 'Sin condiciones registradas'),
            ],
          ),
          _DashboardCard(
            title: 'Operaciones',
            icon: Icons.healing,
            children: [
              Text(record.idOperacion ?? 'Sin operaciones registradas'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _info(BuildContext context, String label, String value) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurface,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  const _DashboardCard({
    required this.title,
    required this.icon,
    this.subtitle,
    this.children = const [],
  });

  final String title;
  final String? subtitle;
  final IconData icon;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      color: colorScheme.surface,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: textTheme.titleMedium?.copyWith(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            if (subtitle != null) ...[
              const SizedBox(height: 4),
              Text(
                subtitle!,
                style: textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSurfaceVariant,
                ),
              ),
            ],
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}
