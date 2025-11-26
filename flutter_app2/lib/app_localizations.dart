import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

class AppLocalizations {
  AppLocalizations(this.locale);

  final Locale locale;

  static const supportedLocales = [
    Locale('es'),
    Locale('en'),
    Locale('pt'),
  ];

  static const _localizedValues = {
    'es': {
      'appTitle': 'App Tecnologías Móviles',
      'welcomeTitle': 'Bienvenido a Doble M.A.',
      'welcomeSubtitle': 'Accede al sistema médico con tus credenciales',
      'userLabel': 'Usuario',
      'passwordLabel': 'Contraseña',
      'loginButton': 'Ingresar',
      'loginFingerprint': 'Ingresar con huella dactilar',
      'loginGuest': 'Entrar como invitado',
      'homeTitle': 'Inicio',
      'mainPanelTitle': 'Panel principal',
      'searchBasic': 'Búsqueda básica',
      'noPatientSelected': 'No hay paciente seleccionado',
      'selectPatientHint': 'Busca un paciente o utiliza el lector de huella para continuar.',
      'viewMedicalRecord': 'Ver ficha médica',
      'fingerprintCardTitle': 'Escanea la huella del paciente',
      'fingerprintCardSubtitle': 'Puedes autenticar la identidad usando el lector biométrico.',
      'patientProfileTitle': 'Perfil del paciente',
      'generalInfo': 'Información general',
      'patientId': 'ID paciente',
      'birthDate': 'Fecha de nacimiento',
      'address': 'Dirección',
      'phone': 'Teléfono',
      'email': 'Email',
      'sex': 'Sexo',
      'rut': 'RUT',
      'medicalRecordTitle': 'Ficha médica',
      'download': 'Descargar',
      'refresh': 'Actualizar',
      'edit': 'Editar',
      'noRecords': 'No hay fichas médicas registradas para este paciente.',
      'noRecordSelected': 'No hay ficha seleccionada',
      'errorLoadingRecords': 'Ocurrió un error al cargar las fichas.',
      'editMedicalRecord': 'Editar ficha médica',
      'allergy': 'Alergia',
      'chronicCondition': 'Condición crónica',
      'operation': 'Operación',
      'cancel': 'Cancelar',
      'save': 'Guardar',
      'downloadTxt': 'Descargar TXT',
      'downloadPdf': 'Descargar PDF',
      'copyText': 'Copiar texto',
      'copiedMessage': 'Texto copiado al portapapeles',
      'loadingPatients': 'Cargando pacientes...',
      'noPatients': 'No hay pacientes registrados',
      'noResults': 'No se encontraron pacientes',
      'searchPlaceholder': 'Buscar por nombre o RUT',
      'guestUser': 'Usuario invitado',
      'darkMode': 'Modo oscuro',
      'language': 'Idioma',
      'fontSize': 'Tamaño de fuente',
      'saveChanges': 'Guardar cambios',
      'settingsSaved': 'Configuraciones guardadas',
      'fingerprintTitle': 'Verificación biométrica',
      'scanFingerprint': 'Escanear huella',
      'scanning': 'Escaneando...',
      'validating': 'Validando...',
      'dummyTitle': 'Ficha médica (demo)',
      'patientUnavailable': 'Paciente no disponible',
      'selectPatient': 'Selecciona un paciente desde el listado.',
      'userProfileTitle': 'Perfil del usuario',
      'admissionDate': 'Fecha ingreso',
      'service': 'Servicio',
      'professional': 'Profesional',
    },
    'en': {
      'appTitle': 'Mobile Technologies App',
      'welcomeTitle': 'Welcome to Doble M.A.',
      'welcomeSubtitle': 'Access the medical system securely',
      'userLabel': 'User',
      'passwordLabel': 'Password',
      'loginButton': 'Sign in',
      'loginFingerprint': 'Sign in with fingerprint',
      'loginGuest': 'Enter as guest',
      'homeTitle': 'Home',
      'mainPanelTitle': 'Main panel',
      'searchBasic': 'Basic search',
      'noPatientSelected': 'No patient selected',
      'selectPatientHint': 'Search for a patient or use the fingerprint scanner to continue.',
      'viewMedicalRecord': 'View medical record',
      'fingerprintCardTitle': 'Scan the patient\'s fingerprint',
      'fingerprintCardSubtitle': 'Authenticate identity using the biometric reader.',
      'patientProfileTitle': 'Patient profile',
      'generalInfo': 'General information',
      'patientId': 'Patient ID',
      'birthDate': 'Birth date',
      'address': 'Address',
      'phone': 'Phone',
      'email': 'Email',
      'sex': 'Sex',
      'rut': 'ID',
      'medicalRecordTitle': 'Medical record',
      'download': 'Download',
      'refresh': 'Refresh',
      'edit': 'Edit',
      'noRecords': 'No medical records found for this patient.',
      'noRecordSelected': 'No record selected',
      'errorLoadingRecords': 'An error occurred while loading records.',
      'editMedicalRecord': 'Edit medical record',
      'allergy': 'Allergy',
      'chronicCondition': 'Chronic condition',
      'operation': 'Operation',
      'cancel': 'Cancel',
      'save': 'Save',
      'downloadTxt': 'Download TXT',
      'downloadPdf': 'Download PDF',
      'copyText': 'Copy text',
      'copiedMessage': 'Text copied to clipboard',
      'loadingPatients': 'Loading patients...',
      'noPatients': 'No patients registered',
      'noResults': 'No patients found',
      'searchPlaceholder': 'Search by name or ID',
      'guestUser': 'Guest user',
      'darkMode': 'Dark mode',
      'language': 'Language',
      'fontSize': 'Font size',
      'saveChanges': 'Save changes',
      'settingsSaved': 'Settings saved',
      'fingerprintTitle': 'Biometric verification',
      'scanFingerprint': 'Scan fingerprint',
      'scanning': 'Scanning...',
      'validating': 'Validating...',
      'dummyTitle': 'Medical record (demo)',
      'patientUnavailable': 'Patient not available',
      'selectPatient': 'Select a patient from the list.',
      'userProfileTitle': 'User profile',
      'admissionDate': 'Admission date',
      'service': 'Service',
      'professional': 'Professional',
    },
    'pt': {
      'appTitle': 'App Tecnologias Móveis',
      'welcomeTitle': 'Bem-vindo ao Doble M.A.',
      'welcomeSubtitle': 'Acesse o sistema médico com segurança',
      'userLabel': 'Usuário',
      'passwordLabel': 'Senha',
      'loginButton': 'Entrar',
      'loginFingerprint': 'Entrar com impressão digital',
      'loginGuest': 'Entrar como convidado',
      'homeTitle': 'Início',
      'mainPanelTitle': 'Painel principal',
      'searchBasic': 'Busca básica',
      'noPatientSelected': 'Nenhum paciente selecionado',
      'selectPatientHint': 'Busque um paciente ou use o leitor de impressão para continuar.',
      'viewMedicalRecord': 'Ver prontuário',
      'fingerprintCardTitle': 'Escaneie a impressão do paciente',
      'fingerprintCardSubtitle': 'Você pode autenticar a identidade usando o leitor biométrico.',
      'patientProfileTitle': 'Perfil do paciente',
      'generalInfo': 'Informações gerais',
      'patientId': 'ID do paciente',
      'birthDate': 'Data de nascimento',
      'address': 'Endereço',
      'phone': 'Telefone',
      'email': 'Email',
      'sex': 'Sexo',
      'rut': 'Documento',
      'medicalRecordTitle': 'Prontuário',
      'download': 'Baixar',
      'refresh': 'Atualizar',
      'edit': 'Editar',
      'noRecords': 'Nenhum prontuário para este paciente.',
      'noRecordSelected': 'Nenhum prontuário selecionado',
      'errorLoadingRecords': 'Erro ao carregar os prontuários.',
      'editMedicalRecord': 'Editar prontuário',
      'allergy': 'Alergia',
      'chronicCondition': 'Condição crônica',
      'operation': 'Operação',
      'cancel': 'Cancelar',
      'save': 'Salvar',
      'downloadTxt': 'Baixar TXT',
      'downloadPdf': 'Baixar PDF',
      'copyText': 'Copiar texto',
      'copiedMessage': 'Texto copiado para a área de transferência',
      'loadingPatients': 'Carregando pacientes...',
      'noPatients': 'Nenhum paciente registrado',
      'noResults': 'Nenhum paciente encontrado',
      'searchPlaceholder': 'Buscar por nome ou documento',
      'guestUser': 'Usuário convidado',
      'darkMode': 'Modo escuro',
      'language': 'Idioma',
      'fontSize': 'Tamanho da fonte',
      'saveChanges': 'Salvar alterações',
      'settingsSaved': 'Configurações salvas',
      'fingerprintTitle': 'Verificação biométrica',
      'scanFingerprint': 'Escanear impressão',
      'scanning': 'Escaneando...',
      'validating': 'Validando...',
      'dummyTitle': 'Prontuário (demo)',
      'patientUnavailable': 'Paciente indisponível',
      'selectPatient': 'Selecione um paciente da lista.',
      'userProfileTitle': 'Perfil do usuário',
      'admissionDate': 'Data de internação',
      'service': 'Serviço',
      'professional': 'Profissional',
    }
  };

