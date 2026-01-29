import 'dart:async';

import 'package:flutter/material.dart';
import 'package:recowrite/formats/blogs_format.dart';
import 'package:smooth_counter/smooth_counter.dart';

class NotPublished extends StatefulWidget {
  final BlogsFormat blog;
  final VoidCallback onPublish;
  const NotPublished({super.key, required this.blog, required this.onPublish});

  @override
  State<NotPublished> createState() => _NotPublishedState();
}

class _NotPublishedState extends State<NotPublished> {
  final _daysController = SmoothCounterController(duration: Duration(seconds: 1));
  final _hoursController = SmoothCounterController(duration: Duration(seconds: 1));
  final _minutesController = SmoothCounterController(duration: Duration(seconds: 1));
  final _secondsController = SmoothCounterController(duration: Duration(seconds: 1));
  late Timer _timer;

  void updateTimer() {
    // Calculate the difference between the current time and the blog's posting time
    DateTime now = DateTime.now();
    DateTime posting = DateTime.parse(widget.blog.date);
    Duration difference = posting.difference(now);

    if (difference.isNegative) {
      _timer.cancel();
      widget.onPublish();
      return;
    }

    _daysController.count = difference.inDays;
    _hoursController.count = difference.inHours % 24;
    _minutesController.count = difference.inMinutes % 60;
    _secondsController.count = difference.inSeconds % 60;
  }

  @override
  void dispose() {
    _timer.cancel();
    _daysController.dispose();
    _hoursController.dispose();
    _minutesController.dispose();
    _secondsController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      updateTimer();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: 13,
        right: 13,
        bottom: 20,
        top: 15,
      ),
      child: Column(
        children: [
          Text('This blog will be available in:', style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w500,
          ),),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SmoothCounter(
                controller: _daysController,
                textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                curve: Curves.easeInOut,
              ),
              Text(':', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              SmoothCounter(
                controller: _hoursController,
                textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                curve: Curves.easeInOut,
              ),
              Text(':', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              SmoothCounter(
                controller: _minutesController,
                textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                curve: Curves.easeInOut,
              ),
              Text(':', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600)),
              SmoothCounter(
                controller: _secondsController,
                textStyle: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                curve: Curves.easeInOut,
              ),
            ],
          )
        ],
      ),
    );
  }
}
