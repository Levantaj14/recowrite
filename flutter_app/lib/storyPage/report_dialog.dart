import 'package:flutter/material.dart';

class ReportDialog extends StatefulWidget {
  const ReportDialog({super.key});

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
  bool enableButtons = true;

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
          onPressed:
              enableButtons
                  ? () {
                    Navigator.pop(context);
                  }
                  : null,
          child: Text('Cancel'),
        ),
        ElevatedButton(
          onPressed:
              enableButtons
                  ? () {
                    Navigator.pop(context);
                  }
                  : null,
          child: enableButtons ? Text('Report') : CircularProgressIndicator(color: Colors.white,),
        ),
      ],
    );
  }
}
