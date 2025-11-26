import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_es.dart';
import 'app_localizations_pt.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('es'),
    Locale('pt'),
  ];

  /// No description provided for @appTitle.
  ///
  /// In es, this message translates to:
  /// **'App Tecnologías Móviles'**
  String get appTitle;

  /// No description provided for @welcomeTitle.
  ///
  /// In es, this message translates to:
  /// **'Bienvenido a Doble M.A.'**
  String get welcomeTitle;

  /// No description provided for @welcomeSubtitle.
  ///
  /// In es, this message translates to:
  /// **'Accede al sistema médico con tus credenciales'**
  String get welcomeSubtitle;

  /// No description provided for @userLabel.
  ///
  /// In es, this message translates to:
  /// **'Usuario'**
  String get userLabel;

  /// No description provided for @passwordLabel.
  ///
  /// In es, this message translates to:
  /// **'Contraseña'**
  String get passwordLabel;

  /// No description provided for @loginButton.
  ///
  /// In es, this message translates to:
  /// **'Ingresar'**
  String get loginButton;

  /// No description provided for @loginFingerprint.
  ///
  /// In es, this message translates to:
  /// **'Ingresar con huella dactilar'**
  String get loginFingerprint;

  /// No description provided for @loginGuest.
  ///
  /// In es, this message translates to:
  /// **'Entrar como invitado'**
  String get loginGuest;

  /// No description provided for @homeTitle.
  ///
  /// In es, this message translates to:
  /// **'Inicio'**
  String get homeTitle;

  /// No description provided for @mainPanelTitle.
  ///
  /// In es, this message translates to:
  /// **'Panel principal'**
  String get mainPanelTitle;

  /// No description provided for @searchBasic.
  ///
  /// In es, this message translates to:
  /// **'Búsqueda básica'**
  String get searchBasic;

  /// No description provided for @noPatientSelected.
  ///
  /// In es, this message translates to:
  /// **'No hay paciente seleccionado'**
  String get noPatientSelected;

  /// No description provided for @selectPatientHint.
  ///
  /// In es, this message translates to:
  /// **'Busca un paciente o utiliza el lector de huella para continuar.'**
  String get selectPatientHint;

  /// No description provided for @viewMedicalRecord.
  ///
  /// In es, this message translates to:
  /// **'Ver ficha médica'**
  String get viewMedicalRecord;

  /// No description provided for @fingerprintCardTitle.
  ///
  /// In es, this message translates to:
  /// **'Escanea la huella del paciente'**
  String get fingerprintCardTitle;

  /// No description provided for @fingerprintCardSubtitle.
  ///
  /// In es, this message translates to:
  /// **'Puedes autenticar la identidad usando el lector biométrico.'**
  String get fingerprintCardSubtitle;

  /// No description provided for @patientProfileTitle.
  ///
  /// In es, this message translates to:
  /// **'Perfil del paciente'**
  String get patientProfileTitle;

  /// No description provided for @generalInfo.
  ///
  /// In es, this message translates to:
  /// **'Información general'**
  String get generalInfo;

  /// No description provided for @patientId.
  ///
  /// In es, this message translates to:
  /// **'ID paciente'**
  String get patientId;

  /// No description provided for @birthDate.
  ///
  /// In es, this message translates to:
  /// **'Fecha de nacimiento'**
  String get birthDate;

  /// No description provided for @address.
  ///
  /// In es, this message translates to:
  /// **'Dirección'**
  String get address;

  /// No description provided for @phone.
  ///
  /// In es, this message translates to:
  /// **'Teléfono'**
  String get phone;

  /// No description provided for @email.
  ///
  /// In es, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @sex.
  ///
  /// In es, this message translates to:
  /// **'Sexo'**
  String get sex;

  /// No description provided for @rut.
  ///
  /// In es, this message translates to:
  /// **'RUT'**
  String get rut;

  /// No description provided for @medicalRecordTitle.
  ///
  /// In es, this message translates to:
  /// **'Ficha médica'**
  String get medicalRecordTitle;

  /// No description provided for @download.
  ///
  /// In es, this message translates to:
  /// **'Descargar'**
  String get download;

  /// No description provided for @refresh.
  ///
  /// In es, this message translates to:
  /// **'Actualizar'**
  String get refresh;

  /// No description provided for @edit.
  ///
  /// In es, this message translates to:
  /// **'Editar'**
  String get edit;

  /// No description provided for @noRecords.
  ///
  /// In es, this message translates to:
  /// **'No hay fichas médicas registradas para este paciente.'**
  String get noRecords;

  /// No description provided for @noRecordSelected.
  ///
  /// In es, this message translates to:
  /// **'No hay ficha seleccionada'**
  String get noRecordSelected;

  /// No description provided for @errorLoadingRecords.
  ///
  /// In es, this message translates to:
  /// **'Ocurrió un error al cargar las fichas.'**
  String get errorLoadingRecords;

  /// No description provided for @editMedicalRecord.
  ///
  /// In es, this message translates to:
  /// **'Editar ficha médica'**
  String get editMedicalRecord;

  /// No description provided for @allergy.
  ///
  /// In es, this message translates to:
  /// **'Alergia'**
  String get allergy;

  /// No description provided for @chronicCondition.
  ///
  /// In es, this message translates to:
  /// **'Condición crónica'**
  String get chronicCondition;

  /// No description provided for @operation.
  ///
  /// In es, this message translates to:
  /// **'Operación'**
  String get operation;

  /// No description provided for @cancel.
  ///
  /// In es, this message translates to:
  /// **'Cancelar'**
  String get cancel;

  /// No description provided for @save.
  ///
  /// In es, this message translates to:
  /// **'Guardar'**
  String get save;

  /// No description provided for @downloadTxt.
  ///
  /// In es, this message translates to:
  /// **'Descargar TXT'**
  String get downloadTxt;

  /// No description provided for @downloadPdf.
  ///
  /// In es, this message translates to:
  /// **'Descargar PDF'**
  String get downloadPdf;

  /// No description provided for @copyText.
  ///
  /// In es, this message translates to:
  /// **'Copiar texto'**
  String get copyText;

  /// No description provided for @copiedMessage.
  ///
  /// In es, this message translates to:
  /// **'Texto copiado al portapapeles'**
  String get copiedMessage;

  /// No description provided for @loadingPatients.
  ///
  /// In es, this message translates to:
  /// **'Cargando pacientes...'**
  String get loadingPatients;

  /// No description provided for @noPatients.
  ///
  /// In es, this message translates to:
  /// **'No hay pacientes registrados'**
  String get noPatients;

  /// No description provided for @noResults.
  ///
  /// In es, this message translates to:
  /// **'No se encontraron pacientes'**
  String get noResults;

  /// No description provided for @searchPlaceholder.
  ///
  /// In es, this message translates to:
  /// **'Buscar por nombre o RUT'**
  String get searchPlaceholder;

  /// No description provided for @guestUser.
  ///
  /// In es, this message translates to:
  /// **'Usuario invitado'**
  String get guestUser;

  /// No description provided for @darkMode.
  ///
  /// In es, this message translates to:
  /// **'Modo oscuro'**
  String get darkMode;

  /// No description provided for @language.
  ///
  /// In es, this message translates to:
  /// **'Idioma'**
  String get language;

  /// No description provided for @fontSize.
  ///
  /// In es, this message translates to:
  /// **'Tamaño de fuente'**
  String get fontSize;

  /// No description provided for @saveChanges.
  ///
  /// In es, this message translates to:
  /// **'Guardar cambios'**
  String get saveChanges;

  /// No description provided for @settingsSaved.
  ///
  /// In es, this message translates to:
  /// **'Configuraciones guardadas'**
  String get settingsSaved;

  /// No description provided for @fingerprintTitle.
  ///
  /// In es, this message translates to:
  /// **'Verificación biométrica'**
  String get fingerprintTitle;

  /// No description provided for @scanFingerprint.
  ///
  /// In es, this message translates to:
  /// **'Escanear huella'**
  String get scanFingerprint;

  /// No description provided for @scanning.
  ///
  /// In es, this message translates to:
  /// **'Escaneando...'**
  String get scanning;

  /// No description provided for @validating.
  ///
  /// In es, this message translates to:
  /// **'Validando...'**
  String get validating;

  /// No description provided for @dummyTitle.
  ///
  /// In es, this message translates to:
  /// **'Ficha médica (demo)'**
  String get dummyTitle;

  /// No description provided for @patientUnavailable.
  ///
  /// In es, this message translates to:
  /// **'Paciente no disponible'**
  String get patientUnavailable;

  /// No description provided for @selectPatient.
  ///
  /// In es, this message translates to:
  /// **'Selecciona un paciente desde el listado.'**
  String get selectPatient;

  /// No description provided for @userProfileTitle.
  ///
  /// In es, this message translates to:
  /// **'Perfil del usuario'**
  String get userProfileTitle;

  /// No description provided for @admissionDate.
  ///
  /// In es, this message translates to:
  /// **'Fecha ingreso'**
  String get admissionDate;

  /// No description provided for @service.
  ///
  /// In es, this message translates to:
  /// **'Servicio'**
  String get service;

  /// No description provided for @professional.
  ///
  /// In es, this message translates to:
  /// **'Profesional'**
  String get professional;

  /// No description provided for @patients.
  ///
  /// In es, this message translates to:
  /// **'Pacientes'**
  String get patients;

  /// No description provided for @logout.
  ///
  /// In es, this message translates to:
  /// **'Cerrar sesión'**
  String get logout;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'es', 'pt'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'es':
      return AppLocalizationsEs();
    case 'pt':
      return AppLocalizationsPt();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
