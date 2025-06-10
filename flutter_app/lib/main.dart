import 'package:flutter/material.dart';
import 'package:grayscale/grayscale.dart';
import 'package:recowrite/login/login_page.dart';

import 'dashboard.dart';
import 'globals.dart' as global;
import 'home.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'recowrite',
      theme: ThemeData(
        progressIndicatorTheme: ProgressIndicatorThemeData(year2023: false),
        pageTransitionsTheme: PageTransitionsTheme(
          builders: Map<TargetPlatform, PageTransitionsBuilder>.fromIterable(
            TargetPlatform.values,
            value: (_) => const FadeForwardsPageTransitionsBuilder(),
          ),
        ),
        colorScheme: GrayColorScheme.highContrastGray(Brightness.light),
        fontFamily: 'Inter',
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4.0),
              ),
            ),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4.0),
              ),
            ),
            backgroundColor: WidgetStateProperty.all(Colors.black), // White background on light theme
            foregroundColor: WidgetStateProperty.all(Colors.white), // Black text on light theme
            elevation: WidgetStateProperty.all(1.0), // Optional: control elevation
          ),
        ),
      ),
      darkTheme: ThemeData(
        progressIndicatorTheme: ProgressIndicatorThemeData(year2023: false),
        pageTransitionsTheme: PageTransitionsTheme(
          builders: Map<TargetPlatform, PageTransitionsBuilder>.fromIterable(
            TargetPlatform.values,
            value: (_) => const FadeForwardsPageTransitionsBuilder(),
          ),
        ),
        colorScheme: GrayColorScheme.highContrastGray(Brightness.dark),
        fontFamily: 'Inter',
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            shape: WidgetStateProperty.all<RoundedRectangleBorder>(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(4.0),
              ),
            ),
            backgroundColor: WidgetStateProperty.all(Colors.white), // White background on light theme
            foregroundColor: WidgetStateProperty.all(Colors.black), // Black text on light theme
            elevation: WidgetStateProperty.all(1.0), // Optional: control elevation
          ),
        ),
      ),
      home: const MyHomePage(title: 'recowrite'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int currentPage = 0;
  final controller = PageController(
    initialPage: 0,
  );

  @override
  void didChangeDependencies() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (controller.hasClients) {
        controller.jumpToPage(currentPage);
      }
    });
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    final pageView = PageView(
      controller: controller,
      physics: const NeverScrollableScrollPhysics(),
      onPageChanged: (index) {
        setState(() {
          currentPage = index;
        });
      },
      children: [
        HomePage(),
        global.auth ? DashboardPage() : LoginPage(),
      ],
    );

    return Scaffold(
      body: pageView,
    );
  }
}
