import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';

class Base64Avatar extends StatelessWidget {
  final String? base64Image;
  final double radius;
  final String fallbackName;

  const Base64Avatar({
    super.key,
    this.base64Image,
    this.radius = 20.0,
    this.fallbackName = "",
  });

  String generateFallbackName() {
    if (fallbackName.isEmpty) {
      return "";
    }
    var names = fallbackName.trim().split(" ");
    String name = names.map((name) => name.isNotEmpty ? name[0].toUpperCase() : "").join();
    return name;
  }

  @override
  Widget build(BuildContext context) {
    if (base64Image != null && base64Image!.isNotEmpty) {
      String cleanBase64 = base64Image!;
      if (base64Image!.startsWith('data:')) {
        cleanBase64 = base64Image!.split(',').last;
      }

      Uint8List imageBytes = base64Decode(cleanBase64);

      return CircleAvatar(
        radius: radius,
        backgroundImage: MemoryImage(imageBytes),
      );
    }

    return CircleAvatar(
      radius: radius,
      backgroundColor: Colors.grey,
      child: Text(generateFallbackName(), style: TextStyle(fontSize: radius / 2)),
    );
  }
}
