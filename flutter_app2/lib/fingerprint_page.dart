import 'dart:async';

import 'package:flutter/material.dart';

import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';
import 'app_localizations.dart';

enum FingerprintState { scanner, qr, waiting }

class FingerprintPage extends StatefulWidget {
  const FingerprintPage({super.key});

  @override
  State<FingerprintPage> createState() => _FingerprintPageState();
}

class _FingerprintPageState extends State<FingerprintPage> {
  FingerprintState _state = FingerprintState.scanner;
  Timer? _timer;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startFakeScan() {
    setState(() => _state = FingerprintState.qr);
    _timer?.cancel();
    _timer = Timer(const Duration(seconds: 2), () {
      if (!mounted) return;
      setState(() => _state = FingerprintState.waiting);
      _timer = Timer(const Duration(seconds: 3), () {
        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/fichaDummy');
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final breadcrumbs = [
      Breadcrumb(label: l10n.homeTitle, route: '/inicio'),
      Breadcrumb(label: l10n.fingerprintTitle, route: '/fingerprint', isActive: true),
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.fingerprintTitle),
        actions: [
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () => Navigator.pushNamed(context, '/perfilUsuario'),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BreadcrumbBar(
              breadcrumbs: breadcrumbs,
              onTap: (crumb) {
                if (crumb.route != '/fingerprint') {
                  Navigator.pushNamed(context, crumb.route);
                }
              },
            ),
            const SizedBox(height: 30),
            Expanded(
              child: Center(
                child: _buildStateCard(),
              ),
            ),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _state == FingerprintState.waiting
                    ? null
                    : _startFakeScan,
                icon: const Icon(Icons.fingerprint),
                label: Text(
                  _state == FingerprintState.qr
                      ? l10n.scanning
                      : _state == FingerprintState.waiting
                          ? l10n.validating
                          : l10n.scanFingerprint,
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Theme.of(context).colorScheme.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStateCard() {
    final l10n = AppLocalizations.of(context)!;
    switch (_state) {
      case FingerprintState.scanner:
        return _InfoCard(
          title: l10n.fingerprintCardTitle,
          icon: Icons.fingerprint,
          description: l10n.fingerprintCardSubtitle,
        );
      case FingerprintState.qr:
        return _InfoCard(
          title: 'Generando QR temporal',
          icon: Icons.qr_code,
          description: 'Comparte el código con el lector auxiliar del paciente.',
          child: Container(
            width: 160,
            height: 160,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              color: Colors.grey.shade200,
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.qr_code, size: 120, color: Colors.teal),
          ),
        );
      case FingerprintState.waiting:
        return _InfoCard(
          title: 'Validando datos biométricos',
          icon: Icons.lock_clock,
          description: 'Esto tomará unos segundos...',
          child: const Padding(
            padding: EdgeInsets.only(top: 20),
            child: CircularProgressIndicator(),
          ),
        );
    }
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.title,
    required this.icon,
    required this.description,
    this.child,
  });

  final String title;
  final IconData icon;
  final String description;
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: colorScheme.primary),
            const SizedBox(height: 16),
            Text(
              title,
              style: textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              description,
              textAlign: TextAlign.center,
              style: textTheme.bodyMedium?.copyWith(
                color: colorScheme.onSurfaceVariant,
              ),
            ),
            if (child != null) child!,
          ],
        ),
      ),
    );
  }
}
