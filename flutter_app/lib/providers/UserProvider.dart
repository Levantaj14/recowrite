import 'package:flutter/foundation.dart';
import 'package:recowrite/formats/user_format.dart';

class UserProvider extends ChangeNotifier {
  UserFormat? _user;
  bool _isLoading = false;

  UserFormat? get user => _user;

  bool get isLoading => _isLoading;

  bool get isLoggedIn => _user != null;

  void setUser(UserFormat user) {
    _user = user;
    notifyListeners(); // This triggers UI updates
  }

  void logout() {
    _user = null;
    notifyListeners();
  }

  void updateUser(UserFormat updatedUser) {
    _user = updatedUser;
    notifyListeners();
  }

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}
