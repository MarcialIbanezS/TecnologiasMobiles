import 'package:flutter/material.dart';
import 'styles.dart' as styles;

AppBar buildHeader(BuildContext context) {
  return AppBar(
    title: const Text('Doble M.A.'),
    backgroundColor: styles.headerBGColor,
    foregroundColor: styles.headerFontColor,
    actions: <Widget>[
      DropdownButton<String>(
        icon: const Icon(Icons.menu), // Changed from default "v" to "=" (menu icon)
        items: <String>['Inicio', 'Cuenta', 'Buscar Fichas', 'Subir Fichas'].map((String value) {
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