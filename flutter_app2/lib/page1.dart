import 'package:flutter/material.dart';
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
                image: AssetImage('assets/images/rut_image.jpg'),
                fit: BoxFit.cover,
              ),
            ),
          ),
          SizedBox(height: 90), // Add some spacing

          //Search bar
          Row(
              children: [
                  Flexible(
                    flex: 1,
                    child: TextField(
                      cursorColor: Colors.grey,
                      decoration: InputDecoration(
                        fillColor: Colors.white,
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: BorderSide.none
                        ),
                        hintText: 'Buscar RUT...',
                        hintStyle: TextStyle(
                          color: Colors.grey,
                          fontSize: 18
                        ),
                        prefixIcon: Container(
                          padding: EdgeInsets.all(15),
                          //child: Image.asset('assets/icons/search.png'),
                          width: 18,
                        )
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only (left: 10),
                    padding: EdgeInsets.all(15),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      borderRadius: BorderRadius.circular(15)
                    ),
                    //child: Image.asset('assets/icons/filter.png'),
                    width: 25
                  ),
                ],
              )
          
        //GFG(), // ElevatedButton
        ],
      ), // Center
    ); // Scaffold
  }
}

