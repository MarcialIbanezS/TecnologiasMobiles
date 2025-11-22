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
            $fichasMedicas = FichaMedica::all();
            $pacientes = Paciente::all();
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
            
            // Count fichas by alergia
            $alergiaStats = [];
            
            if (is_array($fichasMedicas) || is_object($fichasMedicas)) {
                foreach ($fichasMedicas as $ficha) {
                    $idAlergia = is_object($ficha) ? ($ficha->idalergia ?? null) : ($ficha['idalergia'] ?? null);
                    if ($idAlergia) {
                        $alergiaStats[$idAlergia] = ($alergiaStats[$idAlergia] ?? 0) + 1;
                    }
                }
            }
            
            // Map alergia IDs to names
            $alergiaChartData = [];
            if (is_array($alergias) || is_object($alergias)) {
                foreach ($alergias as $alergia) {
                    try {
                        $reflection = new \ReflectionClass($alergia);
                        $dataProperty = $reflection->getProperty('data');
                        $dataProperty->setAccessible(true);
                        $data = $dataProperty->getValue($alergia);
                        $idAlergia = $data['idalergia'] ?? null;
                        $nombreAlergia = $data['nombrealergia'] ?? 'Desconocida';
                        
                        if ($idAlergia && isset($alergiaStats[$idAlergia])) {
                            $alergiaChartData[$nombreAlergia] = $alergiaStats[$idAlergia];
                        }
                    } catch (\Exception $e) {
                        \Log::warning('Failed to process alergia for chart', ['error' => $e->getMessage()]);
                    }
                }
            }
            
            // Sort by count descending and take top 8
            arsort($alergiaChartData);
            $alergiaChartData = array_slice($alergiaChartData, 0, 8, true);
            
            \Log::info('Dashboard data prepared', [
                'total_pacientes' => $totalPacientes,
                'total_fichas' => $totalFichas,
                'fichas_this_year' => $fichasThisYear,
                'alergia_chart_items' => count($alergiaChartData)
            ]);
            
            return view('dashboard', [
                'totalPacientes' => $totalPacientes,
                'fichasThisYear' => $fichasThisYear,
                'mostCommonCronico' => $mostCommonCronicoName,
                'totalFichas' => $totalFichas,
                'alergiaChartData' => $alergiaChartData
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
                return redirect()->back()->with('error', 'Por favor ingrese un ID de ficha médica para buscar');
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
                return redirect()->back()->with('error', 'No se encontró ninguna ficha médica con el ID: ' . $searchId);
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
            
            return redirect()->back()->with('error', 'Error al buscar ficha médica: ' . $e->getMessage());
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
            
            // Find the ficha medica by idfichamedica field
            $ficha = FichaMedica::where(['idfichamedica', '=', $id])->first();
            
            // Try as integer if not found as string
            if (!$ficha) {
                \Log::info('Not found as string, trying as integer');
                $ficha = FichaMedica::where(['idfichamedica', '=', (int)$id])->first();
            }
            
            if (!$ficha) {
                \Log::error('Ficha not found', ['id' => $id]);
                return response()->json(['success' => false, 'message' => 'Ficha médica no encontrada'], 404);
            }
            
            \Log::info('Ficha found', ['ficha_type' => gettype($ficha)]);
            
            // Prepare update data
            $updateData = [];
            if ($request->has('fechaingreso') && $request->input('fechaingreso')) {
                $updateData['fechaingreso'] = $request->input('fechaingreso');
                \Log::info('Updated fechaingreso', ['value' => $request->input('fechaingreso')]);
            }
            if ($request->has('idoperacion')) {
                $updateData['idoperacion'] = $request->input('idoperacion') ?: null;
                \Log::info('Updated idoperacion', ['value' => $request->input('idoperacion')]);
            }
            if ($request->has('idcronico')) {
                $updateData['idcronico'] = $request->input('idcronico') ?: null;
                \Log::info('Updated idcronico', ['value' => $request->input('idcronico')]);
            }
            if ($request->has('idalergia')) {
                $updateData['idalergia'] = $request->input('idalergia') ?: null;
                \Log::info('Updated idalergia', ['value' => $request->input('idalergia')]);
            }
            
            // Update the ficha using the correct Roddy syntax
            if (!empty($updateData)) {
                $updatedFicha = $ficha->update($updateData);
                \Log::info('Update operation completed', ['result' => $updatedFicha]);
            }
            
            \Log::info('Ficha medica updated successfully', ['id' => $id]);
            
            return response()->json([
                'success' => true,
                'message' => 'Ficha médica actualizada exitosamente'
            ]);
            
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
            // Find the ficha medica by idfichamedica field
            $ficha = FichaMedica::where(['idfichamedica', '=', $id])->first();
            
            // Try as integer if not found as string
            if (!$ficha) {
                \Log::info('Not found as string, trying as integer');
                $ficha = FichaMedica::where(['idfichamedica', '=', (int)$id])->first();
                $res=FichaMedica::where(['idfichamedica', '=', (int)$id])->delete();
            }
            
            if (!$ficha) {
                \Log::error('Ficha not found', ['id' => $id]);
                return response()->json(['success' => false, 'message' => 'Ficha médica no encontrada'], 404);
            }
            
            \Log::info('Ficha found for deletion', [
                'idfichamedica' => $ficha->idfichamedica ?? 'unknown',
                'fechaingreso' => $ficha->fechaingreso ?? 'unknown'
            ]);
            
            // Get all fichas BEFORE deletion for comparison
            $countBefore = FichaMedica::count();
            \Log::info('Count before delete', ['count' => $countBefore]);
            
            // Try multiple deletion methods
            try {
                // Method 1: Try forceDelete
                if (method_exists($ficha, 'forceDelete')) {
                    \Log::info('Trying forceDelete method');
                    $result = $ficha->forceDelete();
                    \Log::info('forceDelete result', ['result' => $result]);
                }
                
                // Method 2: Get the Firestore doc ID and use whereId
                $reflection = new \ReflectionClass($ficha);
                if ($reflection->hasProperty('id')) {
                    $idProperty = $reflection->getProperty('id');
                    $idProperty->setAccessible(true);
                    $docId = $idProperty->getValue($ficha);
                    \Log::info('Got Firestore doc ID', ['doc_id' => $docId]);
                    
                    if ($docId) {
                        // Try whereId delete
                        \Log::info('Attempting whereId delete');
                        $deleted = FichaMedica::whereId($docId)->delete();
                        \Log::info('whereId delete result', ['result' => $deleted]);
                    }
                }
                
                // Method 3: Standard delete (last resort)
                \Log::info('Attempting standard delete');
                $deleteResult = $ficha->delete();
                \Log::info('Standard delete result', ['result' => $deleteResult]);
                
            } catch (\Exception $deleteEx) {
                \Log::error('Delete operation failed', [
                    'error' => $deleteEx->getMessage(),
                    'trace' => $deleteEx->getTraceAsString()
                ]);
                throw $deleteEx;
            }
            
            // Clear any caches
            if (method_exists('FichaMedica', 'clearCache')) {
                FichaMedica::clearCache();
            }
            
            // Wait for Firestore to process
            sleep(1);
            
            // Verify deletion
            $countAfter = FichaMedica::count();
            \Log::info('Count after delete', ['count' => $countAfter]);
            
            $verifyDeleted = FichaMedica::where(['idfichamedica', '=', $id])->first();
            
            if ($verifyDeleted) {
                \Log::warning('Document STILL EXISTS after all delete attempts!', [
                    'id' => $id,
                    'count_before' => $countBefore,
                    'count_after' => $countAfter
                ]);
                return response()->json(['success' => false, 'message' => 'Error: El documento no se pudo eliminar de la base de datos'], 500);
            }
            
            \Log::info('Ficha medica deleted and verified successfully', [
                'id' => $id,
                'count_before' => $countBefore,
                'count_after' => $countAfter
            ]);
            
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
