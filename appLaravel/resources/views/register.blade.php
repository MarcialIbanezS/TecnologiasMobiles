@extends('layouts.base')

@section('title', 'Registrarse - Triple M.A.')

@section('page-content')

<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 500px; margin: 0 auto; padding: 0 1.5rem;">
        <div class="card">
            
            <!-- Header -->
            <div class="form-header">
                <h1 style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--text-primary); text-align: center;">Crear Cuenta</h1>
                <p class="lead" style="font-size: 1rem; color: var(--muted); margin-bottom: 2rem; text-align: center;">Únete a Triple M.A. y accede a nuestra plataforma médica</p>
            </div>

            <!-- Registration Form -->
            <form method="POST" action="/register" class="register-form">
                @csrf
                
                <!-- Name Field -->
                <div class="form-group">
                    <label for="name" class="form-label">Nombre Completo</label>
                    <input type="text" 
                           id="name" 
                           name="name" 
                           class="form-input" 
                           placeholder="Ingresa tu nombre completo"
                           required 
                           autocomplete="name"
                           value="{{ old('name') }}">
                    @error('name')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Email Field -->
                <div class="form-group">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input type="email" 
                           id="email" 
                           name="email" 
                           class="form-input" 
                           placeholder="ejemplo@correo.com"
                           required 
                           autocomplete="email"
                           value="{{ old('email') }}">
                    @error('email')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Email Confirmation Field -->
                <div class="form-group">
                    <label for="email_confirmation" class="form-label">Confirmar Correo Electrónico</label>
                    <input type="email" 
                           id="email_confirmation" 
                           name="email_confirmation" 
                           class="form-input" 
                           placeholder="Confirma tu correo electrónico"
                           required 
                           autocomplete="email">
                    @error('email_confirmation')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Password Field -->
                <div class="form-group">
                    <label for="password" class="form-label">Contraseña</label>
                    <div class="password-input-container">
                        <input type="password" 
                               id="password" 
                               name="password" 
                               class="form-input" 
                               placeholder="Mínimo 8 caracteres"
                               required 
                               autocomplete="new-password">
                        <button type="button" class="password-toggle" onclick="togglePassword('password')">
                            <span class="toggle-icon" id="password-icon">👁️</span>
                        </button>
                    </div>
                    @error('password')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Password Confirmation Field -->
                <div class="form-group">
                    <label for="password_confirmation" class="form-label">Confirmar Contraseña</label>
                    <div class="password-input-container">
                        <input type="password" 
                               id="password_confirmation" 
                               name="password_confirmation" 
                               class="form-input" 
                               placeholder="Repite tu contraseña"
                               required 
                               autocomplete="new-password">
                        <button type="button" class="password-toggle" onclick="togglePassword('password_confirmation')">
                            <span class="toggle-icon" id="password_confirmation-icon">👁️</span>
                        </button>
                    </div>
                    @error('password_confirmation')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Terms and Conditions -->
                <div class="form-group">
                    <label class="checkbox-container">
                        <input type="checkbox" name="terms" required>
                        <span class="checkmark"></span>
                        <span class="checkbox-text">
                            Acepto los <a href="/terms" class="link">Términos y Condiciones</a> y la 
                            <a href="/privacy" class="link">Política de Privacidad</a>
                        </span>
                    </label>
                    @error('terms')
                        <span class="error-message">{{ $message }}</span>
                    @enderror
                </div>

                <!-- Submit Button -->
                <div class="form-group">
                    <button type="submit" class="btn btn-primary btn-full">
                        Crear Cuenta
                    </button>
                </div>

                <!-- OR Divider -->
                <div class="divider">
                    <span class="divider-text">o</span>
                </div>

                <!-- Google Sign-In Button -->
                <div class="form-group">
                    <div id="g-signin2" class="g-signin2" data-onsuccess="onSignIn" data-theme="dark">
                        <!-- Google button will be rendered here -->
                    </div>
                    <button type="button" id="google-signin-btn" class="btn btn-google btn-full" onclick="signInWithGoogle()">
                        <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Registrarse con Google
                    </button>
                </div>

                <!-- Login Link -->
                <div class="form-footer">
                    <p class="login-link">
                        ¿Ya tienes una cuenta? 
                        <a href="/login" class="link">Iniciar Sesión</a>
                    </p>
                </div>
            </form>

        </div>
    </div>
</div>
@endsection

