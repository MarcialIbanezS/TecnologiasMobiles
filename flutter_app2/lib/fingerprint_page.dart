import 'dart:async';

import 'package:flutter/material.dart';

import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';

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
        Navigator.pushReplacementNamed(context, '/pacientes');
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final breadcrumbs = [
      const Breadcrumb(label: 'Inicio', route: '/inicio'),
      const Breadcrumb(
        label: 'Huella',
        route: '/fingerprint',
        isActive: true,
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Verificación biométrica'),
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
                      ? 'Escaneando...'
                      : _state == FingerprintState.waiting
                          ? 'Validando...'
                          : 'Escanear huella',
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: Colors.white,
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
    switch (_state) {
      case FingerprintState.scanner:
        return _InfoCard(
          title: 'Escanee la huella del paciente',
          icon: Icons.fingerprint,
          description:
              'Usa el lector para autenticar al paciente y recuperar su ficha.',
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
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 48, color: Colors.teal),
            const SizedBox(height: 16),
            Text(
              title,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              description,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.black54),
            ),
            if (child != null) child!,
          ],
        ),
      ),
    );
  }
}
