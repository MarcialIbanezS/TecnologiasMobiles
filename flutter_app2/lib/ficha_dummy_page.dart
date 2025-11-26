import 'package:flutter/material.dart';

import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';
import 'app_localizations.dart';

class FichaDummyPage extends StatelessWidget {
  const FichaDummyPage({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    final breadcrumbs = [
      Breadcrumb(label: l10n.homeTitle, route: '/inicio'),
      Breadcrumb(label: l10n.patients, route: '/pacientes'),
      Breadcrumb(label: l10n.dummyTitle, route: '/fichaDummy'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.dummyTitle),
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
            BreadcrumbBar(breadcrumbs: breadcrumbs),
            const SizedBox(height: 16),
            _DashboardCard(
              title: 'Juan Pérez Dummy',
              subtitle: 'RUT: 11.111.111-1',
              icon: Icons.person,
              children: [
                _InfoRow(label: 'Dirección', value: 'Calle Falsa 123'),
                _InfoRow(label: 'Fecha ingreso', value: '01/01/2024'),
                _InfoRow(label: 'Servicio', value: 'Kinesiología'),
                _InfoRow(label: 'Profesional', value: 'Dra. Dummy Tester'),
              ],
            ),
            _DashboardCard(
              title: 'Alergias',
              icon: Icons.warning_amber,
              children: const [
                _InfoRow(label: 'Alergia', value: 'Alergia Dummy'),
              ],
            ),
            _DashboardCard(
              title: 'Condiciones crónicas',
              icon: Icons.medical_services,
              children: const [
                _InfoRow(label: 'Condición', value: 'Condición Crónica Dummy'),
              ],
            ),
            _DashboardCard(
              title: 'Operaciones',
              icon: Icons.healing,
              children: const [
                _InfoRow(label: 'Operación', value: 'Operación Dummy'),
              ],
            ),
          ],
        ),
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

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
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
              ),
            ),
          ),
          Expanded(
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
