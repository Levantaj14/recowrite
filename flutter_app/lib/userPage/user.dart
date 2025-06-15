import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:lorem_ipsum/lorem_ipsum.dart';
import 'package:recowrite/components/base64_avatar.dart';
import 'package:recowrite/components/vertical_article_card.dart';
import 'package:recowrite/formats/blogs_format.dart';
import 'package:recowrite/formats/user_format.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:url_launcher/url_launcher.dart';

import '../globals.dart' as global;

class User extends StatefulWidget {
  final int id;

  const User({super.key, required this.id});

  @override
  State<User> createState() => _UserState();
}

class _UserState extends State<User> {
  bool fetch = false;
  late Future<List<dynamic>> combinedFuture;
  bool showUser = true;
  UserFormat user = UserFormat(
    id: 0,
    name: loremIpsum(words: 3),
    bio: loremIpsum(words: 10),
    avatar: '',
    username: loremIpsum(words: 2),
    socials: [],
  );
  List<BlogsFormat> blogs = List<BlogsFormat>.generate(
    5,
    (i) => BlogsFormat(
      id: i,
      title: loremIpsum(),
      content: loremIpsum(),
      description: loremIpsum(),
      author: 1,
      banner: '',
      date: DateTime.now().toString(),
    ),
  );

  Future<UserFormat> fetchUserData() async {
    final response = await http.get(
      Uri.parse('${global.url}/user/${widget.id}'),
    );
    if (response.statusCode == 200) {
      user = UserFormat.fromJson(
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>,
      );
      return user;
    } else {
      throw Exception('Failed to load user profile with id ${widget.id}');
    }
  }

  Future<List<BlogsFormat>> fetchBlogs() async {
    final response = await http.get(
      Uri.parse('${global.url}/blogs/author?id=${widget.id}'),
    );
    if (response.statusCode == 200) {
      List<dynamic> jsonData = jsonDecode(utf8.decode(response.bodyBytes));
      blogs = jsonData.map((blog) => BlogsFormat.fromJson(blog)).toList();
      return blogs;
    } else {
      throw Exception('Failed to load blogs for user with id ${widget.id}');
    }
  }

  List<Widget> getSocialLinks() {
    List<Widget> socialLinks = [];
    // Check what socials does the user have
    for (var social in user.socials) {
      if (social.name == 'Instagram') {
        socialLinks.add(
          IconButton(
            onPressed: () async {
              final url = Uri.parse("https://instagram.com/${social.url}");
              if (await canLaunchUrl(url)) {
                launchUrl(url);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Could not launch ${social.name}')),
                );
              }
            },
            icon: FaIcon(FontAwesomeIcons.instagram),
          ),
        );
      } else if (social.name == 'X') {
        socialLinks.add(
          IconButton(
            onPressed: () async {
              final url = Uri.parse("https://x.com/${social.url}");
              if (await canLaunchUrl(url)) {
                launchUrl(url);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Could not launch ${social.name}')),
                );
              }
            },
            icon: FaIcon(FontAwesomeIcons.xTwitter),
          ),
        );
      } else if (social.name == 'Bluesky') {
        socialLinks.add(
          IconButton(
            onPressed: () async {
              final url = Uri.parse("https://bsky.app/profile/${social.url}");
              if (await canLaunchUrl(url)) {
                launchUrl(url);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Could not launch ${social.name}')),
                );
              }
            },
            icon: FaIcon(FontAwesomeIcons.bluesky),
          ),
        );
      } else if (social.name == 'Medium') {
        socialLinks.add(
          IconButton(
            onPressed: () async {
              final url = Uri.parse("https://medium.com/@${social.url}");
              if (await canLaunchUrl(url)) {
                launchUrl(url);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Could not launch ${social.name}')),
                );
              }
            },
            icon: FaIcon(FontAwesomeIcons.medium),
          ),
        );
      }
    }
    return socialLinks;
  }

  @override
  void initState() {
    super.initState();
    combinedFuture = Future.wait([fetchUserData(), fetchBlogs()]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: FutureBuilder(
        future: combinedFuture,
        builder: (context, snapshot) {
          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Skeletonizer(
                    enableSwitchAnimation: true,
                    enabled: !snapshot.hasData,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Column(
                          children: [
                            snapshot.hasData
                                ? Base64Avatar(
                              base64Image: user.avatar,
                              radius: 50,
                              fallbackName: user.name,
                            )
                                : CircleAvatar(
                              radius: 50,
                              backgroundColor: Colors.grey,
                            ),
                            SizedBox(height: 10),
                            Text(
                              user.name,
                              style: Theme.of(context).textTheme.headlineMedium,
                            ),
                            Text(
                              '@${user.username}',
                              style: Theme.of(context).textTheme.labelLarge,
                            ),
                            SizedBox(height: user.bio != null ? 10 : 0),
                            user.bio != null
                                ? Text(
                              user.bio ?? '',
                              textAlign: TextAlign.center,
                            )
                                : Container(),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: getSocialLinks(),
                            ),
                          ],
                        ),
                        SizedBox(height: 16),
                        Padding(
                          padding: const EdgeInsets.only(left: 10.0),
                          child: Text(
                            "Articles",
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                        ),
                        SizedBox(height: 8),
                        ...blogs.map((blog) => VerticalArticleCard(blog: blog))
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
