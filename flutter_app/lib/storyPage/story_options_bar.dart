import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:recowrite/formats/comment_format.dart';
import 'package:recowrite/formats/like_count_format.dart';
import 'package:recowrite/formats/liked_format.dart';
import 'package:recowrite/providers/user_provider.dart';
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
  LikedFormat liked = const LikedFormat(liked: false);

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
      comments = jsonData.map((comment) => CommentFormat.fromJson(comment)).toList();
      return comments;
    } else {
      throw Exception(
        'Failed to load the comments of the blog with id ${widget.id}',
      );
    }
  }

  Future<LikedFormat> fetchLiked() async {
    if (global.authCookieContent == '') {
      liked = const LikedFormat(liked: false);
      return liked;
    }
    final response = await http.get(
      Uri.parse('${global.url}/likes/${widget.id}'),
      headers: <String, String>{'Cookie': global.authCookieContent},
    );
    if (response.statusCode == 200) {
      liked = LikedFormat.fromJson(
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>,
      );
      return liked;
    } else if (response.statusCode == 403) {
      liked = LikedFormat(liked: false);
      return liked;
    } else {
      throw Exception(
        'Failed to load the like status of the blog with id ${widget.id}',
      );
    }
  }

  Future<void> likePost() async {
    final response = await http.put(
      Uri.parse('${global.url}/likes/${widget.id}'),
      headers: <String, String>{'Cookie': global.authCookieContent},
    );
    if (response.statusCode == 204) {
      if (liked.liked) {
        setState(() {
          liked = LikedFormat(liked: false);
          likeCount = LikeCountFormat(count: likeCount.count - 1);
        });
      } else {
        setState(() {
          liked = LikedFormat(liked: true);
          likeCount = LikeCountFormat(count: likeCount.count + 1);
        });
      }
    } else {
      throw Exception('Failed to like the post');
    }
  }

  @override
  void initState() {
    super.initState();
    combinedFuture = Future.wait([
      fetchLikeCount(),
      fetchComments(),
      fetchLiked(),
    ]);
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
                Consumer<UserProvider>(
                  builder: (context, userProvider, child) {
                    return IconButton(
                      tooltip: "Like",
                      onPressed:
                          userProvider.user != null
                              ? () {
                                try {
                                  likePost();
                                } catch (e) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text(e.toString())),
                                  );
                                }
                              }
                              : null,
                      icon: Icon(
                        liked.liked ? Icons.favorite : Icons.favorite_outline,
                      ),
                    );
                  },
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
                        return CommentsModal(
                          comments: comments,
                          blogId: widget.id,
                        );
                      },
                    );
                  },
                  icon: Icon(Icons.comment),
                ),
                Expanded(child: Text(comments.length.toString())),
                Consumer<UserProvider>(
                  builder: (context, userProvider, child) {
                    return IconButton(
                      tooltip: "Report",
                      onPressed:
                          userProvider.user != null
                              ? () {
                                showDialog(
                                  context: context,
                                  builder:
                                      (context) =>
                                          ReportDialog(blogId: widget.id),
                                );
                              }
                              : null,
                      icon: Icon(Icons.warning_amber_rounded),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
