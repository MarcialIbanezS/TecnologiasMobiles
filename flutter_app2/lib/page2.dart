import 'package:flutter/material.dart';
import 'header.dart' as header;
//import 'package:flutter_file_uploader/flutter_file_uploader.dart';

class ThirdRoute extends StatelessWidget {
  const ThirdRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: header.buildHeader(context),
      body: Padding( 
        padding: const EdgeInsets.all(8.0),
        child: Column(
       children:[
          Text('Aquí puedes subir tu ficha médica.',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.grey[700],
          ),
          textAlign: TextAlign.center,
          ),
          
       
       ],
      ),
       ), // Center
    ); // Scaffold
  }
}