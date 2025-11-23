<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\FModels\FichaMedica;

use App\FModels\Operacion;
use App\FModels\Paciente;
use App\FModels\Alergia;
use App\FModels\Cronico;

class FirebaseController extends Controller
{

    public function getDashboard()
    {
        set_time_limit(20);
        
        try {
            \Log::info('Fetching dashboard data');
            
            // Fetch all collections
            
            //WARNING: THIS IS WHERE THE LIMIT IS CHANGED
            //WARNING: THIS IS WHERE THE LIMIT IS CHANGED
            //WARNING: THIS IS WHERE THE LIMIT IS CHANGED
            //WARNING: THIS IS WHERE THE LIMIT IS CHANGED
            $call_limit = 100;

            $fichasMedicas = FichaMedica::limit($call_limit)->get();
            $pacientes = Paciente::limit($call_limit)->get();
            $operaciones = Operacion::all();
            $cronicos = Cronico::all();
            $alergias = Alergia::all();
            
            // Statistics
            $totalPacientes = is_countable($pacientes) ? count($pacientes) : 0;
            $totalFichas = is_countable($fichasMedicas) ? count($fichasMedicas) : 0;
            
            // Count fichas from current year
            $currentYear = date('Y');
            $fichasThisYear = 0;
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $fechaIngreso = is_object($ficha) ? ($ficha->fechaingreso ?? '') : ($ficha['fechaingreso'] ?? '');
                    if (strpos($fechaIngreso, $currentYear) === 0) {
                        $fichasThisYear++;
                    }
                }
            }
            
