import 'dart:convert';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:lorem_ipsum/lorem_ipsum.dart';
import 'package:recowrite/story.dart';

import 'formats/blogs_format.dart';
import 'globals.dart' as global;

class RecommendationCarousel extends StatefulWidget {
  final int id;

  const RecommendationCarousel({super.key, required this.id});

  @override
  State<RecommendationCarousel> createState() => _RecommendationCarouselState();
}

class _RecommendationCarouselState extends State<RecommendationCarousel> {
  late Future<List<BlogsFormat>> futureBlogs;

  List<BlogsFormat> blogs = List<BlogsFormat>.generate(
    3,
    (i) => BlogsFormat(
      id: i,
      title: loremIpsum(words: 3),
      content: loremIpsum(),
      description: loremIpsum(),
      author: 1,
      banner: '',
      date: DateTime.now().toString(),
    ),
  );

  Future<List<BlogsFormat>> fetchBlogs() async {
    final response = await http.get(
      Uri.parse('http://localhost:8080/blogs/recommendation?id=${widget.id}'),
    );
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      setState(() {
        blogs = jsonData.map((blog) => BlogsFormat.fromJson(blog)).toList();
      });
      return blogs;
    } else {
      throw Exception('Failed to load blogs');
    }
  }

  @override
  void initState() {
    super.initState();
    futureBlogs = fetchBlogs();
  }

  @override
  Widget build(BuildContext context) {
    final double width = MediaQuery.sizeOf(context).width;

    return ConstrainedBox(
      constraints: BoxConstraints(maxHeight: 250),
      child: CarouselView.weighted(
        enableSplash: true,
        itemSnapping: true,
        flexWeights: const <int>[1, 7, 1],
        onTap: (i){
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => StoryPage(id: blogs[i].id)),
            ModalRoute.withName('/'),
          );
        },
        children: [
          for (int i = 0; i < 3; i++)
            Stack(
              alignment: AlignmentDirectional.bottomStart,
              children: [
                ClipRect(
                  child: OverflowBox(
                    maxWidth: width * 7 / 8,
                    minWidth: width * 7 / 8,
                    child: Image(
                      fit: BoxFit.cover,
                      image: CachedNetworkImageProvider(
                        blogs[i].banner == ''
                            ? 'https://picsum.photos/seed/${i + 1}/600/400'
                            : blogs[i].banner,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(18.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      Text(
                        blogs[i].title,
                        overflow: TextOverflow.fade,
                        softWrap: false,
                        style: Theme.of(context).textTheme.headlineSmall
                            ?.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        global.authors[blogs[i].author]?.name ?? 'Unknown',
                        overflow: TextOverflow.fade,
                        softWrap: false,
                        style: Theme.of(
                          context,
                        ).textTheme.bodyMedium?.copyWith(color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}
