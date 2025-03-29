import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:http/http.dart' as http;
import 'package:recowrite/article_card.dart';
import 'package:recowrite/blogs_format.dart';

import 'globals.dart' as global;
import 'new_post.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool fetch = false;
  late Future<List<BlogsFormat>> futureBlogs;

  Future<List<BlogsFormat>> fetchData() async {
    final response = await http.get(Uri.parse('http://localhost:8080/blogs'));
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      return jsonData.map((blog) => BlogsFormat.fromJson(blog)).toList();
    } else {
      throw Exception('Failed to load blogs');
    }
  }

  @override
  void initState() {
    super.initState();
    futureBlogs = fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      body: Center(
        child: RefreshIndicator(
          onRefresh: () {
            setState(() {
              futureBlogs = fetchData();
            });
            return futureBlogs;
          },
          child: FutureBuilder<List<BlogsFormat>>(
            future: futureBlogs,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return ListView.builder(
                  padding: const EdgeInsets.only(right: 10.0, left: 10.0),
                  itemCount: snapshot.data!.length,
                  itemBuilder: (context, index) {
                    final blog = snapshot.data![index];
                    return ArticleCard(blog: blog);
                  },
                ).animate().fade();
              } else if (snapshot.hasError) {
                return Text('${snapshot.error}');
              }
              return const CircularProgressIndicator();
            },
          ),
        ),
      ),
      floatingActionButton: Visibility(
        visible: global.auth,
        child: FloatingActionButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const NewPost()),
            );
          },
          child: Icon(Icons.add),
        ),
      ),
    );
  }
}
