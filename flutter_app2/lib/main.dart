import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart'; 
import 'homepage.dart';
import 'page1.dart';
import 'page2.dart';
import 'start_page.dart';
import 'patient_profile.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();


  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App Tecnologías Móviles',
      debugShowCheckedModeBanner: false,
      initialRoute: '/',
      routes: {
        '/': (context) => const StartPage(),
        '/home': (context) => const HomeRoute(),
        '/second': (context) => const SecondRoute(),
        '/third': (context) => const ThirdRoute(),
        '/profile': (context) {
          final pacienteId =
              ModalRoute.of(context)!.settings.arguments as String;
          return PatientProfilePage(pacienteId: pacienteId);
          },

      },
    );
  }
}

