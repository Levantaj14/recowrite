import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:http/http.dart' as http;
import 'package:markdown/markdown.dart' as markdown;

import 'blogs_format.dart';

class StoryPage extends StatefulWidget {
  final int id;

  const StoryPage({super.key, required this.id});

  @override
  State<StoryPage> createState() => _StoryPageState();
}

class _StoryPageState extends State<StoryPage> {
  bool fetch = false;
  late Future<BlogsFormat> futureBlogs;

  Future<BlogsFormat> fetchData() async {
    final response = await http.get(
      Uri.parse('http://localhost:8080/blogs/${widget.id}'),
    );
    if (response.statusCode == 200) {
      return BlogsFormat.fromJson(
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>,
      );
    } else {
      throw Exception('Failed to load blog with id ${widget.id}');
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
      body: FutureBuilder(
        future: futureBlogs,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return CustomScrollView(
              slivers: [
                SliverAppBar.large(
                  stretch: true,
                  expandedHeight: 300.0,
                  title: Text(snapshot.data!.title),
                  flexibleSpace: FlexibleSpaceBar(
                    stretchModes: const <StretchMode>[
                      StretchMode.zoomBackground,
                      StretchMode.blurBackground,
                      StretchMode.fadeTitle,
                    ],
                    background: Stack(
                      fit: StackFit.expand,
                      children: <Widget>[
                        Image.network(snapshot.data!.banner, fit: BoxFit.cover),
                        const DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.0, 0.5),
                              end: Alignment.center,
                              colors: <Color>[
                                Color(0x60000000),
                                Color(0x00000000),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverList(
                  delegate: SliverChildListDelegate([
                    Padding(
                      padding: EdgeInsets.only(
                        left: 10,
                        right: 10,
                        bottom: 20,
                        top: 10,
                      ),
                      child: HtmlWidget(
                        markdown.markdownToHtml(snapshot.data!.content),
                      ),
                    ),
                  ]),
                ),
              ],
            );
          } else if (snapshot.hasError) {
            return Text('${snapshot.error}');
          }
          return const CircularProgressIndicator();
        },
      ),
    );
  }
}
