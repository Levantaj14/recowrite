import 'dart:convert';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:http/http.dart' as http;
import 'package:lorem_ipsum/lorem_ipsum.dart';
import 'package:markdown/markdown.dart' as markdown;
import 'package:skeletonizer/skeletonizer.dart';

import 'formats/blogs_format.dart';

class StoryPage extends StatefulWidget {
  final int id;

  const StoryPage({super.key, required this.id});

  @override
  State<StoryPage> createState() => _StoryPageState();
}

class _StoryPageState extends State<StoryPage> {
  bool fetch = false;
  late Future<BlogsFormat> futureBlogs;
  BlogsFormat blog = BlogsFormat(
    id: 0,
    title: loremIpsum(),
    description: '',
    content: loremIpsum(paragraphs: 5),
    banner: '',
    date: DateTime.now().toString(),
    author: 1,
  );

  Future<BlogsFormat> fetchData() async {
    final response = await http.get(
      Uri.parse('http://localhost:8080/blogs/${widget.id}'),
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
          if (snapshot.hasError) {
            print('${snapshot.error}');
          }
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
                ),
                SliverList(
                  delegate: SliverChildListDelegate([
                    Padding(
                      padding: EdgeInsets.only(
                        left: 13,
                        right: 13,
                        bottom: 20,
                        top: 10,
                      ),
                      child: HtmlWidget(markdown.markdownToHtml(blog.content)),
                    ),
                    Divider(color: Colors.grey, indent: 13, endIndent: 13),
                    Padding(
                      padding: const EdgeInsets.only(
                        left: 13,
                        right: 13,
                        bottom: 20,
                        top: 10,
                      ),
                      child: Text(
                        'Continue reading',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    ConstrainedBox(
                      constraints: BoxConstraints(maxHeight: 250),
                      child: CarouselView.weighted(
                        itemSnapping: true,
                        flexWeights: const <int>[1, 7, 1],
                        children: [
                          for (int i = 0; i < 3; i++)
                            Image(
                              image: CachedNetworkImageProvider(
                                'https://picsum.photos/seed/${i + 1}/600/400',
                              ),
                              fit: BoxFit.cover,
                            ),
                        ],
                      ),
                    ),
                  ]),
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
