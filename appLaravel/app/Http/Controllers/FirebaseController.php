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
            
            // Create lookup arrays for operacion, cronico, alergia (using numeric IDs)
            $operaciones = [];
            $cronicos = [];
            $alergias = [];
            
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
                    }
                } catch (\Exception $e) {
                    \Log::warning('Failed to process alergia', ['error' => $e->getMessage()]);
                }
            }
            
            \Log::info('Related collections loaded', [
                'operaciones' => count($operaciones),
                'cronicos' => count($cronicos),
                'alergias' => count($alergias)
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
            $error .= "\n\n\nThis error occurred while trying to fetch data from Firestore.";
            $error .= "\nPlease check your Firebase console and ensure Firestore is enabled.";
            $error .= "\nAlso verify that your service account credentials have the correct permissions.";
            $fichasArray = [];
            
            return view('contact', compact('fichasArray', 'error'));
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
            // Validate the request based on FichaMedica model required fields
            $validated = $request->validate([
                'idfichamedica' => 'required|string|max:255',
                'fechaingreso' => 'required|date',
                'idpaciente' => 'required|string|max:255',
                'idoperacion' => 'nullable|string|max:255',
                'idcronico' => 'nullable|string|max:255',
                'idalergia' => 'nullable|string|max:255'
            ]);
            
            \Log::info('Request validated successfully', ['validated_data' => $validated]);
            
            // Create new FichaMedica using the Roddy Firestore model
            $fichaMedica = new FichaMedica();
            $fichaMedica->idfichamedica = $request->input('idfichamedica');
            $fichaMedica->fechaingreso = $request->input('fechaingreso');
            $fichaMedica->idpaciente = $request->input('idpaciente');
            $fichaMedica->idoperacion = $request->input('idoperacion');
            $fichaMedica->idcronico = $request->input('idcronico');
            $fichaMedica->idalergia = $request->input('idalergia');
            
            \Log::info('Saving ficha medica to Firestore');
            $fichaMedica->save();
            
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
}
