<x-guest-layout>
    <!-- Session Status -->
@section('title', 'Iniciar Sesión - Triple M.A.')

    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="block mt-1 w-full"
                            type="password"
                            name="password"
                            required autocomplete="current-password" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800" name="remember">
                <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-end mt-4">
            @if (Route::has('password.request'))
                <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" href="{{ route('password.request') }}">
                    {{ __('¿Olvidaste tu contraseña?') }}
                </a>
            @endif

            <x-primary-button class="ms-3">
                {{ __('Log in') }}
            </x-primary-button>
        </div>

        <!-- Register Link -->
        <div class="mt-4 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                ¿No tienes una cuenta? 
                <a class="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800" href="{{ route('register') }}">
                    Registrate
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
            Iniciar Sesión con Google
        </button>
    </div>

    <!-- Google Identity Services -->
    <script src="https://accounts.google.com/gsi/client" async defer></script>

    <script>
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
                
                // Send credential to backend for automatic login
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
                
                // Send user info to backend for automatic login
                sendUserInfoToBackend(userInfo, response.access_token);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                alert('Error obteniendo información del usuario.');
            });
        }

        function sendCredentialToBackend(credential, payload) {
            fetch('/auth/google/login', {
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
                    console.log('User logged in successfully');
                    window.location.href = data.redirect || '/dashboard';
                } else if (data.action === 'register') {
                    console.log('User not found, registering automatically...');
                    // Redirect to register endpoint for auto-registration
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
                    .then(registerData => {
                        if (registerData.success) {
                            window.location.href = registerData.redirect || '/dashboard';
                        } else {
                            alert('Error en el registro automático: ' + registerData.message);
                        }
                    });
                } else {
                    console.error('Login failed:', data.error);
                    alert('Error en el inicio de sesión: ' + (data.message || 'Error desconocido'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión al servidor.');
            });
        }

        function sendUserInfoToBackend(userInfo, accessToken) {
            fetch('/auth/google/login', {
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
                    console.log('User logged in successfully');
                    window.location.href = data.redirect || '/dashboard';
                } else if (data.action === 'register') {
                    console.log('User not found, registering automatically...');
                    // Redirect to register endpoint for auto-registration
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
                    .then(registerData => {
                        if (registerData.success) {
                            window.location.href = registerData.redirect || '/dashboard';
                        } else {
                            alert('Error en el registro automático: ' + registerData.message);
                        }
                    });
                } else {
                    console.error('Login failed:', data.error);
                    alert('Error en el inicio de sesión: ' + (data.message || 'Error desconocido'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión al servidor.');
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

        function signOut() {
            if (googleInitialized && google.accounts.id) {
                google.accounts.id.disableAutoSelect();
                console.log('User signed out.');
            }
        }
    </script>
</x-guest-layout>
