import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:recowrite/components/base64_avatar.dart';
import 'package:recowrite/formats/comment_format.dart';
import 'package:recowrite/providers/UserProvider.dart';

class CommentsModal extends StatelessWidget {
  final List<CommentFormat> comments;


  const CommentsModal({super.key, required this.comments});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: [
          Expanded(
            child: comments.isNotEmpty ? ListView.builder(
              itemCount: comments.length,
              shrinkWrap: true,
              itemBuilder: (context, index) {
                final comment = comments[index];
                return ListTile(
                  title: Text(
                    comment.authorName,
                    style: Theme.of(context).textTheme.labelMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
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
            ) : Center(child: Text('There are no comments')),
          ),
          Consumer<UserProvider>(
            builder: (context, userProvider, child) {
              return userProvider.user != null ?
              SafeArea(
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
                            style: TextStyle(fontSize: 14),
                            decoration: InputDecoration(
                              labelText: 'Add a comment',
                              border: OutlineInputBorder(),
                              contentPadding: EdgeInsets.symmetric(vertical: 6, horizontal: 8),
                            ),
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          // Handle comment submission
                        },
                        icon: const Icon(Icons.send),
                      ),
                    ],
                  )
              ) : const SizedBox();
            },
            child: const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}
