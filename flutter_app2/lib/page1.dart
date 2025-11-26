import 'package:flutter/material.dart';

import 'patients.dart';
import 'services/firestore_repository.dart';
import 'services/navigation_service.dart';
import 'widgets/breadcrumb_bar.dart';

class PatientsListPage extends StatefulWidget {
  const PatientsListPage({super.key});

  @override
  State<PatientsListPage> createState() => _PatientsListPageState();
}

class _PatientsListPageState extends State<PatientsListPage> {
  final FirestoreRepository _repository = FirestoreRepository();
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<Paciente> _patients = [];
  List<Paciente> _visiblePatients = [];
  bool _isLoading = true;
  bool _isSearching = false;
  int _currentPage = 0;
  final int _itemsPerPage = 20;
  bool _showScrollTop = false;
  String _error = '';

  @override
  void initState() {
    super.initState();
    _loadPatients();
    _scrollController.addListener(_handleScroll);
  }

  Future<void> _loadPatients() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });
    try {
      final patients = await _repository.fetchPatients();
      _patients
        ..clear()
        ..addAll(patients);
      _resetPagination();
    } catch (e) {
      setState(() {
        _error = 'No pudimos cargar los pacientes. ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _resetPagination() {
    setState(() {
      _currentPage = 0;
      _visiblePatients = [];
    });
    _loadMore();
  }

  void _loadMore() {
    if (_isSearching) return;
    final start = _currentPage * _itemsPerPage;
    if (start >= _patients.length) return;
    final end = (_currentPage + 1) * _itemsPerPage;
    setState(() {
      _visiblePatients = [
        ..._visiblePatients,
        ..._patients.sublist(
          start,
          end > _patients.length ? _patients.length : end,
        ),
      ];
      _currentPage++;
    });
  }

  void _handleScroll() {
    if (_scrollController.offset > 200 && !_showScrollTop) {
      setState(() => _showScrollTop = true);
    } else if (_scrollController.offset <= 200 && _showScrollTop) {
      setState(() => _showScrollTop = false);
    }

    if (_scrollController.position.pixels >=
            _scrollController.position.maxScrollExtent - 80 &&
        !_isSearching) {
      _loadMore();
    }
  }

  void _onSearchChanged(String value) {
    final term = value.trim().toLowerCase();
    if (term.isEmpty) {
      setState(() {
        _isSearching = false;
        _resetPagination();
      });
      return;
    }

    setState(() {
      _isSearching = true;
      _visiblePatients = _patients.where((patient) {
        final name = patient.nombreCompleto.toLowerCase();
        final rut = patient.rut.toLowerCase().replaceAll(RegExp(r'[.-]'), '');
        final normalizedTerm = term.replaceAll(RegExp(r'[.-]'), '');
        return name.contains(term) || rut.contains(normalizedTerm);
      }).toList();
    });
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() {
      _isSearching = false;
    });
    _resetPagination();
  }

  void _openPatient(Paciente patient) {
    NavigationService.instance.setSelectedPatient(patient);
    Navigator.pushNamed(
      context,
      '/perfilPaciente',
      arguments: patient,
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: _showScrollTop
          ? FloatingActionButton(
              onPressed: () {
                _scrollController.animateTo(
                  0,
                  duration: const Duration(milliseconds: 400),
                  curve: Curves.easeOut,
                );
              },
              child: const Icon(Icons.arrow_upward),
            )
          : null,
      appBar: AppBar(
        title: const Text('Búsqueda básica'),
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
          children: [
            BreadcrumbBar(
              breadcrumbs:
                  NavigationService.instance.buildPatientListBreadcrumbs(),
              onTap: (crumb) {
                if (crumb.route != '/pacientes') {
                  Navigator.pushNamed(context, crumb.route);
                }
              },
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _searchController,
              onChanged: _onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Buscar por nombre o RUT',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _isSearching
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: _clearSearch,
                      )
                    : null,
                filled: true,
                fillColor: Theme.of(context).colorScheme.surfaceVariant,
                hintStyle: TextStyle(
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                prefixIconColor:
                    Theme.of(context).colorScheme.onSurfaceVariant,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _error.isNotEmpty
                      ? Center(child: Text(_error))
                      : RefreshIndicator(
                          onRefresh: _loadPatients,
                          child: _visiblePatients.isEmpty
                              ? const Center(
                                  child: Text('No se encontraron pacientes'),
                                )
                              : ListView.builder(
                                  controller: _scrollController,
                                  itemCount: _visiblePatients.length,
                                  itemBuilder: (context, index) {
                                    final patient = _visiblePatients[index];
                                    return Card(
                                      margin: const EdgeInsets.symmetric(
                                        vertical: 6,
                                        horizontal: 4,
                                      ),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      child: ListTile(
                                        leading: CircleAvatar(
                                          backgroundColor: Colors.teal.shade100,
                                          child: const Icon(
                                            Icons.person,
                                            color: Colors.teal,
                                          ),
                                        ),
                                        title: Text(patient.nombreCompleto),
                                        subtitle: Text(
                                          'RUT: ${patient.rut}\nSexo: ${patient.sexo}\nNacimiento: ${patient.fechaNacimiento}',
                                        ),
                                        trailing:
                                            const Icon(Icons.chevron_right),
                                        onTap: () => _openPatient(patient),
                                      ),
                                    );
                                  },
                                ),
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
