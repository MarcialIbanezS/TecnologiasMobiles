import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'app_settings.dart';
import 'app_localizations.dart';

class UserProfilePage extends StatefulWidget {
  const UserProfilePage({super.key});

  @override
  State<UserProfilePage> createState() => _UserProfilePageState();
}

class _UserProfilePageState extends State<UserProfilePage> {
  final user = FirebaseAuth.instance.currentUser;
  bool _darkMode = false;
  double _fontSize = 16;
  String _language = 'es';
  final List<String> _languages = ['es', 'en', 'pt'];
  AppSettings? _appSettings;
  bool _settingsLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadUserSettings();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _appSettings = AppSettingsScope.of(context);
    if (!_settingsLoaded && _appSettings != null) {
      _darkMode = _appSettings!.darkMode;
      _language = _appSettings!.language;
      _settingsLoaded = true;
    }
  }

  Future<void> _loadUserSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _fontSize = prefs.getDouble('fontSize') ?? 16;
      if (_appSettings != null) {
        _darkMode = _appSettings!.darkMode;
        _language = _appSettings!.language;
      }
    });

    // 🔄 Cargar desde Firestore si hay usuario logueado
    if (user != null) {
      final doc = await FirebaseFirestore.instance
          .collection('profesionales')
          .doc(user!.uid)
          .get();

      if (doc.exists) {
        final data = doc.data()!;
        final fetchedDark = data['modoOscuro'] ?? _darkMode;
        final fetchedFont =
            (data['tamanoFuente'] ?? _fontSize).toDouble();
        final fetchedLanguage = data['idioma'] ?? _language;

        _appSettings?.update(
          darkMode: fetchedDark,
          language: fetchedLanguage,
        );

        setState(() {
          _darkMode = fetchedDark;
          _fontSize = fetchedFont;
          _language = fetchedLanguage;
        });
      }
    }
  }

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('fontSize', _fontSize);

    if (user != null) {
      await FirebaseFirestore.instance
          .collection('profesionales')
          .doc(user!.uid)
          .set({
        'modoOscuro': _darkMode,
        'tamanoFuente': _fontSize,
        'idioma': _language,
      }, SetOptions(merge: true));
    }

    final l10n = AppLocalizations.of(context)!;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('✅ ${l10n.settingsSaved}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    String _languageLabel(String code) {
      switch (code) {
        case 'en':
          return 'English';
        case 'pt':
          return 'Português';
        default:
          return 'Español';
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.userProfileTitle),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView(
          children: [
            const SizedBox(height: 10),
            Center(
              child: CircleAvatar(
                radius: 40,
                backgroundColor: Colors.blueGrey[200],
                child: const Icon(Icons.person, size: 40),
              ),
            ),
            const SizedBox(height: 15),
            Center(
              child: Text(
                user?.email ?? l10n.guestUser,
                style: TextStyle(fontSize: _fontSize),
              ),
            ),
            const Divider(height: 30),

            // 🌙 Modo oscuro
            SwitchListTile(
              title: Text(l10n.darkMode),
              value: _darkMode,
              onChanged: (value) {
                _appSettings?.update(darkMode: value);
                setState(() => _darkMode = value);
              },
              secondary: const Icon(Icons.dark_mode),
            ),

            // 🌐 Idioma
            ListTile(
              title: Text(l10n.language),
              trailing: DropdownButton<String>(
                value: _language,
                items: _languages.map((lang) {
                  return DropdownMenuItem(
                    value: lang,
                    child: Text(_languageLabel(lang)),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value == null) return;
                  _appSettings?.update(language: value);
                  setState(() => _language = value);
                },
              ),
              leading: const Icon(Icons.language),
            ),

            // 🔠 Tamaño de fuente
            ListTile(
              title: Text(l10n.fontSize),
              subtitle: Slider(
                min: 12,
                max: 24,
                divisions: 6,
                label: _fontSize.toStringAsFixed(0),
                value: _fontSize,
                onChanged: (value) {
                  setState(() => _fontSize = value);
                },
              ),
              leading: const Icon(Icons.text_fields),
            ),

            const SizedBox(height: 30),

            // 💾 Botón Guardar
            ElevatedButton.icon(
              icon: const Icon(Icons.save),
              label: Text(l10n.saveChanges),
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Theme.of(context).colorScheme.onPrimary,
              ),
              onPressed: _saveSettings,
            ),
          ],
        ),
      ),
    );
  }
}
