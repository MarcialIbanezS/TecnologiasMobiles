import '../patients.dart';

class Breadcrumb {
  final String label;
  final String route;
  final Object? arguments;
  final bool isActive;

  const Breadcrumb({
    required this.label,
    required this.route,
    this.arguments,
    this.isActive = false,
  });

  Breadcrumb copyWith({
    String? label,
    String? route,
    Object? arguments,
    bool? isActive,
  }) {
    return Breadcrumb(
      label: label ?? this.label,
      route: route ?? this.route,
      arguments: arguments ?? this.arguments,
      isActive: isActive ?? this.isActive,
    );
  }
}

class NavigationService {
  NavigationService._();

  static final NavigationService instance = NavigationService._();

  Paciente? _selectedPatient;

  Paciente? get selectedPatient => _selectedPatient;

  void setSelectedPatient(Paciente? patient) {
    _selectedPatient = patient;
  }

  List<Breadcrumb> buildInicioBreadcrumbs({String inicioLabel = 'Inicio'}) {
    return [
      Breadcrumb(label: inicioLabel, route: '/inicio', isActive: true),
    ];
  }

  List<Breadcrumb> buildPatientListBreadcrumbs({
    String inicioLabel = 'Inicio',
    String patientsLabel = 'Pacientes',
  }) {
    return [
      Breadcrumb(label: inicioLabel, route: '/inicio'),
      Breadcrumb(
        label: patientsLabel,
        route: '/pacientes',
        isActive: true,
      ),
    ];
  }

  List<Breadcrumb> buildPatientProfileBreadcrumbs(
    Paciente? patient, {
    String inicioLabel = 'Inicio',
    String patientsLabel = 'Pacientes',
  }) {
    final displayName = patient == null || patient.nombrePaciente.isEmpty
        ? 'Paciente'
        : patient.nombrePaciente;
    return [
      Breadcrumb(label: inicioLabel, route: '/inicio'),
      Breadcrumb(label: patientsLabel, route: '/pacientes'),
      Breadcrumb(
        label: displayName,
        route: '/perfilPaciente',
        arguments: patient,
        isActive: true,
      ),
    ];
  }

  List<Breadcrumb> buildMedicalRecordBreadcrumbs(
    Paciente? patient, {
    String inicioLabel = 'Inicio',
    String patientsLabel = 'Pacientes',
    String recordLabel = 'Ficha Médica',
  }) {
    final crumbs = buildPatientProfileBreadcrumbs(
      patient,
      inicioLabel: inicioLabel,
      patientsLabel: patientsLabel,
    );
    crumbs.add(
      Breadcrumb(
        label: recordLabel,
        route: '/fichaMedica',
        arguments: patient,
        isActive: true,
      ),
    );
    return crumbs;
  }
}