@section('styles')
<style>
    /* Override base styles for register page - use consistent color scheme */
    body {
        background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%) !important;
    }

    .register-form {
        width: 100%;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        color: var(--text-primary);
        font-weight: 500;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .form-input {
        width: 100%;
        padding: 0.875rem 1rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        color: #333;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        box-sizing: border-box;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 3px rgba(17, 194, 203, 0.1);
    }

    .form-input::placeholder {
        color: var(--muted);
        opacity: 0.7;
    }

    .password-input-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .password-toggle {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        color: var(--muted);
        transition: color 0.3s ease;
    }

    .password-toggle:hover {
        color: var(--text-primary);
    }

    .toggle-icon {
        font-size: 1.1rem;
        user-select: none;
    }

    .error-message {
        display: block;
        color: #ff6b6b;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        font-weight: 500;
    }

    .checkbox-container {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        cursor: pointer;
        position: relative;
        line-height: 1.4;
    }

    .checkbox-container input[type="checkbox"] {
        opacity: 0;
        position: absolute;
        width: 0;
        height: 0;
    }

    .checkmark {
        width: 18px;
        height: 18px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        position: relative;
        flex-shrink: 0;
        margin-top: 2px;
        transition: all 0.3s ease;
    }

    .checkbox-container input[type="checkbox"]:checked + .checkmark {
        background: var(--accent);
        border-color: var(--accent);
    }

    .checkbox-container input[type="checkbox"]:checked + .checkmark:after {
        content: "✓";
        position: absolute;
        left: 3px;
        top: -1px;
        color: white;
        font-size: 12px;
        font-weight: bold;
    }

    .checkbox-text {
        color: var(--muted);
        font-size: 0.85rem;
    }

    .link {
        color: var(--accent);
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .link:hover {
        color: #13d4de;
        text-decoration: underline;
    }

    .btn {
        display: inline-block;
        padding: 12px 24px;
        border-radius: 10px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
        text-align: center;
    }

    .btn-full {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        font-weight: 600;
        margin-top: 0.5rem;
    }

    .btn-primary {
        background: linear-gradient(90deg, var(--accent), #127e5c);
        color: white;
        box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
    }

    .form-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .login-link {
        color: var(--muted);
        margin: 0;
        font-size: 0.9rem;
    }

    /* Google Sign-In Styles */
    .divider {
        display: flex;
        align-items: center;
        margin: 1.5rem 0;
        text-align: center;
    }

    .divider::before,
    .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(0, 0, 0, 0.2);
    }

    .divider-text {
        padding: 0 1rem;
        color: var(--text-primary);
        font-size: 0.9rem;
        background: var(--bg);
    }

    .btn-google {
        background: #fff;
        color: #757575;
        border: 1px solid #dadce0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn-google:hover {
        background: #f8f9fa;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
        color: #3c4043;
    }

    .google-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }

    .g-signin2 {
        display: none; /* Hide the default Google button, use custom one */
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
        .container {
            padding: 0 1rem !important;
        }
        
        .card {
            padding: 2rem 1.5rem !important;
            margin: 0 !important;
        }
        
        .form-header h1 {
            font-size: 2rem !important;
        }
        
        .form-input {
            padding: 0.75rem;
            font-size: 0.9rem;
        }
        
        .checkbox-text {
            font-size: 0.8rem;
        }
        
        /* Mobile header spacing fix */
        div[style*="padding: 6rem 0 2rem 0"] {
            padding: 4rem 0 2rem 0 !important;
            margin-top: 1rem !important;
        }
    }
</style>
@endsection

@section('scripts')
<script src="https://apis.google.com/js/platform.js" async defer></script>
<script src="https://accounts.google.com/gsi/client" async defer></script>

<script>
    function togglePassword(fieldId) {
        const passwordField = document.getElementById(fieldId);
        const toggleIcon = document.getElementById(fieldId + '-icon');
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            toggleIcon.textContent = '🙈';
        } else {
            passwordField.type = 'password';
            toggleIcon.textContent = '👁️';
        }
    }

    // Real-time password confirmation validation
    document.getElementById('password_confirmation').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const confirmation = this.value;
        
        if (confirmation && password !== confirmation) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // Real-time email confirmation validation
    document.getElementById('email_confirmation').addEventListener('input', function() {
        const email = document.getElementById('email').value;
        const confirmation = this.value;
        
        if (confirmation && email !== confirmation) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // Google Sign-In Functions
    let auth2;
    
    window.onload = function() {
        gapi.load('auth2', function() {
            auth2 = gapi.auth2.init({
                client_id: '264276022373-f68e3gjlpi3ar4fnpbm3kv4je5u4vs58.apps.googleusercontent.com'
            });
            
            // Render the sign-in button
            gapi.signin2.render('g-signin2', {
                'scope': 'profile email',
                'width': 240,
                'height': 50,
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': onSignIn,
                'onfailure': onFailure
            });
        });
    };

    function signInWithGoogle() {
        if (auth2) {
            auth2.signIn().then(onSignIn, onFailure);
        } else {
            console.error('Google Auth2 not initialized');
        }
    }

    function onSignIn(googleUser) {
        const profile = googleUser.getBasicProfile();
        const idToken = googleUser.getAuthResponse().id_token;
        
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        
        // Fill the form with Google data
        document.getElementById('name').value = profile.getName();
        document.getElementById('email').value = profile.getEmail();
        document.getElementById('email_confirmation').value = profile.getEmail();
        
        // You can submit the form automatically or let user fill the password
        alert('Datos de Google cargados. Complete la contraseña para continuar.');
        
        // Optionally send the ID token to your backend for verification
        // sendTokenToBackend(idToken);
    }

    function onFailure(error) {
        console.error('Google Sign-In failed:', error);
        alert('Error al iniciar sesión con Google. Inténtalo de nuevo.');
    }

    function sendTokenToBackend(idToken) {
        fetch('/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                id_token: idToken
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '/dashboard';
            } else {
                console.error('Backend authentication failed:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function signOut() {
        if (auth2) {
            auth2.signOut().then(function () {
                console.log('User signed out.');
            });
        }
    }
</script>
@endsection
