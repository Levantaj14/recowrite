import 'package:flutter/material.dart';

import 'formats/user_format.dart';

final failedToLoadBlogSnackBar = SnackBar(content: Text('Failed to load. Please try again!'));
final String url = "http://192.168.1.140:8080";
String authCookieContent = '';

Map<int, UserFormat> authors = {
  1: const UserFormat(
    id: 1,
    name: 'John Doe',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    avatar: 'https://example.com/avatar.jpg',
    username: 'johndoe',
    socials: []
  ),
};