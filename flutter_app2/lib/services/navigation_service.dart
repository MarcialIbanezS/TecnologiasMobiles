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

  List<Breadcrumb> buildInicioBreadcrumbs() {
    return const [
      Breadcrumb(label: 'Inicio', route: '/inicio', isActive: true),
    ];
  }

  List<Breadcrumb> buildPatientListBreadcrumbs() {
    return [
      const Breadcrumb(label: 'Inicio', route: '/inicio'),
      const Breadcrumb(
        label: 'Pacientes',
        route: '/pacientes',
        isActive: true,
      ),
    ];
  }

  List<Breadcrumb> buildPatientProfileBreadcrumbs(Paciente? patient) {
    final displayName = patient == null || patient.nombrePaciente.isEmpty
        ? 'Paciente'
        : patient.nombrePaciente;
    return [
      const Breadcrumb(label: 'Inicio', route: '/inicio'),
      const Breadcrumb(label: 'Pacientes', route: '/pacientes'),
      Breadcrumb(
        label: displayName,
        route: '/perfilPaciente',
        arguments: patient,
        isActive: true,
      ),
    ];
  }

  List<Breadcrumb> buildMedicalRecordBreadcrumbs(Paciente? patient) {
    final crumbs = buildPatientProfileBreadcrumbs(patient);
    crumbs.add(
      Breadcrumb(
        label: 'Ficha Médica',
        route: '/fichaMedica',
        arguments: patient,
        isActive: true,
      ),
    );
    return crumbs;
  }
}
