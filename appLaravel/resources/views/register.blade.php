@extends('layouts.app')

@section('title', 'Registrarse - Triple M.A.')

@section('page-content')
<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 500px; margin: 0 auto; padding: 0 1.5rem;">
        <div class="card" style="background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.04); padding: 3rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(2,6,23,0.6);">
            
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
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: var(--text-primary);
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
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
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

    .btn-full {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        font-weight: 600;
        margin-top: 0.5rem;
    }

    .form-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .login-link {
        color: var(--muted);
        margin: 0;
        font-size: 0.9rem;
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
</script>
@endsection
