import 'package:flutter/material.dart';

class ValidateEmail extends StatelessWidget {
  const ValidateEmail({super.key});

  @override
  Widget build(BuildContext context) {
    // Ensure that when the user navigates back, they return to the home page
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (bool didPop, Object? result) async {
        if (context.mounted) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            Navigator.popUntil(context, ModalRoute.withName('/'));
          });
        }
      },
      child: Scaffold(
        appBar: AppBar(),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(Icons.mark_email_unread_outlined, size: 60),
                Text(
                  'Verification email sent',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                SizedBox(height: 8),
                Text(
                  "Verify your email before logging in. Take a peek in your inbox for the next steps. If you don't see it, don't worry, check your spam folder too!",
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
