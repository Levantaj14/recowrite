import 'package:flutter/material.dart';

class NewPost extends StatefulWidget {
  const NewPost({super.key});

  @override
  State<NewPost> createState() => _NewPostState();
}

class _NewPostState extends State<NewPost> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('New Post')),
      body: Stepper(
        currentStep: index,
        onStepCancel: () {
          if (index > 0) {
            setState(() {
              index -= 1;
            });
          }
        },
        onStepContinue: () {
          if (index <= 1) {
            setState(() {
              index += 1;
            });
          }
        },
        steps: [
          Step(
            title: Text('Write'),
            content: Text('Content for Step 1'),
            isActive: true,
          ),
          Step(
            title: Text('Preview'),
            content: Text('Content for Step 2'),
            isActive: true,
          ),
          Step(
            title: Text('Customize'),
            content: Text('Content for Step 3'),
            isActive: true,
          ),
        ],
      ),
    );
  }
}
