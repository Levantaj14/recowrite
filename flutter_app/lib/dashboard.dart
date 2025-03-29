import 'package:flutter/material.dart';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 5,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Dashboard'),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.settings)),
              Tab(icon: Icon(Icons.person)),
              Tab(icon: Icon(Icons.article)),
              Tab(icon: Icon(Icons.favorite)),
              Tab(icon: Icon(Icons.comment)),
            ],
          ),
        ),
      ),
    );
  }
}
