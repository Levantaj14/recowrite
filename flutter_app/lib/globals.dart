import 'package:flutter/material.dart';

import 'formats/author_format.dart';

bool auth = false;
final failedToLoadBlogSnackBar = SnackBar(content: Text('Failed to load. Please try again!'));
final String url = "http://192.168.1.148:8080";

Map<int, AuthorFormat> authors = {
  1: const AuthorFormat(
    id: 1,
    name: 'John Doe',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    avatar: 'https://example.com/avatar.jpg',
    username: 'johndoe',
  ),
};