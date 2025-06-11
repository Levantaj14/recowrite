import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:recowrite/formats/comment_format.dart';
import 'package:recowrite/formats/like_count_format.dart';
import 'package:recowrite/storyPage/comments_modal.dart';
import 'package:recowrite/storyPage/report_dialog.dart';
import 'package:skeletonizer/skeletonizer.dart';

import '../globals.dart' as global;

class StoryOptionsBar extends StatefulWidget {
  final int id;

  const StoryOptionsBar({super.key, required this.id});

  @override
  State<StoryOptionsBar> createState() => _StoryOptionsBarState();
}

class _StoryOptionsBarState extends State<StoryOptionsBar> {
  late Future<List<dynamic>> combinedFuture;
  LikeCountFormat likeCount = const LikeCountFormat(count: 0);
  List<CommentFormat> comments = List<CommentFormat>.generate(
    5,
    (i) => CommentFormat(
      id: i,
      comment: 'This is a comment $i',
      authorId: 1,
      authorName: 'User $i',
      authorUsername: 'user$i',
      authorAvatar: '',
    ),
  );

  Future<LikeCountFormat> fetchLikeCount() async {
    final response = await http.get(
      Uri.parse('${global.url}/likes/count/${widget.id}'),
    );
    if (response.statusCode == 200) {
      likeCount = LikeCountFormat.fromJson(
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>,
      );
      return likeCount;
    } else {
      throw Exception(
        'Failed to load the like count of the blog with id ${widget.id}',
      );
    }
  }

  Future<List<CommentFormat>> fetchComments() async {
    final response = await http.get(
      Uri.parse('${global.url}/comments/${widget.id}'),
    );
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      comments = jsonData.map((blog) => CommentFormat.fromJson(blog)).toList();
      return comments;
    } else {
      throw Exception(
        'Failed to load the comments of the blog with id ${widget.id}',
      );
    }
  }

  @override
  void initState() {
    super.initState();
    combinedFuture = Future.wait([fetchLikeCount(), fetchComments()]);
  }

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      child: FutureBuilder(
        future: combinedFuture,
        builder: (context, snapshot) {
          return Skeletonizer(
            enableSwitchAnimation: true,
            enabled: !snapshot.hasData,
            child: Row(
              children: [
                IconButton(
                  tooltip: "Like",
                  onPressed: global.auth ? () {} : null,
                  icon: Icon(Icons.favorite_outline),
                ),
                Text(likeCount.count.toString()),
                SizedBox(width: 8),
                IconButton(
                  tooltip: "Comments",
                  onPressed: () {
                    showModalBottomSheet(
                      context: context,
                      showDragHandle: true,
                      builder: (BuildContext context) {
                        return CommentsModal(comments: comments);
                      },
                    );
                  },
                  icon: Icon(Icons.comment),
                ),
                Expanded(child: Text(comments.length.toString())),
                IconButton(
                  tooltip: "Report",
                  onPressed: global.auth ? () {
                    showDialog(
                      context: context,
                      builder: (context) => const ReportDialog(),
                    );
                  } : null,
                  icon: Icon(Icons.warning_amber_rounded),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
