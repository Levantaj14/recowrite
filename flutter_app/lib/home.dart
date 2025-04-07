import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:http/http.dart' as http;
import 'package:lorem_ipsum/lorem_ipsum.dart';
import 'package:recowrite/article_card.dart';
import 'package:recowrite/formats/author_format.dart';
import 'package:recowrite/formats/blogs_format.dart';
import 'package:skeletonizer/skeletonizer.dart';

import 'globals.dart' as global;
import 'new_post.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage>
    with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  late Future<List<BlogsFormat>> futureBlogs;
  late Future<Map<int, AuthorFormat>> futureAuthors;
  List<BlogsFormat> blogs = List<BlogsFormat>.generate(
    5,
    (i) => BlogsFormat(
      id: i,
      title: loremIpsum(),
      content: loremIpsum(),
      description: loremIpsum(),
      author: 1,
      banner: '',
      date: DateTime.now().toString(),
    ),
  );

  late Map<int, AuthorFormat> authors = {
    1: const AuthorFormat(
      id: 1,
      name: 'John Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      avatar: 'https://example.com/avatar.jpg',
      username: 'johndoe',
    ),
  };

  Future<List<BlogsFormat>> fetchBlogs() async {
    final response = await http.get(Uri.parse('http://localhost:8080/blogs'));
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      blogs = jsonData.map((blog) => BlogsFormat.fromJson(blog)).toList();
      return blogs;
    } else {
      throw Exception('Failed to load blogs');
    }
  }

  Future<Map<int, AuthorFormat>> fetchAuthors() async {
    final response = await http.get(Uri.parse('http://localhost:8080/user'));
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      setState(() {
        authors = {
          for (var author in jsonData)
            AuthorFormat.fromJson(author).id: AuthorFormat.fromJson(author),
        };
      });
      return authors;
    } else {
      throw Exception('Failed to load blogs');
    }
  }

  @override
  void initState() {
    super.initState();
    futureBlogs = fetchBlogs();
    futureAuthors = fetchAuthors();
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      body: Center(
        child: RefreshIndicator(
          onRefresh: () {
            setState(() {
              try {
                futureBlogs = fetchBlogs();
                futureAuthors = fetchAuthors();
              } catch (e) {
                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(global.failedToLoadBlogSnackBar);
              }
            });
            return futureBlogs;
          },
          child: FutureBuilder<List<BlogsFormat>>(
            future: futureBlogs,
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children:
                        [
                          const Icon(Icons.cloud_off, size: 50),
                          const SizedBox(height: 11),
                          const Text(
                            'There was an error connecting to the server',
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          OutlinedButton(
                            style: ButtonStyle(
                              shape: WidgetStateProperty.all<
                                RoundedRectangleBorder
                              >(
                                RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8.0),
                                ),
                              ),
                              splashFactory: NoSplash.splashFactory,
                            ),
                            onPressed: () {
                              setState(() {
                                futureBlogs = fetchBlogs();
                              });
                            },
                            child: const Text('Try again'),
                          ),
                        ].animate(interval: .10.seconds).fadeIn(),
                  ),
                );
              }
              return Skeletonizer(
                enableSwitchAnimation: true,
                enabled: !snapshot.hasData,
                child: ListView.builder(
                  padding: const EdgeInsets.only(right: 10.0, left: 10.0),
                  itemCount: blogs.length,
                  itemBuilder: (context, index) {
                    return ArticleCard(blog: blogs[index], author: authors[blogs[index].author] ?? AuthorFormat(
                      id: 0,
                      name: 'Unknown',
                      bio: 'Unknown',
                      avatar: '',
                      username: 'Unknown',
                    ));
                  },
                ),
              );
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
