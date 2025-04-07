import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:recowrite/formats/author_format.dart';
import 'package:recowrite/formats/blogs_format.dart';
import 'package:recowrite/story.dart';

class ArticleCard extends StatelessWidget {
  final BlogsFormat blog;
  final AuthorFormat author;

  const ArticleCard({super.key, required this.blog, required this.author});

  @override
  Widget build(BuildContext context) {
    List<String> patternsToRemove = [
      '\\*\\*',
      '\\[',
      '\\]',
      '\\(.*?\\)',
      '#',
      '```',
    ];

    String decideDescription() {
      DateTime now = DateTime.now();
      DateTime posting = DateTime.parse(blog.date);
      if (posting.isAfter(now)) {
        return "This blog is not yet published";
      }
      if (blog.description.isEmpty) {
        String cont = "";
        if (blog.content.length > 100) {
          cont = "${blog.content.substring(0, 100)}...";
          for (var pattern in patternsToRemove) {
            cont = cont.replaceAll(RegExp(pattern), '');
          }
        } else {
          cont = blog.content;
        }
        return cont;
      }
      return blog.description;
    }

    return Card.outlined(
      key: Key("${blog.id}"),
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      clipBehavior: Clip.hardEdge,
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => StoryPage(id: blog.id)),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(12),
              ),
              child:
                  blog.banner == ''
                      ? SizedBox(height: 150)
                      : CachedNetworkImage(
                        imageUrl: blog.banner,
                        errorWidget: (context, url, error) => Icon(Icons.error),
                        height: 150,
                        width: double.infinity,
                        fit: BoxFit.cover,
                      ),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(author.name, style: TextStyle(fontSize: 12)),
                  const SizedBox(height: 4),
                  Text(
                    blog.title,
                    style: const TextStyle(fontSize: 16),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    decideDescription(),
                    style: TextStyle(fontSize: 13),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
