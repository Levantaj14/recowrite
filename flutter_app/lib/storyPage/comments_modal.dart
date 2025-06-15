import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:recowrite/components/base64_avatar.dart';
import 'package:recowrite/formats/comment_format.dart';
import 'package:recowrite/providers/user_provider.dart';

import '../globals.dart' as global;

class CommentsModal extends StatefulWidget {
  final List<CommentFormat> comments;
  final int blogId;

  const CommentsModal({
    super.key,
    required this.comments,
    required this.blogId,
  });

  @override
  State<CommentsModal> createState() => _CommentsModalState();
}

class _CommentsModalState extends State<CommentsModal> {
  final _formKey = GlobalKey<FormState>();
  final commentController = TextEditingController();
  List<CommentFormat> comments = [];

  Future<bool> commentFuture() async {
    final response = await http.post(
      Uri.parse('${global.url}/comments/${widget.blogId}'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Cookie': global.authCookieContent,
      },
      body: jsonEncode(<String, String>{'comment': commentController.text}),
    );
    if (response.statusCode == 201) {
      setState(() {
        commentController.text = '';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Comment added successfully")),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("Failed to add comment")));
    }

    return response.statusCode == 200;
  }

  @override
  void initState() {
    super.initState();
    comments = widget.comments;
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          Expanded(
            child:
                comments.isNotEmpty
                    ? ListView.builder(
                      itemCount: comments.length,
                      shrinkWrap: true,
                      itemBuilder: (context, index) {
                        final comment = comments[index];
                        return ListTile(
                          title: Text(
                            comment.authorName,
                            style: Theme.of(context).textTheme.labelMedium
                                ?.copyWith(fontWeight: FontWeight.w600),
                          ),
                          subtitle: Text(
                            comment.comment,
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          leading: Base64Avatar(
                            base64Image: comment.authorAvatar,
                            radius: 15,
                            fallbackName: comment.authorName,
                          ),
                        );
                      },
                    )
                    : Center(child: Text('There are no comments')),
          ),
          Consumer<UserProvider>(
            builder: (context, userProvider, child) {
              // Check if the user is logged in and display the comment input field
              return userProvider.user != null
                  ? SafeArea(
                    child: Form(
                      key: _formKey,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(8.0, 0, 16, 0),
                            child: Base64Avatar(
                              base64Image: userProvider.user?.avatar,
                              radius: 15,
                              fallbackName: userProvider.user!.name,
                            ),
                          ),
                          Expanded(
                            child: SizedBox(
                              height: 45,
                              child: TextFormField(
                                controller: commentController,
                                style: TextStyle(fontSize: 14),
                                validator: (value) {
                                  if (value == null || value.isEmpty) {
                                    return 'Please enter a comment';
                                  }
                                  return null;
                                },
                                decoration: InputDecoration(
                                  labelText: 'Add a comment',
                                  border: OutlineInputBorder(),
                                  contentPadding: EdgeInsets.symmetric(
                                    vertical: 6,
                                    horizontal: 8,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              if (_formKey.currentState!.validate()) {
                                commentFuture();
                              }
                            },
                            icon: const Icon(Icons.send),
                          ),
                        ],
                      ),
                    ),
                  )
                  : const SizedBox();
            },
            child: const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
