import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html_core/flutter_widget_from_html_core.dart';
import 'package:markdown/markdown.dart' as markdown;
import 'package:recowrite/formats/new_blog_format.dart';

class NewPost extends StatefulWidget {
  const NewPost({super.key});

  @override
  State<NewPost> createState() => _NewPostState();
}

enum ReleaseOptions {now, scheduled}

class _NewPostState extends State<NewPost> {
  int index = 0;
  final newBlogData = WriteBlog();
  ReleaseOptions _releaseDate = ReleaseOptions.now;

  final _formKeys = [GlobalKey<FormState>(), null, GlobalKey<FormState>()];

  void _nextStep() {
    final form = _formKeys[index]?.currentState;
    if (form == null) {
      setState(() => index++);
      return;
    }
    if (form.validate()) {
      form.save();
      setState(() => index++);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('New Post')),
      body: Stepper(
        controlsBuilder:
            (context, details) => Padding(
              padding: const EdgeInsets.only(top: 10.0),
              child: Row(
                children: [
                  ElevatedButton(
                    onPressed: index < 2 ? details.onStepContinue : null,
                    child: index < 2 ? const Text('Next') : const Text('Post'),
                  ),
                  const SizedBox(width: 8),
                  TextButton(
                    onPressed: index != 0 ? details.onStepCancel : null,
                    child: const Text('Back'),
                  ),
                ],
              ),
            ),
        type: StepperType.horizontal,
        currentStep: index,
        onStepCancel: () {
          if (index > 0) {
            setState(() {
              index -= 1;
            });
          }
        },
        onStepContinue: () => _nextStep(),
        steps: [
          Step(
            title: Text('Write'),
            content: SizedBox(
              height: MediaQuery.of(context).size.height * 0.6,
              child: Form(
                key: _formKeys[0],
                child: TextFormField(
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  expands: true,
                  textAlignVertical: TextAlignVertical.top,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Write your post here...',
                  ),
                  validator:
                      (v) =>
                          v == null || v == ''
                              ? 'Please enter some text'
                              : null,
                  onSaved: (value) => newBlogData.content = value,
                ),
              ),
            ),
            isActive: index == 0,
          ),
          Step(
            title: Text('Preview'),
            content: HtmlWidget(
              markdown.markdownToHtml(
                newBlogData.content ?? 'There is no content',
              ),
            ),
            isActive: index == 1,
          ),
          Step(
            title: Text('Customize'),
            content: Form(
              key: _formKeys[1],
              child: Column(
                children: [
                  TextFormField(
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Title',
                    ),
                    validator:
                        (v) =>
                            v == null || v == ''
                                ? 'Please enter some text'
                                : null,
                    onSaved: (value) => newBlogData.title = value,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Description',
                    ),
                    keyboardType: TextInputType.multiline,
                    maxLines: 4,
                    expands: false,
                    validator:
                        (v) =>
                            v!.length > 256
                                ? 'The maximum number of characters is 255'
                                : v,
                    onSaved: (value) => newBlogData.description = value,
                  ),
                  const SizedBox(height: 16),
                  Text('Posting date'),
                  RadioGroup(
                    groupValue: _releaseDate,
                    onChanged: (value) {
                      _releaseDate = value!;
                      setState(() {});
                    },
                    child: Column(
                      children: [
                        ListTile(
                          title: const Text('Now'),
                          leading: Radio(value: ReleaseOptions.now),
                        ),
                        ListTile(
                          title: const Text('Scheduled'),
                          leading: Radio(value: ReleaseOptions.scheduled),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Banner URL',
                      helper: Text(
                        'Make sure the picture is free to use and not copyrighted',
                      ),
                    ),
                    validator:
                        (v) =>
                            v == null || v == '' ? 'Please enter a URL' : null,
                    onSaved: (value) => newBlogData.banner = value,
                  ),
                ],
              ),
            ),
            isActive: index == 2,
          ),
        ],
      ),
    );
  }
}
