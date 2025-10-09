import 'package:flutter/material.dart';
import 'styles.dart' as styles;

AppBar buildHeader(BuildContext context) {
  return AppBar(
    title: const Text('Doble M.A.'),
    backgroundColor: styles.headerBGColor,
    foregroundColor: styles.headerFontColor,
    actions: <Widget>[
      DropdownButton<String>(
        items: <String>['A', 'B', 'C', 'D'].map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        onChanged: (_) {},
      )
      
    ],
  );
}