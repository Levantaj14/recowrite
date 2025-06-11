import 'dart:convert';

import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:recowrite/storyPage/story.dart';

import '../formats/blogs_format.dart';
import '../globals.dart' as global;

class RecommendationCarousel extends StatefulWidget {
  final int id;

  const RecommendationCarousel({super.key, required this.id});

  @override
  State<RecommendationCarousel> createState() => _RecommendationCarouselState();
}

class _RecommendationCarouselState extends State<RecommendationCarousel> {
  late Future<List<BlogsFormat>> futureBlogs;
  bool showRec = true;

  List<BlogsFormat> blogs = List<BlogsFormat>.empty(growable: true);

  Future<List<BlogsFormat>> fetchBlogs() async {
    final response = await http.get(
      Uri.parse('${global.url}/blogs/recommendation?id=${widget.id}'),
    );
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      setState(() {
        blogs = jsonData.map((blog) => BlogsFormat.fromJson(blog)).toList();
      });
      return blogs;
    } else {
      setState(() {
        showRec = false;
      });
      throw Exception('Failed to load recommendations');
    }
  }

  @override
  void initState() {
    super.initState();
    futureBlogs = fetchBlogs();
  }

  @override
  Widget build(BuildContext context) {

    return showRec
        ? Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Divider(color: Colors.grey, indent: 13, endIndent: 13),
            Padding(
              padding: const EdgeInsets.only(
                left: 13,
                right: 13,
                bottom: 15,
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
              child: PageView.builder(
                controller: PageController(
                  viewportFraction: 0.875, // Similar to your 7/8 width
                ),
                physics: const PageScrollPhysics().applyTo(
                  const ClampingScrollPhysics(),
                ),
                itemCount: blogs.length,
                onPageChanged: (index) {
                  // Optional: handle page changes if needed
                },
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => StoryPage(id: blogs[index].id),
                        ),
                        ModalRoute.withName('/'),
                      );
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                      // Add some spacing between items
                      child: Stack(
                        alignment: AlignmentDirectional.bottomStart,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8.0),
                            // Optional: add rounded corners
                            child: SizedBox(
                              width: double.infinity,
                              height: double.infinity,
                              child: Image(
                                fit: BoxFit.cover,
                                image: CachedNetworkImageProvider(
                                  blogs[index].banner == ''
                                      ? 'https://picsum.photos/seed/${index + 1}/600/400'
                                      : blogs[index].banner,
                                ),
                              ),
                            ),
                          ),
                          // Black gradient overlay for better text readability
                          Container(
                            width: double.infinity,
                            height: 120, // Adjust height as needed
                            decoration: BoxDecoration(
                              borderRadius: const BorderRadius.only(
                                bottomLeft: Radius.circular(8.0),
                                bottomRight: Radius.circular(8.0),
                              ),
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Colors.black.withValues(alpha: .7),
                                ],
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
                                  blogs[index].title,
                                  overflow: TextOverflow.ellipsis,
                                  maxLines: 2,
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(color: Colors.white),
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  global.authors[blogs[index].author]?.name ??
                                      'Unknown',
                                  overflow: TextOverflow.fade,
                                  softWrap: false,
                                  style: Theme.of(context).textTheme.bodyMedium
                                      ?.copyWith(color: Colors.white),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        )
        : const SizedBox();
  }
}
