class AuthorFormat {
  final int id;
  final String name;
  final String? bio;
  final String? avatar;
  final String username;

  const AuthorFormat({
    required this.id,
    required this.name,
    required this.bio,
    required this.avatar,
    required this.username,
  });

  factory AuthorFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': int id,
        'name': String name,
        'bio': String? bio,
        'avatar': String? avatar,
        'username': String username,
      } =>
        AuthorFormat(
          id: id,
          name: name,
          bio: bio,
          avatar: avatar,
          username: username,
        ),
      _ => throw const FormatException('Failed to parse author.'),
    };
  }
}