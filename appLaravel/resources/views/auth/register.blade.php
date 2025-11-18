<x-guest-layout>
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
        <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
            
            <!-- Header -->
            <div class="text-center mb-6">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Crear Cuenta</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Únete a Triple M.A. y accede a nuestra plataforma médica</p>
            </div>

            <form method="POST" action="{{ route('register') }}">
                @csrf

                <!-- Name -->
                <div>
                    <x-input-label for="name" value="Nombre Completo" />
                    <x-text-input id="name" class="block mt-1 w-full" type="text" name="name" :value="old('name')" required autofocus autocomplete="name" placeholder="Ingresa tu nombre completo" />
                    <x-input-error :messages="$errors->get('name')" class="mt-2" />
                </div>

                <!-- Email Address -->
                <div class="mt-4">
                    <x-input-label for="email" value="Correo Electrónico" />
                    <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autocomplete="username" placeholder="ejemplo@correo.com" />
                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <!-- Email Confirmation -->
                <div class="mt-4">
                    <x-input-label for="email_confirmation" value="Confirmar Correo Electrónico" />
                    <x-text-input id="email_confirmation" class="block mt-1 w-full" type="email" name="email_confirmation" required autocomplete="email" placeholder="Confirma tu correo electrónico" />
                    <x-input-error :messages="$errors->get('email_confirmation')" class="mt-2" />
                </div>

                <!-- Password -->
                <div class="mt-4">
                    <x-input-label for="password" value="Contraseña" />
                    <div class="relative">
                        <x-text-input id="password" class="block mt-1 w-full pr-10"
                                        type="password"
                                        name="password"
                                        required autocomplete="new-password" 
                                        placeholder="Mínimo 8 caracteres" />
                        <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" onclick="togglePassword('password')">
                            <svg id="password-icon" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </div>
                    <x-input-error :messages="$errors->get('password')" class="mt-2" />
                </div>

                <!-- Confirm Password -->
                <div class="mt-4">
                    <x-input-label for="password_confirmation" value="Confirmar Contraseña" />
                    <div class="relative">
                        <x-text-input id="password_confirmation" class="block mt-1 w-full pr-10"
                                        type="password"
                                        name="password_confirmation" 
                                        required autocomplete="new-password" 
                                        placeholder="Repite tu contraseña" />
                        <button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" onclick="togglePassword('password_confirmation')">
                            <svg id="password_confirmation-icon" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                    </div>
                    <x-input-error :messages="$errors->get('password_confirmation')" class="mt-2" />
                </div>

                <!-- Terms and Conditions -->
                <div class="mt-4">
                    <label class="flex items-start space-x-2">
                        <input type="checkbox" name="terms" required class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 mt-1">
                        <span class="text-sm text-gray-600 dark:text-gray-400">
                            Acepto los <a href="/terms" class="text-indigo-600 hover:text-indigo-500 underline">Términos y Condiciones</a> y la 
                            <a href="/privacy" class="text-indigo-600 hover:text-indigo-500 underline">Política de Privacidad</a>
                        </span>
                    </label>
                    <x-input-error :messages="$errors->get('terms')" class="mt-2" />
                </div>

                <!-- Submit Button -->
                <div class="mt-6">
                    <x-primary-button class="w-full justify-center">
                        Crear Cuenta
                    </x-primary-button>
                </div>

                <!-- Login Link -->
                <div class="mt-4 text-center">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        ¿Ya tienes una cuenta? 
                        <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" href="{{ route('login') }}">
                            Iniciar Sesión
                        </a>
                    </p>
                </div>
            </form>

            <!-- OR Divider -->
            <div class="mt-6 mb-4">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">o</span>
                    </div>
                </div>
            </div>

            <!-- Google Sign-In Button -->
            <div class="mt-4">
                <div id="g-signin2" class="hidden">
                    <!-- Google Identity Services button will be rendered here -->
                </div>
                <button type="button" 
                        id="google-signin-btn" 
                        onclick="signInWithGoogle()"
                        class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Registrarse con Google
                </button>
            </div>

        </div>
    </div>

    <!-- Google Identity Services -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <script>
        function togglePassword(fieldId) {
            const passwordField = document.getElementById(fieldId);
            const toggleIcon = document.getElementById(fieldId + '-icon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                // Change to eye-off icon (closed eye)
                toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>';
            } else {
                passwordField.type = 'password';
                // Change to eye icon (open eye)
                toggleIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>';
            }
        }

        // Real-time password confirmation validation
        document.getElementById('password_confirmation').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmation = this.value;
            
            if (confirmation && password !== confirmation) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });

        // Real-time email confirmation validation
        document.getElementById('email_confirmation').addEventListener('input', function() {
            const email = document.getElementById('email').value;
            const confirmation = this.value;
            
            if (confirmation && email !== confirmation) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '';
            }
        });

        // Google Identity Services (Modern API)
        let googleInitialized = false;
        
        window.onload = function() {
            console.log('Loading Google Identity Services...');
            if (typeof google !== 'undefined') {
                initializeGoogle();
            } else {
                // Wait for Google script to load
                const checkGoogle = setInterval(() => {
                    if (typeof google !== 'undefined') {
                        clearInterval(checkGoogle);
                        initializeGoogle();
                    }
                }, 100);
            }
        };

        function initializeGoogle() {
            try {
                console.log('Initializing Google Identity Services...');
                google.accounts.id.initialize({
                    client_id: '{{ env('GOOGLE_CLIENT_ID') }}',
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: false
                });
                
                // Render the One Tap prompt (optional)
                google.accounts.id.renderButton(
                    document.getElementById('g-signin2'),
                    {
                        theme: 'outline',
                        size: 'large',
                        width: 240
                    }
                );
                
                googleInitialized = true;
                console.log('Google Identity Services initialized successfully');
            } catch (error) {
                console.error('Error initializing Google Identity Services:', error);
            }
        }

        function signInWithGoogle() {
            console.log('Attempting Google Sign-In...');
            if (!googleInitialized) {
                console.error('Google Identity Services not initialized');
                alert('Google no está inicializado. Recarga la página.');
                return;
            }
            
            try {
                // Use the popup flow for better compatibility
                google.accounts.oauth2.initTokenClient({
                    client_id: '{{ env('GOOGLE_CLIENT_ID') }}',
                    scope: 'profile email openid',
                    callback: handleTokenResponse,
                }).requestAccessToken();
            } catch (error) {
                console.error('Error during sign-in:', error);
                alert('Error al iniciar sesión con Google: ' + error.message);
            }
        }

        function handleCredentialResponse(response) {
            console.log('Credential response received');
            try {
                // Decode the JWT token to get user info
                const payload = parseJwt(response.credential);
                console.log('User info:', payload);
                
                // Send credential to backend for automatic registration
                sendCredentialToBackend(response.credential, payload);
            } catch (error) {
                console.error('Error processing credential:', error);
                alert('Error procesando credenciales de Google.');
            }
        }

        function handleTokenResponse(response) {
            console.log('Token response received');
            if (response.error) {
                console.error('Token error:', response.error);
                alert('Error de autorización: ' + response.error);
                return;
            }
            
            // Get user info using the access token
            fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': 'Bearer ' + response.access_token
                }
            })
            .then(response => response.json())
            .then(userInfo => {
                console.log('User info:', userInfo);
                
                // Send user info to backend for automatic registration
                sendUserInfoToBackend(userInfo, response.access_token);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                alert('Error obteniendo información del usuario.');
            });
        }

        function parseJwt(token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        }

        function sendCredentialToBackend(credential, payload) {
            fetch('/auth/google/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    credential: credential,
                    name: payload.name,
                    email: payload.email,
                    google_id: payload.sub
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('User registered and logged in successfully');
                    window.location.href = data.redirect || '/dashboard';
                } else {
                    console.error('Registration failed:', data.error);
                    alert('Error en el registro: ' + (data.message || 'Error desconocido'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión al servidor.');
            });
        }

        function sendUserInfoToBackend(userInfo, accessToken) {
            fetch('/auth/google/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    name: userInfo.name,
                    email: userInfo.email,
                    google_id: userInfo.id
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('User registered and logged in successfully');
                    window.location.href = data.redirect || '/dashboard';
                } else {
                    console.error('Registration failed:', data.error);
                    alert('Error en el registro: ' + (data.message || 'Error desconocido'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión al servidor.');
            });
        }

        function signOut() {
            if (googleInitialized && google.accounts.id) {
                google.accounts.id.disableAutoSelect();
                console.log('User signed out.');
            }
        }
    </script>
</x-guest-layout>
