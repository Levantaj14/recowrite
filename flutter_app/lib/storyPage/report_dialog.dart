import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../globals.dart' as globals;
import '../globals.dart' as global;

class ReportDialog extends StatefulWidget {
  final int blogId;

  const ReportDialog({super.key, required this.blogId});

  @override
  State<ReportDialog> createState() => _ReportDialogState();
}

class _ReportDialogState extends State<ReportDialog> {
  static const List<String> reasons = [
    "Spam",
    "Hate speech or abusive content",
    "Harassment or bullying",
    "Sexual or explicit content",
    "Violent or graphic content",
    "Misinformation",
    "Copyright infringement",
    "Plagiarism",
  ];
  int? _reasonId;

  List<Widget> createReasonsRadio() {
    List<Widget> reasonRadios = [];
    for (var i = 0; i < reasons.length; i++) {
      reasonRadios.add(
        RadioListTile(
          title: Text(reasons[i]),
          value: i + 1,
          groupValue: _reasonId,
          onChanged: (int? value) {
            setState(() {
              _reasonId = value;
            });
          },
        ),
      );
    }
    return reasonRadios;
  }

  Future<bool> sendReport() async {
    final response = await http.post(
      Uri.parse('${globals.url}/report'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Cookie': global.authCookieContent,
      },
      body: jsonEncode(<String, int>{
        'blogId': widget.blogId,
        'reasonId': _reasonId ?? 1,
      }),
    );
    return response.statusCode == 200;
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      title: const Text('Report this article'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: createReasonsRadio(),
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Cancel'),
        ),
        ElevatedButton(
          onPressed:
              _reasonId != null
                  ? () {
                    sendReport().then((success) {
                      if (success) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              "Report sent successfully. Thank you for your contribution.",
                            ),
                          ),
                        );
                        Navigator.pop(context);
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text(
                              "An error occurred while sending the report",
                            ),
                          ),
                        );
                      }
                    });
                  }
                  : null,
          child: Text('Report'),
        ),
      ],
    );
  }
}
