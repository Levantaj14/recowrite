class WriteBlog {
  String? title;
  String? content;
  String? description;
  String? banner;
  String? bannerType = 'IMAGE_URL';
  String? date;

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'description': description,
      'banner': banner,
      'banner_type': 'IMAGE_URL',
      'date': date,
    };
  }
}
