import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:recowrite/blogs_format.dart';
import 'package:recowrite/story.dart';

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

  String decideDescription(BlogsFormat blog) {
    DateTime now = DateTime.now();
    DateTime posting = DateTime.parse(blog.date);
    if (posting.isAfter(now)) {
      return "This blog is not yet published";
    }
    if (blog.description.isEmpty) {
      String cont = "";
      if (blog.content.length > 100) {
        cont = "${blog.content.substring(0, 100)}...";
      } else {
        cont = blog.content;
      }
      return cont;
    }
    return blog.description;
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
        child: FutureBuilder<List<BlogsFormat>>(
          future: futureBlogs,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return ListView.builder(
                padding: const EdgeInsets.only(right: 10.0, left: 10.0),
                itemCount: snapshot.data!.length,
                itemBuilder: (context, index) {
                  final blog = snapshot.data![index];
                  return Card(
                    child: InkWell(
                      child: ListTile(
                        leading: AspectRatio(
                          aspectRatio: 4 / 3,
                          child: Image.network(blog.banner, fit: BoxFit.cover),
                        ),
                        title: Text(blog.title),
                        subtitle: Text(decideDescription(blog)),
                      ),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => StoryPage(id: blog.id),
                          ),
                        );
                      },
                    ),
                  );
                },
              );
            } else if (snapshot.hasError) {
              return Text('${snapshot.error}');
            }
            return const CircularProgressIndicator();
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(onPressed: (){}, child: Icon(Icons.add)),
    );
  }
}
