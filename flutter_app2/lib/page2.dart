import 'package:flutter/material.dart';
import 'styles.dart' as styles;


class ThirdRoute extends StatelessWidget {
  const ThirdRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Tap Me Page"),
        backgroundColor: styles.headerBGColor,
        foregroundColor: styles.headerFontColor,
      ), // AppBar
    ); // Scaffold
  }
}