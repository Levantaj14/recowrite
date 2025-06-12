class LikedFormat {
  final bool liked;

  const LikedFormat({required this.liked});

  factory LikedFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {'liked': bool liked} => LikedFormat(liked: liked),
      _ =>
        throw const FormatException(
          'Failed to parse the information about like.',
        ),
    };
  }
}
