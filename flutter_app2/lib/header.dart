import 'package:flutter/material.dart';
import 'styles.dart' as styles;

AppBar buildHeader(BuildContext context) {
  return AppBar(
    title: const Text('Doble M.A.'),
    backgroundColor: styles.headerBGColor,
    foregroundColor: styles.headerFontColor,
    actions: <Widget>[
      DropdownButton<String>(
        iconDisabledColor: styles.headerFontColor,
        iconEnabledColor: Colors.white, // Changed dropdown icon color to white
        dropdownColor: styles.headerBGColor, // Match dropdown background to header
        icon: const Icon(Icons.menu), // Changed from default "v" to "=" (menu icon)
        style: TextStyle(color: styles.headerFontColor), // Set text color for dropdown items
        items: <String>['Inicio', 'Cuenta', 'Buscar Fichas', 'Subir Fichas'].map((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
        onChanged: (String? selectedValue) { //ruteo
          if (selectedValue != null) {
            switch (selectedValue) {
              case 'Inicio':
                Navigator.pushNamed(context, '/');
                break;
              case 'Cuenta':
                // Navigate to account/profile page (you may need to create this route)
                Navigator.pushNamed(context, '/account');
                break;
              case 'Buscar Fichas':
                Navigator.pushNamed(context, '/second');
                break;
              case 'Subir Fichas':
                Navigator.pushNamed(context, '/third');
                break;
            }
          }
        },
      )
      
    ],
  );
}