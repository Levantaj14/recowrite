import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../globals.dart' as global;
import '../providers/user_provider.dart';

class LogoutDialog extends StatelessWidget {
  const LogoutDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      title: const Text('Log out'),
      content: const Text('Are you sure you want to log out?'),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            context.read<UserProvider>().logout();
            global.authCookieContent = '';
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("You have been logged out")),
            );
            Navigator.pop(context);
          },
          child: const Text('Log out'),
        ),
      ],
    );
  }
}
