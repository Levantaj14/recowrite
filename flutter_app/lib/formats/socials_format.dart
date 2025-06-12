class SocialsFormat {
  final String name;
  final String url;

  const SocialsFormat({required this.name, required this.url});

  factory SocialsFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {'name': String name, 'url': String url} => SocialsFormat(
        name: name,
        url: url,
      ),
      _ => throw const FormatException('Failed to parse social data.'),
    };
  }
}
