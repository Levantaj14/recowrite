import 'package:recowrite/formats/socials_format.dart';

class UserFormat {
  final int id;
  final String name;
  final String? bio;
  final String? avatar;
  final String username;
  final List<SocialsFormat> socials;

  const UserFormat({
    required this.id,
    required this.name,
    required this.bio,
    required this.avatar,
    required this.username,
    required this.socials,
  });

  factory UserFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': int id,
        'name': String name,
        'bio': String? bio,
        'avatar': String? avatar,
        'username': String username,
        'socials': List<dynamic> socialsJson,
      } =>
        UserFormat(
          id: id,
          name: name,
          bio: bio,
          avatar: avatar,
          username: username,
          socials:
              socialsJson
                  .map(
                    (socialJson) => SocialsFormat.fromJson(
                      socialJson as Map<String, dynamic>,
                    ),
                  )
                  .toList(),
        ),
      _ => throw const FormatException('Failed to parse user.'),
    };
  }
}
