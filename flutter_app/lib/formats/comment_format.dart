class CommentFormat {
  final int id;
  final String comment;
  final int authorId;
  final String authorName;
  final String authorUsername;
  final String? authorAvatar;

  const CommentFormat({
    required this.id,
    required this.comment,
    required this.authorId,
    required this.authorName,
    required this.authorUsername,
    required this.authorAvatar,
  });

  factory CommentFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
      'id': int id,
      'comment': String comment,
      'authorId': int authorId,
      'authorName': String authorName,
      'authorUsername': String authorUsername,
      'authorAvatar': String? authorAvatar,
      } =>
          CommentFormat(
            id: id,
            comment: comment,
            authorId: authorId,
            authorName: authorName,
            authorUsername: authorUsername,
            authorAvatar: authorAvatar,
          ),
      _ => throw const FormatException('Failed to parse comment.'),
    };
  }
}
