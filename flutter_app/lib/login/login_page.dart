import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:recowrite/formats/user_format.dart';
import 'package:recowrite/login/password_reset_dialog.dart';
import 'package:recowrite/login/signup_page.dart';

import '../globals.dart' as global;
import '../providers/user_provider.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();

  Future<bool> loginFuture() async {
    final response = await http.post(
      Uri.parse('${global.url}/authentication/login'),
      headers: <String, String>{'Content-Type': 'application/json'},
      body: jsonEncode(<String, String>{
        'username': usernameController.text,
        'password': passwordController.text,
      }),
    );

    if (response.statusCode == 200) {
      global.authCookieContent = response.headers['set-cookie'] ?? '';
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = UserFormat.fromJson(
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>,
      );
      userProvider.setUser(user);
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Your request failed")));
    }

    return response.statusCode == 200;
  }

  @override
  Widget build(BuildContext context) {
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
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(25.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Login',
                    style: Theme.of(context).textTheme.headlineLarge,
                  ),
                  Text(
                    'Just a few more steps and you\'re ready',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 16.0),
                  TextFormField(
                    autocorrect: false,
                    controller: usernameController,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your username';
                      }
                      return null;
                    },
                    decoration: InputDecoration(
                      labelText: 'Username',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  TextFormField(
                    obscureText: true,
                    autocorrect: false,
                    controller: passwordController,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      return null;
                    },
                    decoration: InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  TextButton(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const PasswordResetDialog(),
                      );
                    },
                    child: Text(
                      'Did you forget you password?',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                  ),
                  const SizedBox(height: 2.0),
                  ElevatedButton(
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        final navigator = Navigator.of(context);
                        loginFuture().then((success) {
                          if (success) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  "Welcome back, ${usernameController.text}!",
                                ),
                              ),
                            );
                            navigator.pop();
                          }
                        });
                      }
                    },
                    child: const Text('Login'),
                  ),
                  Center(
                    child: Column(
                      children: [
                        const Text('Don\'t have an account?'),
                        TextButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => SignUpPage(),
                              ),
                            );
                          },
                          child: const Text('Sign up'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
