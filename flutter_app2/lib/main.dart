import 'package:flutter/material.dart';
//import 'styles.dart' as styles;
import 'homepage.dart';
import 'page1.dart';
import 'page2.dart';
// function to trigger build when the app is run

void main() {
  runApp(MaterialApp(
    initialRoute: '/',
    routes: {
      '/': (context) => const HomeRoute(),
      '/second': (context) => const SecondRoute(),
      '/third': (context) => const ThirdRoute(),
    },
    debugShowCheckedModeBanner: false,
  )); //MaterialApp
}

