import 'package:flutter/material.dart';

class StoryOptionsBar extends StatelessWidget {
  const StoryOptionsBar({super.key});

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      child: Row(
        children: [
          IconButton(onPressed: () {}, icon: Icon(Icons.favorite_outline)),
          Text('513'),
          SizedBox(width: 8),
          IconButton(onPressed: () {}, icon: Icon(Icons.comment)),
          Text('3'),
        ],
      ),
    );
  }
}

