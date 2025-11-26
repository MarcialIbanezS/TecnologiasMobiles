class AuthUser {
  final int id;
  final String username;
  final String name;
  final String? specialty;

  const AuthUser({
    required this.id,
    required this.username,
    required this.name,
    this.specialty,
  });

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id'] is int ? json['id'] : int.tryParse('${json['id']}') ?? 0,
      username: json['username']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      specialty: json['specialty']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'name': name,
      if (specialty != null) 'specialty': specialty,
    };
  }
}
