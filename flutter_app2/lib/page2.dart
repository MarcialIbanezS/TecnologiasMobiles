//import 'dart:math';

import 'package:flutter/material.dart';
//import 'styles.dart' as styles;
import 'header.dart' as header;


class ThirdRoute extends StatelessWidget {
  const ThirdRoute({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: header.buildHeader(context),
      body: Center(
        
       child:
      DropdownButton<String>(
        items: <String>['A', 'B', 'C', 'D'].map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        onChanged: (_) {},
      ) // AppBar
      ), // Center
    ); // Scaffold
  }
}