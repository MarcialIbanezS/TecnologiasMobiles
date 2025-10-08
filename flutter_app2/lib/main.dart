import 'package:flutter/material.dart';
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

class HomeRoute extends StatelessWidget {
  const HomeRoute({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Doble M.A.'),
        backgroundColor: const Color.fromARGB(255, 38, 156, 158),
        foregroundColor: const Color.fromARGB(255, 195, 213, 237),
      ), // AppBar
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(Colors.green),
                  foregroundColor: WidgetStateProperty.all(Colors.white)),
              child: const Text('Click Me!'),
              onPressed: () {
                Navigator.pushNamed(context, '/second');
              },
            ), // ElevatedButton
            ElevatedButton(
              style: ButtonStyle(
                  backgroundColor: WidgetStateProperty.all(Colors.green),
                  foregroundColor: WidgetStateProperty.all(Colors.white)),
              child: const Text('Tap Me!'),
              onPressed: () {
                Navigator.pushNamed(context, '/third');
              },
            ), // ElevatedButton
          ], // <Widget>[]
        ), // Column
      ), // Center
    ); // Scaffold
  }
}

class SecondRoute extends StatelessWidget {
  const SecondRoute({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Click Me Page"),
        backgroundColor: const Color.fromARGB(255, 38, 156, 158),
        foregroundColor: const Color.fromARGB(255, 195, 213, 237),
      ), // AppBar
      body: Center(
        child: ElevatedButton(
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.green),
              foregroundColor: WidgetStateProperty.all(Colors.white)),
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Back!'),
        ), // ElevatedButton
      ), // Center
    ); // Scaffold
  }
}

class ThirdRoute extends StatelessWidget {
  const ThirdRoute({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Tap Me Page"),
        backgroundColor: const Color.fromARGB(255, 38, 156, 158),
        foregroundColor: const Color.fromARGB(255, 195, 213, 237),
      ), // AppBar
    ); // Scaffold
  }
}