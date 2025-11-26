import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';

import 'app_settings.dart';
import 'app_localizations.dart';
import 'fingerprint_page.dart';
import 'firebase_options.dart';
import 'homepage.dart';
import 'page1.dart';
import 'page2.dart';
import 'patient_profile.dart';
import 'start_page.dart';
import 'user_profile.dart';
import 'ficha_dummy_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  final settings = AppSettings();
  await settings.load();

  runApp(MyApp(settings: settings));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, required this.settings});

  final AppSettings settings;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: settings,
      builder: (context, _) {
        return AppSettingsScope(
          settings: settings,
          child: MaterialApp(
            title: 'App Tecnologías Móviles',
            debugShowCheckedModeBanner: false,
            themeMode: settings.themeMode,
            theme: ThemeData(
              colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
              useMaterial3: true,
            ),
            darkTheme: ThemeData(
              colorScheme: ColorScheme.fromSeed(
                seedColor: Colors.teal,
                brightness: Brightness.dark,
              ),
              useMaterial3: true,
            ),
            locale: settings.locale,
            supportedLocales: AppLocalizations.supportedLocales,
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            initialRoute: '/',
            routes: {
              '/': (context) => const StartPage(),
              '/inicio': (context) => const InicioPage(),
              '/pacientes': (context) => const PatientsListPage(),
              '/perfilPaciente': (context) => const PatientProfilePage(),
              '/fichaMedica': (context) => const MedicalRecordPage(),
              '/fingerprint': (context) => const FingerprintPage(),
              '/perfilUsuario': (context) => const UserProfilePage(),
              '/user_profile': (context) => const UserProfilePage(),
              '/fichaDummy': (context) => const FichaDummyPage(),
            },
          ),
        );
      },
    );
  }
}

