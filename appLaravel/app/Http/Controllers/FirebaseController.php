<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\FModels\FichaMedica;

class FirebaseController extends Controller
{
    public function __construct()
    {
        \Log::info('=== FirebaseController constructor called (Roddy Firestore) ===');
    }

    public function getFichasMedicas()
    {
        \Log::info('=== getFichasMedicas method called (using Roddy Firestore) ===');
        
        try {
            \Log::info('Attempting to fetch all fichas medicas using FichaMedica model');
            
            // Get all records using the Roddy Firestore Eloquent model
            $fichasMedicas = FichaMedica::all();
            
            \Log::info('Fichas medicas fetched', [
                'count' => $fichasMedicas->count(),
                'data_type' => gettype($fichasMedicas)
            ]);
            
            // Convert to array format for easier handling in view
            $fichasArray = [];
            
            if ($fichasMedicas->count() > 0) {
                \Log::info('Processing fichas medicas', ['count' => $fichasMedicas->count()]);
                
                foreach ($fichasMedicas as $ficha) {
                    \Log::info('Processing ficha', [
                        'idfichamedica' => $ficha->idfichamedica ?? 'no-id',
                        'idpaciente' => $ficha->idpaciente ?? 'no-patient'
                    ]);
                    
                    $fichasArray[] = [
                        'id' => $ficha->idfichamedica ?? null,
                        'idfichamedica' => $ficha->idfichamedica ?? '',
                        'fechaingreso' => $ficha->fechaingreso ?? '',
                        'idpaciente' => $ficha->idpaciente ?? '',
                        'idoperacion' => $ficha->idoperacion ?? '',
                        'idcronico' => $ficha->idcronico ?? '',
                        'idalergia' => $ficha->idalergia ?? ''
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
            $error .= "\n\nThis error occurred while trying to fetch data from Firestore.";
            $error .= "\nPlease check your Firebase console and ensure Firestore is enabled.";
            $error .= "\nAlso verify that your service account credentials have the correct permissions.";
            $fichasArray = [];
            
            return view('contact', compact('fichasArray', 'error'));
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
