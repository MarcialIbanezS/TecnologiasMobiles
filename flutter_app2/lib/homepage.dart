import 'package:flutter/material.dart';
//import 'styles.dart' as styles;
import 'header.dart' as header;

class HomeRoute extends StatelessWidget {
  const HomeRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: header.buildHeader(context),
      
       // AppBar
      body: ListView(
        padding: EdgeInsets.all(16),
        children: [
          // Asset image in a container
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(50),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withValues(alpha: 0.3),
                  spreadRadius: 2,
                  blurRadius: 5,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(50),
              child: Image(
                image: AssetImage('assets/images/medico_paziente.jpg'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          SizedBox(height: 30), // Add some spacing

// Buttons section
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(Colors.green),
                    foregroundColor: WidgetStateProperty.all(Colors.white)),
                child: const Text('Buscador de Rut'),
                onPressed: () {
                  Navigator.pushNamed(context, '/second');
                },
              ), // ElevatedButton
              SizedBox(height: 10), // Add spacing between buttons
              ElevatedButton(
                style: ButtonStyle(
                    backgroundColor: WidgetStateProperty.all(Colors.green),
                    foregroundColor: WidgetStateProperty.all(Colors.white)),
                child: const Text('Subir Ficha Medica'),
                onPressed: () {
                  Navigator.pushNamed(context, '/third');
                },
              ), // ElevatedButton
            ], // <Widget>[]
          ), // Column
        ],
      ), // ListView
    ); // Scaffold
  }
}
