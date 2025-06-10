import 'package:flutter/material.dart';

class PasswordResetDialog extends StatelessWidget {
  const PasswordResetDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8.0),
      ),
      title: Text('Reset Password',),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('If we find an account linked to your email, we\'ll send you an email with the next steps.'),
          SizedBox(height: 16.0,),
          TextFormField(
            decoration: InputDecoration(
              labelText: 'Email',
              border: OutlineInputBorder(),
            ),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            // Handle password reset logic here
            Navigator.pop(context);
          },
          child: Text('Reset Password'),
        ),
      ],
    );
  }
}
