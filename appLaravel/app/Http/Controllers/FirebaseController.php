<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Kreait\Firebase\Factory;

class FirebaseController extends Controller
{
    protected $database;
    
    public function __construct()
    {
        \Log::info('=== FirebaseController constructor called ===');
        
        try {
            // Debug information
            $credentialsPath = base_path(env('FIREBASE_CREDENTIALS'));
            $databaseUrl = env('FIREBASE_DATABASE_URL');
            $firebaseProject = env('FIREBASE_PROJECT');
            
            \Log::info('Firebase configuration loaded', [
                'credentials_path' => $credentialsPath,
                'database_url' => $databaseUrl,
                'firebase_project' => $firebaseProject
            ]);
            
            // Detailed validation
            if (!file_exists($credentialsPath)) {
                \Log::error('Firebase credentials file not found', ['path' => $credentialsPath]);
                throw new \Exception("Firebase credentials file not found at: {$credentialsPath}");
            }
            \Log::info('Credentials file exists');
            
            if (!$databaseUrl) {
                \Log::error('FIREBASE_DATABASE_URL not configured');
                throw new \Exception('FIREBASE_DATABASE_URL not configured in .env file');
            }
            \Log::info('Database URL is configured');
            
            if (!$firebaseProject) {
                \Log::error('FIREBASE_PROJECT not configured');
                throw new \Exception('FIREBASE_PROJECT not configured in .env file');
            }
            \Log::info('Firebase project is configured');

            // Validate credentials file content
            $credentialsContent = file_get_contents($credentialsPath);
            $credentials = json_decode($credentialsContent, true);
            
            \Log::info('Credentials file read', [
                'is_valid_json' => $credentials !== null,
                'has_project_id' => isset($credentials['project_id'])
            ]);
            
            if (!$credentials || !isset($credentials['project_id'])) {
                \Log::error('Invalid Firebase credentials file format');
                throw new \Exception('Invalid Firebase credentials file format');
            }

            // Configure SSL certificate for Windows
            $cacertPath = base_path('cacert.pem');
            
            \Log::info('Checking for SSL certificate', [
                'cacert_path' => $cacertPath,
                'cacert_exists' => file_exists($cacertPath)
            ]);
            
            // Set SSL certificate path for cURL
            if (file_exists($cacertPath)) {
                putenv('CURLOPT_CAINFO=' . $cacertPath);
                ini_set('curl.cainfo', $cacertPath);
                ini_set('openssl.cafile', $cacertPath);
                \Log::info('SSL certificate configured');
            } else {
                // Fallback: disable SSL verification if certificate file not found
                putenv('GUZZLE_CURL_OPTIONS=' . json_encode([
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_SSL_VERIFYHOST => false,
                ]));
                \Log::warning('SSL certificate not found, disabled SSL verification');
            }

            \Log::info('Initializing Firebase Factory');
            
            // Initialize Firebase with service account and database URL
            $firebase = (new Factory)
                ->withServiceAccount($credentialsPath)
                ->withDatabaseUri($databaseUrl);
            
            \Log::info('Firebase Factory created, creating database instance');
            
            $this->database = $firebase->createDatabase();
            
            \Log::info('Firebase database initialized successfully', [
                'database_class' => get_class($this->database)
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Firebase initialization failed', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // Store detailed error information
            $this->database = null;
            $errorDetails = [
                'message' => $e->getMessage(),
                'credentials_path' => $credentialsPath ?? 'undefined',
                'credentials_exists' => isset($credentialsPath) ? file_exists($credentialsPath) : false,
                'database_url' => $databaseUrl ?? 'undefined',
                'firebase_project' => $firebaseProject ?? 'undefined'
            ];
            session()->flash('firebase_error', json_encode($errorDetails));
        }
    }

    public function getFichasMedicas()
    {
        \Log::info('=== getFichasMedicas method called ===');
        
        try {
            // Check if Firebase was properly initialized
            \Log::info('Checking if Firebase database is initialized', [
                'database_is_null' => $this->database === null
            ]);
            
            if ($this->database === null) {
                \Log::error('Firebase database is NULL - not initialized');
                
                $firebaseError = session('firebase_error', 'Firebase not properly configured');
                \Log::error('Firebase error from session', ['error' => $firebaseError]);
                
                // Try to decode JSON error details
                $errorDetails = json_decode($firebaseError, true);
                if ($errorDetails && is_array($errorDetails)) {
                    $error = "Firebase Configuration Error: " . $errorDetails['message'] . "\n\n";
                    $error .= "Debug Information:\n";
                    $error .= "- Credentials Path: " . $errorDetails['credentials_path'] . "\n";
                    $error .= "- Credentials File Exists: " . ($errorDetails['credentials_exists'] ? 'YES' : 'NO') . "\n";
                    $error .= "- Database URL: " . $errorDetails['database_url'] . "\n";
                    $error .= "- Firebase Project: " . $errorDetails['firebase_project'] . "\n";
                } else {
                    $error = $firebaseError;
                }
                
                return view('contact', ['fichasArray' => [], 'error' => $error]);
            }

            \Log::info('Firebase database is initialized, attempting to get reference to fichamedica');
            
            // Get all records from the 'fichamedica' table
            $reference = $this->database->getReference('fichamedica');
            \Log::info('Got reference to fichamedica', [
                'reference_class' => get_class($reference)
            ]);
            
            \Log::info('Getting snapshot from reference');
            $snapshot = $reference->getSnapshot();
            \Log::info('Got snapshot', [
                'snapshot_class' => get_class($snapshot),
                'snapshot_exists' => $snapshot->exists()
            ]);
            
            $fichasMedicas = $snapshot->getValue();
            \Log::info('Got value from snapshot', [
                'value_type' => gettype($fichasMedicas),
                'is_null' => $fichasMedicas === null,
                'is_array' => is_array($fichasMedicas),
                'count' => is_array($fichasMedicas) ? count($fichasMedicas) : 'N/A'
            ]);
            
            // Convert to array format for easier handling in view
            $fichasArray = [];
            if ($fichasMedicas) {
                \Log::info('Processing fichas medicas', ['count' => count($fichasMedicas)]);
                foreach ($fichasMedicas as $key => $ficha) {
                    \Log::info('Processing ficha', ['key' => $key, 'ficha' => $ficha]);
                    $fichasArray[] = array_merge(['id' => $key], $ficha);
                }
                \Log::info('Finished processing fichas', ['result_count' => count($fichasArray)]);
            } else {
                \Log::warning('No fichas medicas found in Firebase - data is empty or null');
            }
            
            \Log::info('Returning view with fichasArray', ['count' => count($fichasArray)]);
            return view('contact', compact('fichasArray'));
            
        } catch (\Exception $e) {
            // Handle errors gracefully
            \Log::error('Exception in getFichasMedicas', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $error = 'Runtime Error: ' . $e->getMessage();
            $error .= "\n\nThis error occurred while trying to fetch data from Firebase.";
            $error .= "\nPlease check your Firebase console and ensure the Realtime Database is enabled.";
            $fichasArray = [];
            
            return view('contact', compact('fichasArray', 'error'));
        }
    }

    public function createFichaMedica(Request $request)
    {
        try {
            // Check if Firebase was properly initialized
            if ($this->database === null) {
                return redirect()->back()->with('error', 'Firebase not configured. Please check your credentials file and database URL.');
            }

            $data = [
                'nombre' => $request->input('nombre'),
                'edad' => $request->input('edad'),
                'diagnostico' => $request->input('diagnostico'),
                'fecha_ingreso' => $request->input('fecha_ingreso'),
                'created_at' => now()->toDateTimeString()
            ];

            $reference = $this->database->getReference('fichamedica');
            $newKey = $reference->push($data);
            
            return redirect()->back()->with('success', 'Ficha médica creada exitosamente');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al crear ficha médica: ' . $e->getMessage());
        }
    }
}
