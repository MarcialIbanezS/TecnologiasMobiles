import 'package:flutter/material.dart';
//import 'styles.dart' as styles;
import 'header.dart' as header;


class SecondRoute extends StatelessWidget {
  const SecondRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: header.buildHeader(context),// AppBar
      body: ListView(
        padding: EdgeInsets.all(16),
        children:[
        ElevatedButton(
          style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.green),
              foregroundColor: WidgetStateProperty.all(Colors.white)),
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Back!'),
          
        ),
        //GFG(), // ElevatedButton
        ],
      ), // Center
    ); // Scaffold
  }
}

