import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppSettings extends ChangeNotifier {
  static const _darkModeKey = 'app_dark_mode';
  static const _languageKey = 'app_language';

  bool _darkMode = false;
  String _language = 'es';

  bool get darkMode => _darkMode;
  String get language => _language;

  ThemeMode get themeMode => _darkMode ? ThemeMode.dark : ThemeMode.light;

  Locale get locale => Locale(_language);

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _darkMode = prefs.getBool(_darkModeKey) ?? false;
    _language = prefs.getString(_languageKey) ?? 'es';
    notifyListeners();
  }

  Future<void> update({
    bool? darkMode,
    String? language,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    var changed = false;

    if (darkMode != null && darkMode != _darkMode) {
      _darkMode = darkMode;
      await prefs.setBool(_darkModeKey, _darkMode);
      changed = true;
    }

    if (language != null && language != _language) {
      _language = language;
      await prefs.setString(_languageKey, _language);
      changed = true;
    }

    if (changed) {
      notifyListeners();
    }
  }
}

class AppSettingsScope extends InheritedNotifier<AppSettings> {
  const AppSettingsScope({
    super.key,
    required AppSettings settings,
    required super.child,
  }) : super(notifier: settings);

  static AppSettings of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppSettingsScope>();
    assert(scope != null, 'AppSettingsScope not found in widget tree');
    return scope!.notifier!;
  }
}
