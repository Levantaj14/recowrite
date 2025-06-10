import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

import '../formats/blogs_format.dart';
import '../storyPage/story.dart';

class VerticalArticleCard extends StatelessWidget {
  final BlogsFormat blog;

  const VerticalArticleCard({super.key, required this.blog});

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
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      clipBehavior: Clip.hardEdge,
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => StoryPage(id: blog.id)),
          );
        },
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            blog.banner == ''
                ? const SizedBox(height: 97)
                : CachedNetworkImage(
                  imageUrl: blog.banner,
                  errorWidget: (context, url, error) => Icon(Icons.error),
                  height: 97,
                  width: 70,
                  fit: BoxFit.cover,
                ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      blog.title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      decideDescription(),
                      style: Theme.of(context).textTheme.bodySmall,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
