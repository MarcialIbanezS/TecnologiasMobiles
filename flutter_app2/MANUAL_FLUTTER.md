# README - Flutter App

Guía rápida para levantar y ejecutar `flutter_app2`.

## Requisitos previos
- Flutter instalado y en el `PATH` (usa tu SDK local).
- Acceso a Internet para Firebase/Firestore y al backend REST si usas el login.
- Proyecto Firebase configurado (se usa `appmoviles-b5003` en `lib/firebase_options.dart`).

## Instalación de dependencias
```bash
flutter pub get
```
Si vienes de un error o cambio de SDK:
```bash
flutter clean
flutter pub get
```

## Configuración
- **Firebase**: `lib/firebase_options.dart` apunta a `appmoviles-b5003`. Para otras plataformas, coloca los archivos nativos si los compilas:
  - Android: `android/app/google-services.json`
  - iOS/macOS: `ios/Runner/GoogleService-Info.plist` y/o `macos/Runner/GoogleService-Info.plist`
- **Backend REST (login)**: `AuthApiService` usa `API_URL` (`http://localhost:3000/api` por defecto). Para sobrescribir:
  ```bash
  flutter run -d chrome --dart-define=API_URL=http://<host>:3000/api
  ```
  En emulador Android usa `10.0.2.2` para apuntar al host local.

## Ejecutar en Chrome (web)
```bash
flutter run -d chrome
```
Si necesitas definir la API:
```bash
flutter run -d chrome --dart-define=API_URL=http://<host>:3000/api
```

## Funcionalidades clave
- Login via API REST (usuarios deben existir en el backend).
- Listado/búsqueda de pacientes (Firestore).
- Perfil de paciente y ficha médica con descarga TXT/PDF y edición básica.
- Demo de huella (`/fingerprint`) → ficha dummy.
- Perfil de usuario con modo oscuro, idioma (es/en/pt) y cierre de sesión.

## Dependencias principales
- Firebase: `firebase_core`, `cloud_firestore`, `firebase_auth`
- HTTP: `http`
- Preferencias locales: `shared_preferences`
- Localización: `intl`, `flutter_localizations`
- Exportación: `pdf`, `printing`

## Notas de localización
Se usa `lib/app_localizations.dart` (no `flutter_gen`). Los textos cambian según el idioma configurado en el perfil de usuario.

## Problemas comunes
- **Sin dispositivo Android**: crea un AVD en Android Studio o conecta un teléfono; usa `flutter devices` para verificar.
- **CORS/Backend**: asegura que el host del backend sea accesible desde el navegador/emulador.
- **Errores de permisos en WSL**: ejecuta `flutter` desde PowerShell/CMD si ves fallos por `bash\r`.

