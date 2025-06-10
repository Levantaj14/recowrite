import 'dart:async';
import 'dart:convert';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:http/http.dart' as http;
import 'package:lorem_ipsum/lorem_ipsum.dart';
import 'package:markdown/markdown.dart' as markdown;
import 'package:recowrite/storyPage/not_published.dart';
import 'package:recowrite/storyPage/recommendation_carousel.dart';
import 'package:recowrite/userPage/user.dart';
import 'package:skeletonizer/skeletonizer.dart';

import '../formats/blogs_format.dart';
import '../globals.dart' as global;

class StoryPage extends StatefulWidget {
  final int id;

  const StoryPage({super.key, required this.id});

  @override
  State<StoryPage> createState() => _StoryPageState();
}

class _StoryPageState extends State<StoryPage> {
  bool fetch = false;
  late Future<BlogsFormat> futureBlogs;
  bool showBlog = true;
  BlogsFormat blog = BlogsFormat(
    id: 0,
    title: loremIpsum(),
    description: '',
    content: loremIpsum(paragraphs: 5),
    banner: '',
    date: '2025-04-08T11:05:25Z',
    author: 1,
  );

  Future<BlogsFormat> fetchData() async {
    final response = await http.get(
      Uri.parse('${global.url}/blogs/${widget.id}'),
    );
    if (response.statusCode == 200) {
      blog = BlogsFormat.fromJson(
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>,
      );
      return blog;
    } else {
      throw Exception('Failed to load blog with id ${widget.id}');
    }
  }

  bool isPublished() {
    DateTime now = DateTime.now();
    DateTime posting = DateTime.parse(blog.date);
    return posting.isBefore(now);
  }

  @override
  void initState() {
    super.initState();
    futureBlogs = fetchData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<BlogsFormat>(
        future: futureBlogs,
        builder: (context, snapshot) {
          return Skeletonizer(
            enableSwitchAnimation: true,
            enabled: !snapshot.hasData,
            child: CustomScrollView(
              slivers: [
                SliverAppBar.large(
                  stretch: true,
                  expandedHeight: 300.0,
                  title: Text(blog.title),
                  flexibleSpace: FlexibleSpaceBar(
                    stretchModes: const <StretchMode>[
                      StretchMode.zoomBackground,
                      StretchMode.blurBackground,
                      StretchMode.fadeTitle,
                    ],
                    background: Stack(
                      fit: StackFit.expand,
                      children: <Widget>[
                        blog.banner == ''
                            ? SizedBox()
                            : Image(
                              image: CachedNetworkImageProvider(blog.banner),
                              fit: BoxFit.cover,
                            ),
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
                  actions: [
                    Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: IconButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => User(id: blog.author),
                            ),
                          );
                        },
                        icon: Icon(Icons.person),
                        tooltip: 'Author',
                      ),
                    ),
                  ],
                ),
                SliverList(
                  delegate: SliverChildListDelegate(
                    isPublished()
                        ? [
                          Padding(
                            padding: EdgeInsets.only(
                              left: 13,
                              right: 13,
                              bottom: 20,
                              top: 10,
                            ),
                            child: HtmlWidget(
                              markdown.markdownToHtml(blog.content),
                            ),
                          ),
                          RecommendationCarousel(id: widget.id),
                        ]
                        : [
                          NotPublished(
                            blog: blog,
                            onPublish: () {
                              setState(() {
                                futureBlogs = fetchData();
                              });
                            },
                          ),
                        ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: BottomAppBar(
        child: Row(
          children: [
            IconButton(onPressed: () {}, icon: Icon(Icons.favorite_outline)),
            Text('513'),
            SizedBox(width: 8),
            IconButton(onPressed: () {}, icon: Icon(Icons.comment)),
            Text('3'),
          ],
        ),
      ),
    );
  }
}