            // Find most common chronic condition
            $cronicoCount = [];
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $idCronico = is_object($ficha) ? ($ficha->idcronico ?? null) : ($ficha['idcronico'] ?? null);
                    if ($idCronico) {
                        $cronicoCount[$idCronico] = ($cronicoCount[$idCronico] ?? 0) + 1;
                    }
                }
            }
            
            $mostCommonCronicoId = null;
            $mostCommonCronicoName = 'N/A';
            if (!empty($cronicoCount)) {
                arsort($cronicoCount);
                $mostCommonCronicoId = array_key_first($cronicoCount);
                
                // Find the name
                if (is_array($cronicos) || is_object($cronicos)) {
                    foreach ($cronicos as $cronico) {
                        try {
                            $reflection = new \ReflectionClass($cronico);
                            $dataProperty = $reflection->getProperty('data');
                            $dataProperty->setAccessible(true);
                            $data = $dataProperty->getValue($cronico);
                            if (($data['idcronico'] ?? null) == $mostCommonCronicoId) {
                                $mostCommonCronicoName = $data['enfermedadcronica'] ?? 'N/A';
                                break;
                            }
                        } catch (\Exception $e) {}
                    }
                }
            }
            
            // Count fichas by alergia - using descriptive names directly since fichas store full names
            $alergiaStats = [];
            
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $alergiaName = is_object($ficha) ? ($ficha->idalergia ?? null) : ($ficha['idalergia'] ?? null);
                    if ($alergiaName && !empty(trim($alergiaName))) {
                        $alergiaStats[$alergiaName] = ($alergiaStats[$alergiaName] ?? 0) + 1;
                    }
                }
            }
            
            // Since fichas store descriptive names directly, use them as chart data
            $alergiaChartData = $alergiaStats;
            
            // Sort by count descending and take top 8
            arsort($alergiaChartData);
            $alergiaChartData = array_slice($alergiaChartData, 0, 8, true);
            
            // Count fichas by cronico - using descriptive names directly
            $cronicoStats = [];
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $cronicoName = is_object($ficha) ? ($ficha->idcronico ?? null) : ($ficha['idcronico'] ?? null);
                    if ($cronicoName && !empty(trim($cronicoName))) {
                        $cronicoStats[$cronicoName] = ($cronicoStats[$cronicoName] ?? 0) + 1;
                    }
                }
            }
            
            // Since fichas store descriptive names directly, use them as chart data
            $cronicoChartData = $cronicoStats;
            
            // Sort by count descending and take top 8
            arsort($cronicoChartData);
            $cronicoChartData = array_slice($cronicoChartData, 0, 8, true);
            
            // Count fichas by operacion - using descriptive names directly
            $operacionStats = [];
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $operacionName = is_object($ficha) ? ($ficha->idoperacion ?? null) : ($ficha['idoperacion'] ?? null);
                    if ($operacionName && !empty(trim($operacionName))) {
                        $operacionStats[$operacionName] = ($operacionStats[$operacionName] ?? 0) + 1;
                    }
                }
            }
            
            // Since fichas store descriptive names directly, use them as chart data
            $operacionChartData = $operacionStats;
            
            // Sort by count descending and take top 8
            arsort($operacionChartData);
            $operacionChartData = array_slice($operacionChartData, 0, 8, true);
            
            // Count fichas by year for line chart
            $yearStats = [];
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $fechaIngreso = is_object($ficha) ? ($ficha->fechaingreso ?? '') : ($ficha['fechaingreso'] ?? '');
                    if (!empty($fechaIngreso)) {
                        // Extract year from date (format: YYYY-MM-DD)
                        $year = substr($fechaIngreso, 0, 4);
                        if (is_numeric($year)) {
                            $yearStats[$year] = ($yearStats[$year] ?? 0) + 1;
                        }
                    }
                }
            }
            
            // Sort years in ascending order
            ksort($yearStats);
            $yearChartData = $yearStats;
            
            \Log::info('Dashboard data prepared', [
                'total_pacientes' => $totalPacientes,
                'total_fichas' => $totalFichas,
                'fichas_this_year' => $fichasThisYear,
                'alergia_chart_items' => count($alergiaChartData),
                'cronico_chart_items' => count($cronicoChartData),
                'operacion_chart_items' => count($operacionChartData),
                'year_chart_items' => count($yearChartData)
            ]);
            
            return view('dashboard', [
                'totalPacientes' => $totalPacientes,
                'fichasThisYear' => $fichasThisYear,
                'mostCommonCronico' => $mostCommonCronicoName,
                'totalFichas' => $totalFichas,
                'alergiaChartData' => $alergiaChartData,
                'cronicoChartData' => $cronicoChartData,
                'operacionChartData' => $operacionChartData,
                'yearChartData' => $yearChartData
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Exception in getDashboard', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            // Return view with default values
            return view('dashboard', [
                'totalPacientes' => 0,
                'fichasThisYear' => 0,
                'mostCommonCronico' => 'N/A',
                'totalFichas' => 0,
                'alergiaChartData' => [],
                'cronicoChartData' => [],
                'operacionChartData' => [],
                'yearChartData' => [],
                'error' => $e->getMessage()
            ]);
        }
    }

    public function getFichasMedicas()
    {
        // Increase execution time for this method due to multiple Firestore queries
        set_time_limit(120); // 2 minutes
        
        try {
            \Log::info('Attempting to fetch all fichas medicas using FichaMedica model');
            
            // Get all records using the Roddy Firestore Eloquent model
            $fichasMedicas = FichaMedica::all();
            
            \Log::info('Fichas medicas fetched', [
                'count' => $fichasMedicas->count(),
                'data_type' => gettype($fichasMedicas)
            ]);
            
            // Fetch all related data in advance to improve performance
            // Only fetch operacion, cronico, alergia (small collections)
            // Skip patient data to improve performance
            $operacionesRaw = Operacion::all();
            $cronicosRaw = Cronico::all();
            $alergiasRaw = Alergia::all();
            $pacientesRaw = Paciente::all();
            
            // Create lookup arrays for operacion, cronico, alergia (using numeric IDs)
            $operaciones = [];
            $cronicos = [];
            $alergias = [];
            
            // Also create option arrays for dropdowns
            $operacionOptions = [];
            $cronicoOptions = [];
            $alergiaOptions = [];
            $pacienteOptions = [];
            
            foreach ($operacionesRaw as $op) {
                // Try accessing via reflection to get the data property
                try {
                    $reflection = new \ReflectionClass($op);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $data = $dataProperty->getValue($op);
                    $docId = $data['idoperacion'] ?? null;
                    if ($docId) {
                        $operaciones[$docId] = $op;
                        $operacionOptions[$docId] = $data['operacion'] ?? 'Sin nombre';
                    }
                } catch (\Exception $e) {
                    \Log::warning('Failed to process operacion', ['error' => $e->getMessage()]);
                }
            }
            
            foreach ($cronicosRaw as $cr) {
                try {
                    $reflection = new \ReflectionClass($cr);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $data = $dataProperty->getValue($cr);
                    $docId = $data['idcronico'] ?? null;
                    if ($docId) {
                        $cronicos[$docId] = $cr;
                        $cronicoOptions[$docId] = $data['enfermedadcronica'] ?? 'Sin nombre';
                    }
                } catch (\Exception $e) {
                    \Log::warning('Failed to process cronico', ['error' => $e->getMessage()]);
                }
            }
            
            foreach ($alergiasRaw as $al) {
                try {
                    $reflection = new \ReflectionClass($al);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $data = $dataProperty->getValue($al);
                    $docId = $data['idalergia'] ?? null;
                    if ($docId) {
                        $alergias[$docId] = $al;
                        $alergiaOptions[$docId] = $data['nombrealergia'] ?? 'Sin nombre';
                    }
                } catch (\Exception $e) {
                    \Log::warning('Failed to process alergia', ['error' => $e->getMessage()]);
                }
            }
            
            foreach ($pacientesRaw as $pac) {
                try {
                    $reflection = new \ReflectionClass($pac);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $data = $dataProperty->getValue($pac);
                    $idPaciente = $data['idpaciente'] ?? null;
                    $nombrePaciente = $data['nomberPaciente'] ?? 'Sin nombre';
                    if ($idPaciente) {
                        $pacienteOptions[$idPaciente] = $nombrePaciente;
                    }
                } catch (\Exception $e) {
                    \Log::warning('Failed to process paciente', ['error' => $e->getMessage()]);
                }
            }
            
            \Log::info('Related collections loaded', [
                'operaciones' => count($operaciones),
                'cronicos' => count($cronicos),
                'alergias' => count($alergias),
                'operacion_options' => count($operacionOptions),
                'cronico_options' => count($cronicoOptions),
                'alergia_options' => count($alergiaOptions),
                'paciente_options' => count($pacienteOptions)
            ]);
            
            // Convert to array format for easier handling in view
            $fichasArray = [];
            
            if ($fichasMedicas->count() > 0) {
                \Log::info('Processing fichas medicas', ['count' => $fichasMedicas->count()]);
                
                foreach ($fichasMedicas as $ficha) {
                    // For operacion, cronico, alergia - use the array lookup
                    $operacion = isset($operaciones[$ficha->idoperacion]) ? $operaciones[$ficha->idoperacion] : null;
                    $cronico = isset($cronicos[$ficha->idcronico]) ? $cronicos[$ficha->idcronico] : null;
                    $alergia = isset($alergias[$ficha->idalergia]) ? $alergias[$ficha->idalergia] : null;
                    
                    // Extract data using reflection for consistency
                    $operacionData = null;
                    $cronicoData = null;
                    $alergiaData = null;
                    
                    if ($operacion) {
                        try {
                            $reflection = new \ReflectionClass($operacion);
                            $dataProperty = $reflection->getProperty('data');
                            $dataProperty->setAccessible(true);
                            $operacionData = $dataProperty->getValue($operacion);
                        } catch (\Exception $e) {}
                    }
                    
                    if ($cronico) {
                        try {
                            $reflection = new \ReflectionClass($cronico);
                            $dataProperty = $reflection->getProperty('data');
                            $dataProperty->setAccessible(true);
                            $cronicoData = $dataProperty->getValue($cronico);
                        } catch (\Exception $e) {}
                    }
                    
                    if ($alergia) {
                        try {
                            $reflection = new \ReflectionClass($alergia);
                            $dataProperty = $reflection->getProperty('data');
                            $dataProperty->setAccessible(true);
                            $alergiaData = $dataProperty->getValue($alergia);
                        } catch (\Exception $e) {}
                    }
                    
                    $fichasArray[] = [
                        'id' => $ficha->idfichamedica ?? null,
                        'idfichamedica' => $ficha->idfichamedica ?? '',
                        'fechaingreso' => $ficha->fechaingreso ?? '',
                        
                        // IDs (for reference)
                        'idpaciente' => $ficha->idpaciente ?? '',
                        'idoperacion' => $ficha->idoperacion ?? '',
                        'idcronico' => $ficha->idcronico ?? '',
                        'idalergia' => $ficha->idalergia ?? '',
                        
                        // Names from related collections (no patient data for performance)
                        'paciente_nombre' => 'N/A',
                        'paciente_rut' => 'N/A',
                        'operacion_nombre' => $operacionData ? ($operacionData['operacion'] ?? 'N/A') : 'N/A',
                        'cronico_nombre' => $cronicoData ? ($cronicoData['enfermedadcronica'] ?? 'N/A') : 'N/A',
                        'alergia_nombre' => $alergiaData ? ($alergiaData['nombrealergia'] ?? 'N/A') : 'N/A',
                        'alergia_descripcion' => $alergiaData ? ($alergiaData['descripcionAlergia'] ?? 'N/A') : 'N/A'
                    ];
                }
                
                \Log::info('Finished processing fichas', ['result_count' => count($fichasArray)]);
            } else {
                \Log::warning('No fichas medicas found in Firestore collection');
            }
            
            \Log::info('Returning view with fichasArray', ['count' => count($fichasArray)]);
            return view('contact', compact('fichasArray', 'operacionOptions', 'cronicoOptions', 'alergiaOptions', 'pacienteOptions'));
            
        } catch (\Exception $e) {
            // Handle errors gracefully
            \Log::error('Exception in getFichasMedicas', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            $error = 'Runtime Error: ' . $e->getMessage();
            $error .= "\n\n\nThis error occurred while trying to fetch data from Firestore.";
            $error .= "\nPlease check your Firebase console and ensure Firestore is enabled.";
            $error .= "\nAlso verify that your service account credentials have the correct permissions.";
            $fichasArray = [];
            
            return view('contact', compact('fichasArray', 'error'), [
                'operacionOptions' => [],
                'cronicoOptions' => [],
                'alergiaOptions' => [],
                'pacienteOptions' => []
            ]);
        }
    }

    public function searchFichaMedica(Request $request)
    {
        \Log::info('=== searchFichaMedica method called ===', [
            'search_id' => $request->input('search_id')
        ]);
        
        try {
            $searchId = $request->input('search_id');
            
            if (empty($searchId)) {
                return redirect()->route('contact')->with('error', 'Por favor ingrese un ID de ficha médica para buscar');
            }
            
            // Search for the ficha by idfichamedica field
            // Roddy where() expects: ['field', 'operator', 'value'] or [['field', 'operator', 'value'], ...]
            \Log::info('Searching for ficha with idfichamedica', ['id' => $searchId, 'type' => gettype($searchId)]);
            
            // Try both string and integer versions since Firestore might store as either
            $fichaResult = FichaMedica::where(['idfichamedica', '=', $searchId])->get();
            
            // If not found as string, try as integer
            if (empty($fichaResult) || (is_array($fichaResult) && count($fichaResult) === 0)) {
                \Log::info('Not found as string, trying as integer');
                $fichaResult = FichaMedica::where(['idfichamedica', '=', (int)$searchId])->get();
            }
            
            // Roddy returns an array, not a collection
            if (empty($fichaResult) || (is_array($fichaResult) && count($fichaResult) === 0)) {
                \Log::info('No ficha found with the given ID');
                return redirect()->route('contact')->with('error', 'No se encontró ninguna ficha médica con el ID: ' . $searchId);
            }
            
            $ficha = is_array($fichaResult) ? (object)$fichaResult[0] : $fichaResult->first();
            \Log::info('Ficha found', ['ficha_keys' => is_object($ficha) ? array_keys((array)$ficha) : 'not_object']);
            \Log::info('Ficha found', ['ficha_data' => $ficha]);
            
            // Fetch related data for this single ficha
            $operacion = null;
            $cronico = null;
            $alergia = null;
            $paciente = null;
            
            // Fetch operacion
            if ($ficha->idoperacion) {
                $operacionResult = Operacion::where(['idoperacion', '=', $ficha->idoperacion])->get();
                if (empty($operacionResult) && is_numeric($ficha->idoperacion)) {
                    $operacionResult = Operacion::where(['idoperacion', '=', (int)$ficha->idoperacion])->get();
                }
                if (!empty($operacionResult) && is_array($operacionResult) && count($operacionResult) > 0) {
                    $operacion = is_array($operacionResult[0]) ? (object)$operacionResult[0] : $operacionResult[0];
                }
            }
            
            // Fetch cronico
            if ($ficha->idcronico) {
                $cronicoResult = Cronico::where(['idcronico', '=', $ficha->idcronico])->get();
                if (empty($cronicoResult) && is_numeric($ficha->idcronico)) {
                    $cronicoResult = Cronico::where(['idcronico', '=', (int)$ficha->idcronico])->get();
                }
                if (!empty($cronicoResult) && is_array($cronicoResult) && count($cronicoResult) > 0) {
                    $cronico = is_array($cronicoResult[0]) ? (object)$cronicoResult[0] : $cronicoResult[0];
                }
            }
            
            // Fetch alergia
            if ($ficha->idalergia) {
                $alergiaResult = Alergia::where(['idalergia', '=', $ficha->idalergia])->get();
                if (empty($alergiaResult) && is_numeric($ficha->idalergia)) {
                    $alergiaResult = Alergia::where(['idalergia', '=', (int)$ficha->idalergia])->get();
                }
                if (!empty($alergiaResult) && is_array($alergiaResult) && count($alergiaResult) > 0) {
                    $alergia = is_array($alergiaResult[0]) ? (object)$alergiaResult[0] : $alergiaResult[0];
                }
            }
            
            // Fetch paciente by document ID
            if ($ficha->idpaciente) {
                try {
                    $paciente = Paciente::find($ficha->idpaciente);
                } catch (\Exception $e) {
                    \Log::warning('Failed to fetch paciente', ['error' => $e->getMessage()]);
                }
            }
            
            // Extract data using reflection for consistency
            $operacionData = null;
            $cronicoData = null;
            $alergiaData = null;
            $pacienteData = null;
            
            if ($operacion) {
                try {
                    $reflection = new \ReflectionClass($operacion);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $operacionData = $dataProperty->getValue($operacion);
                } catch (\Exception $e) {
                    \Log::warning('Failed to extract operacion data', ['error' => $e->getMessage()]);
                }
            }
            
            if ($cronico) {
                try {
                    $reflection = new \ReflectionClass($cronico);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $cronicoData = $dataProperty->getValue($cronico);
                } catch (\Exception $e) {
                    \Log::warning('Failed to extract cronico data', ['error' => $e->getMessage()]);
                }
            }
            
            if ($alergia) {
                try {
                    $reflection = new \ReflectionClass($alergia);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $alergiaData = $dataProperty->getValue($alergia);
                } catch (\Exception $e) {
                    \Log::warning('Failed to extract alergia data', ['error' => $e->getMessage()]);
                }
            }
            
            if ($paciente) {
                try {
                    $reflection = new \ReflectionClass($paciente);
                    $dataProperty = $reflection->getProperty('data');
                    $dataProperty->setAccessible(true);
                    $pacienteData = $dataProperty->getValue($paciente);
                } catch (\Exception $e) {
                    \Log::warning('Failed to extract paciente data', ['error' => $e->getMessage()]);
                }
            }
            
            // Build the result array
            $fichasArray = [[
                'id' => $ficha->idfichamedica ?? null,
                'idfichamedica' => $ficha->idfichamedica ?? '',
                'fechaingreso' => $ficha->fechaingreso ?? '',
                
                // IDs (for reference)
                'idpaciente' => $ficha->idpaciente ?? '',
                'idoperacion' => $ficha->idoperacion ?? '',
                'idcronico' => $ficha->idcronico ?? '',
                'idalergia' => $ficha->idalergia ?? '',
                
                // Names from related collections
                'paciente_nombre' => $pacienteData ? ($pacienteData['nomberPaciente'] ?? 'N/A') : 'N/A',
                'paciente_rut' => $pacienteData ? ($pacienteData['rut'] ?? 'N/A') : 'N/A',
                'operacion_nombre' => $operacionData ? ($operacionData['operacion'] ?? 'N/A') : 'N/A',
                'cronico_nombre' => $cronicoData ? ($cronicoData['enfermedadcronica'] ?? 'N/A') : 'N/A',
                'alergia_nombre' => $alergiaData ? ($alergiaData['nombrealergia'] ?? 'N/A') : 'N/A',
                'alergia_descripcion' => $alergiaData ? ($alergiaData['descripcionAlergia'] ?? 'N/A') : 'N/A'
            ]];
            
            \Log::info('Search completed successfully', ['found' => 1]);
            return view('contact', compact('fichasArray'))->with('success', 'Ficha médica encontrada: ID ' . $searchId);
            
        } catch (\Exception $e) {
            \Log::error('Exception in searchFichaMedica', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('contact')->with('error', 'Error al buscar ficha médica: ' . $e->getMessage());
        }
    }

    public function createFichaMedica(Request $request)
    {
        \Log::info('=== createFichaMedica method called (using Roddy Firestore) ===', [
            'data' => $request->all()
        ]);
        
        try {
            // Validate the request (removed idfichamedica as it will be auto-generated)
            $validated = $request->validate([
                'fechaingreso' => 'required|date',
                'idpaciente' => 'required|string|max:255',
                'idoperacion' => 'nullable|string|max:255',
                'idcronico' => 'nullable|string|max:255',
                'idalergia' => 'nullable|string|max:255'
            ]);
            
            \Log::info('Request validated successfully', ['validated_data' => $validated]);
            
            // Generate a random unique ID for the ficha medica
            $randomId = 'FICHA_' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
            
            \Log::info('Generated random ID for ficha medica', ['generated_id' => $randomId]);
            
            // Create new FichaMedica using the Roddy Firestore model
            \Log::info('Creating ficha medica in Firestore');
            $fichaMedica = FichaMedica::create([
                'idfichamedica' => $randomId, // Use auto-generated ID
                'fechaingreso' => $request->input('fechaingreso'),
                'idpaciente' => $request->input('idpaciente'),
                'idoperacion' => $request->input('idoperacion'),
                'idcronico' => $request->input('idcronico'),
                'idalergia' => $request->input('idalergia')
            ]);
            
            \Log::info('Ficha medica saved successfully', [
                'idfichamedica' => $fichaMedica->idfichamedica ?? 'unknown'
            ]);
            
            return redirect()->back()->with('success', 'Ficha médica creada exitosamente');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', [
                'errors' => $e->errors()
            ]);
            return redirect()->back()->withErrors($e->errors())->withInput();
            
        } catch (\Exception $e) {
            \Log::error('Exception in createFichaMedica', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return redirect()->back()->with('error', 'Error al crear ficha médica: ' . $e->getMessage());
        }
    }

    public function updateFichaMedica(Request $request, $id)
    {
        \Log::info('=== updateFichaMedica method called ===', [
            'id' => $id,
            'data' => $request->all()
        ]);
        
        try {
            // Validate the request
            $validated = $request->validate([
                'fechaingreso' => 'nullable|date',
                'idoperacion' => 'nullable|string|max:255',
                'idcronico' => 'nullable|string|max:255',
                'idalergia' => 'nullable|string|max:255',
                'alergia_descripcion' => 'nullable|string|max:1000'
            ]);
            
            \Log::info('Request validated successfully', ['validated_data' => $validated]);
            
            // Try to find and update using Roddy's where() method with correct array format
            $updateData = [];
            
            if ($request->has('fechaingreso') && $request->input('fechaingreso')) {
                $updateData['fechaingreso'] = $request->input('fechaingreso');
            }
            if ($request->has('idoperacion')) {
                $updateData['idoperacion'] = $request->input('idoperacion') ?: null;
            }
            if ($request->has('idcronico')) {
                $updateData['idcronico'] = $request->input('idcronico') ?: null;
            }
            if ($request->has('idalergia')) {
                $updateData['idalergia'] = $request->input('idalergia') ?: null;
            }
            
            \Log::info('Prepared update data', ['updateData' => $updateData]);
            
            // Try updating using Roddy's collection update method with correct array format
            try {
                // First verify the record exists using Roddy's array format
                $existingFicha = FichaMedica::where(['idfichamedica', '=', $id])->first();
                if (!$existingFicha) {
                    // Try as integer
                    $existingFicha = FichaMedica::where(['idfichamedica', '=', (int)$id])->first();
                }
                
                if (!$existingFicha) {
                    \Log::error('UPDATE: Ficha not found', ['id' => $id]);
                    return response()->json(['success' => false, 'message' => 'Ficha médica no encontrada'], 404);
                }
                
                \Log::info('UPDATE: Found existing ficha', ['ficha' => $existingFicha->idfichamedica]);
                
                // Update using Roddy's syntax: update the found record
                if (!empty($updateData)) {
                    $updateResult = $existingFicha->update($updateData);
                    \Log::info('UPDATE: Update result', ['result' => $updateResult]);
                }
                
                return response()->json([
                    'success' => true,
                    'message' => 'Ficha médica actualizada exitosamente'
                ]);
                
            } catch (\Exception $updateEx) {
                \Log::error('UPDATE: Direct update failed, trying alternative method', [
                    'error' => $updateEx->getMessage()
                ]);
                
                // Alternative: Use collection-level update with correct array format
                $affectedRows = FichaMedica::where(['idfichamedica', '=', $id])->update($updateData);
                \Log::info('UPDATE: Collection update result', ['affected' => $affectedRows]);
                
                if ($affectedRows === 0) {
                    // Try with integer ID
                    $affectedRows = FichaMedica::where(['idfichamedica', '=', (int)$id])->update($updateData);
                    \Log::info('UPDATE: Integer ID update result', ['affected' => $affectedRows]);
                }
                
                if ($affectedRows > 0) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Ficha médica actualizada exitosamente'
                    ]);
                } else {
                    return response()->json(['success' => false, 'message' => 'No se pudo actualizar la ficha médica'], 500);
                }
            }
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors()]);
            return response()->json(['success' => false, 'message' => 'Validación fallida', 'errors' => $e->errors()], 422);
            
        } catch (\Exception $e) {
            \Log::error('Exception in updateFichaMedica', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['success' => false, 'message' => 'Error al actualizar ficha médica: ' . $e->getMessage()], 500);
        }
    }

    public function deleteFichaMedica($id)
    {
        \Log::info('=== deleteFichaMedica method called ===', ['id' => $id]);
        
        try {
            // Delete a ficha with the specified ID
            $ficha = FichaMedica::where(['idfichamedica', '=', $id])->first();
            if (!$ficha) {
                // Try as integer
                $ficha = FichaMedica::where(['idfichamedica', '=', (int)$id])->first();
            }
            
            if (!$ficha) {
                \Log::error('Ficha not found', ['id' => $id]);
                return response()->json(['success' => false, 'message' => 'Ficha médica no encontrada'], 404);
            }
            
            \Log::info('Found ficha for deletion', ['idfichamedica' => $ficha->idfichamedica]);
            
            $ficha->delete();
            
            \Log::info('Ficha médica deleted successfully', ['id' => $id]);
            
            return response()->json([
                'success' => true,
                'message' => 'Ficha médica eliminada exitosamente'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Exception in deleteFichaMedica', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['success' => false, 'message' => 'Error al eliminar ficha médica: ' . $e->getMessage()], 500);
        }
    }
}
