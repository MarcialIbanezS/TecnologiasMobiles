//CONECCION A LA BDD

import 'package:mysql_client/mysql_client.dart';
import 'package:http/http.dart' as http;
// Make sure that DataBase is created before connecting

Future<MySQLConnection> createConnection() async {
  final conn = await MySQLConnection.createConnection(
    host: "localhost", // Add your host IP address or server name
    port: 3309, // Add the port the server is running on
    userName: "root", // Your username
    password: "SexoGay", // Your password
    databaseName: "tecnologiasmoviles", // Your DataBase name
  );
  return conn;
}
