<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Triple M.A. - Tecnologías Móviles')</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    @yield('styles')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    @auth
        @include('layouts.navigation')
    @else
        <header class="header" id="header">
            @include('header')
        </header>
    @endauth

    <script>
        // Mobile menu toggle
        function toggleMobileMenu() {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            if (navMenu && mobileToggle) {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            }
        }
        
        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (header && window.scrollY > 50) {
                header.classList.add('scrolled');
            } else if (header) {
                header.classList.remove('scrolled');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            if (navMenu && mobileToggle && !event.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when window is resized
        window.addEventListener('resize', function() {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            if (navMenu && mobileToggle && window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    </script>

    <!-- Page Content -->
    <main>
        @yield('page-content')
        @yield('content')
        {{ $slot ?? '' }}
    </main>

    <!-- Footer -->
    @guest
        <footer class="site-footer">
            @include('footer')
        </footer>
    @endguest

    <!-- Scripts -->
    @yield('scripts')
</body>
</html>
