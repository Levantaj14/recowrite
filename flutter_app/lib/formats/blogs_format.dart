class BlogsFormat {
  final int id;
  final String title;
  final String content;
  final String description;
  final int author;
  final String banner;
  final String date;
  final String bannerType;

  const BlogsFormat({
    required this.id,
    required this.title,
    required this.content,
    required this.description,
    required this.author,
    required this.banner,
    required this.date,
    this.bannerType = 'IMAGE_UPLOAD',
  });

  factory BlogsFormat.fromJson(Map<String, dynamic> json) {
    return switch (json) {
      {
        'id': int id,
        'banner': String banner,
        'content': String content,
        'date': String date,
        'description': String descripton,
        'title': String title,
        'author': int author,
        'banner_type': String bannerType,
      } =>
        BlogsFormat(
          id: id,
          title: title,
          content: content,
          description: descripton,
          author: author,
          banner: banner,
          date: date,
          bannerType: bannerType,
        ),
      _ => throw const FormatException('Failed to parse blogs.'),
    };
  }
}
