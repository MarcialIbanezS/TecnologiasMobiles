<!--TEMPLATE PARA ELEMENTOS TERCER NIVEL (NO HEADER/FOOTER)-->

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>@yield('title', 'Triple M.A. - Tecnologías Móviles')</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js','resources/css/style.css'])
        {{-- Page-specific styles --}}
        @yield('styles')
    </head>
    <body style="background: linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%); color: var(--text-primary); min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem;">
        <div style="width: 100%; max-width: 28rem; margin-top: 1.5rem; padding: 1.5rem; background: var(--card, #0b1220); border-radius: 0.5rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <a href="/" style="text-decoration: none;">
                    <x-application-logo style="width: 5rem; height: 5rem; fill: var(--accent); display: block; margin: 0 auto;" />
                </a>
            </div>

            <div style="width: 100%;">
                {{ $slot }}
            </div>
        </div>
    </body>
</html>
