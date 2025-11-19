<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GoogleAuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'google_id' => 'required|string',
            ]);

            // Check if user already exists
            $existingUser = User::where('email', $request->email)->first();
            
            if ($existingUser) {
                // Log in existing user
                Auth::login($existingUser);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Usuario logueado exitosamente',
                    'redirect' => route('dashboard')
                ]);
            }

            // Generate random password for new user
            $randomPassword = Str::random(16);

            // Create new user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($randomPassword),
                'email_verified_at' => now(), // Auto-verify Google users
                'google_id' => $request->google_id,
            ]);

            // Log in the new user
            Auth::login($user);

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado y logueado exitosamente',
                'redirect' => route('dashboard')
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'validation_error',
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Google registration error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'server_error',
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email|max:255',
            ]);

            // Check if user exists
            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                // User doesn't exist, redirect to register or create account
                return response()->json([
                    'success' => false,
                    'error' => 'user_not_found',
                    'message' => 'Usuario no encontrado. Creando cuenta automáticamente...',
                    'action' => 'register'
                ], 404);
            }

            // Update Google ID if not set
            if (!$user->google_id && $request->has('google_id')) {
                $user->google_id = $request->google_id;
                $user->save();
            }

            // Log in the user
            Auth::login($user);

            return response()->json([
                'success' => true,
                'message' => 'Inicio de sesión exitoso',
                'redirect' => route('dashboard')
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'validation_error',
                'message' => 'Datos de validación incorrectos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Google login error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'server_error',
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }
}