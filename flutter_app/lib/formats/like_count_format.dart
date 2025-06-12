class LikeCountFormat {
  final int count;

  const LikeCountFormat({
    required this.count,
  });

  factory LikeCountFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
      'count': int count
      } =>
          LikeCountFormat(
            count: count
          ),
      _ => throw const FormatException('Failed to parse like counts.'),
    };
  }
}