  String _translate(String key) {
    final lang = locale.languageCode;
    return _localizedValues[lang]?[key] ??
        _localizedValues['es']![key] ??
        key;
  }

  // Getters
  String get appTitle => _translate('appTitle');
  String get welcomeTitle => _translate('welcomeTitle');
  String get welcomeSubtitle => _translate('welcomeSubtitle');
  String get userLabel => _translate('userLabel');
  String get passwordLabel => _translate('passwordLabel');
  String get loginButton => _translate('loginButton');
  String get loginFingerprint => _translate('loginFingerprint');
  String get loginGuest => _translate('loginGuest');
  String get homeTitle => _translate('homeTitle');
  String get mainPanelTitle => _translate('mainPanelTitle');
  String get searchBasic => _translate('searchBasic');
  String get noPatientSelected => _translate('noPatientSelected');
  String get selectPatientHint => _translate('selectPatientHint');
  String get viewMedicalRecord => _translate('viewMedicalRecord');
  String get fingerprintCardTitle => _translate('fingerprintCardTitle');
  String get fingerprintCardSubtitle => _translate('fingerprintCardSubtitle');
  String get patientProfileTitle => _translate('patientProfileTitle');
  String get generalInfo => _translate('generalInfo');
  String get patientId => _translate('patientId');
  String get birthDate => _translate('birthDate');
  String get address => _translate('address');
  String get phone => _translate('phone');
  String get email => _translate('email');
  String get sex => _translate('sex');
  String get rut => _translate('rut');
  String get medicalRecordTitle => _translate('medicalRecordTitle');
  String get download => _translate('download');
  String get refresh => _translate('refresh');
  String get edit => _translate('edit');
  String get noRecords => _translate('noRecords');
  String get noRecordSelected => _translate('noRecordSelected');
  String get errorLoadingRecords => _translate('errorLoadingRecords');
  String get editMedicalRecord => _translate('editMedicalRecord');
  String get allergy => _translate('allergy');
  String get chronicCondition => _translate('chronicCondition');
  String get operation => _translate('operation');
  String get cancel => _translate('cancel');
  String get save => _translate('save');
  String get downloadTxt => _translate('downloadTxt');
  String get downloadPdf => _translate('downloadPdf');
  String get copyText => _translate('copyText');
  String get copiedMessage => _translate('copiedMessage');
  String get loadingPatients => _translate('loadingPatients');
  String get noPatients => _translate('noPatients');
  String get noResults => _translate('noResults');
  String get searchPlaceholder => _translate('searchPlaceholder');
  String get guestUser => _translate('guestUser');
  String get darkMode => _translate('darkMode');
  String get language => _translate('language');
  String get fontSize => _translate('fontSize');
  String get saveChanges => _translate('saveChanges');
  String get settingsSaved => _translate('settingsSaved');
  String get fingerprintTitle => _translate('fingerprintTitle');
  String get scanFingerprint => _translate('scanFingerprint');
  String get scanning => _translate('scanning');
  String get validating => _translate('validating');
  String get dummyTitle => _translate('dummyTitle');
  String get patientUnavailable => _translate('patientUnavailable');
  String get selectPatient => _translate('selectPatient');
  String get userProfileTitle => _translate('userProfileTitle');
  String get admissionDate => _translate('admissionDate');
  String get service => _translate('service');
  String get professional => _translate('professional');
  String get patients => _translate('patients');
  String get logout => _translate('logout');

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static List<LocalizationsDelegate<dynamic>> get localizationsDelegates => const [
        delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ];

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) =>
      AppLocalizations.supportedLocales.any((l) => l.languageCode == locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(covariant LocalizationsDelegate<AppLocalizations> old) =>
      false;
}
