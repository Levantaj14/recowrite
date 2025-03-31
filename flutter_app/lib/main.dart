import 'package:flutter/material.dart';
import 'package:grayscale/grayscale.dart';
import 'package:recowrite/authentication.dart';

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
        useMaterial3: true,
        progressIndicatorTheme: ProgressIndicatorThemeData(year2023: false),
        pageTransitionsTheme: PageTransitionsTheme(
          builders: Map<TargetPlatform, PageTransitionsBuilder>.fromIterable(
            TargetPlatform.values,
            value: (_) => const FadeForwardsPageTransitionsBuilder(),
          ),
        ),
        colorScheme: GrayColorScheme.highContrastGray(Brightness.light),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        progressIndicatorTheme: ProgressIndicatorThemeData(year2023: false),
        pageTransitionsTheme: PageTransitionsTheme(
          builders: Map<TargetPlatform, PageTransitionsBuilder>.fromIterable(
            TargetPlatform.values,
            value: (_) => const FadeForwardsPageTransitionsBuilder(),
          ),
        ),
        colorScheme: GrayColorScheme.highContrastGray(Brightness.dark),
        fontFamily: 'Inter',
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
        global.auth ? DashboardPage() : Authentication(),
      ],
    );

    return Scaffold(
      body: pageView,
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentPage,
        onDestinationSelected: (int index) {
          setState(() {
            controller.jumpToPage(index);
          });
        },
        destinations: [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          global.auth
              ? NavigationDestination(
                icon: Icon(Icons.dashboard),
                label: 'Dashboard',
              )
              : NavigationDestination(
                icon: Icon(Icons.person),
                label: 'Login',
              ),
        ],
      ),
    );
  }
}
