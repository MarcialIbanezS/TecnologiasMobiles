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
    
    <style>
        /* Header-specific styles */
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(15, 23, 36, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        
        .header.scrolled {
            background: rgba(11, 18, 32, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0.75rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: var(--text-primary);
            font-weight: 700;
            font-size: 1.25rem;
        }
        
        .logo:hover {
            color: var(--accent);
            transition: color 0.3s ease;
        }
        
        .nav-menu {
            display: flex;
            align-items: center;
            gap: 2rem;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .nav-link {
            color: var(--muted);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            padding: 0.5rem 0;
            position: relative;
        }
        
        .nav-link:hover,
        .nav-link.active {
            color: var(--text-primary);
        }
        
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, var(--accent), #7c3aed);
            border-radius: 1px;
        }
        
        .nav-actions {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .btn-nav {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.875rem;
            transition: all 0.3s ease;
        }
        
        .btn-nav-primary {
            background: linear-gradient(90deg, var(--accent), #7c3aed);
            color: white;
        }
        
        .btn-nav-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .btn-nav-ghost {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--muted);
        }
        
        .btn-nav-ghost:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-primary);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        /* Mobile menu toggle */
        .mobile-toggle {
            display: none;
            flex-direction: column;
            gap: 3px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
        }
        
        .mobile-toggle span {
            width: 20px;
            height: 2px;
            background: var(--text-primary);
            transition: all 0.3s ease;
            border-radius: 1px;
        }
        
        .mobile-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        /* Page layout */
        body {
            padding-top: 70px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        main {
            flex: 1;
        }
        
        .site-footer {
            background: rgba(11, 18, 32, 0.9);
            padding: 0;
            margin-top: auto;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            width: 100%;
            position: relative;
            left: 0;
            right: 0;
        }
        
        /* Footer content styles - full width background */
        .footer-content {
            width: 100vw;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
            background: rgba(11, 18, 32, 0.9);
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1.5rem;
            width: 100%;
            box-sizing: border-box;
        }

        .footer-main {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 2rem 0;
        }

        .footer-section h4 {
            color: var(--text-primary);
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .footer-section p {
            color: var(--muted);
            margin: 0;
            line-height: 1.6;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-section ul li {
            margin-bottom: 0.5rem;
        }

        .footer-section ul li a {
            color: var(--muted);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
            color: var(--text-primary);
        }

        .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.5rem 0;
            width: 100%;
        }

        .footer-bottom .footer-container {
            text-align: center;
        }

        .footer-bottom p {
            color: var(--muted);
            margin: 0;
            font-size: 0.9rem;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(11, 18, 32, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                gap: 0;
                padding: 1rem 0;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            .nav-menu li {
                width: 100%;
                text-align: center;
                padding: 0.5rem 0;
            }
            
            .nav-actions {
                flex-direction: column;
                gap: 0.5rem;
                padding: 1rem;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .mobile-toggle {
                display: flex;
            }
            
            .nav-container {
                padding: 1rem 1.5rem;
            }
            
            body {
                padding-top: 65px;
            }
            
            /* Footer mobile styles */
            .footer-main {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                padding: 1.5rem 0;
            }
            
            .footer-section {
                text-align: center;
            }
            
            .footer-bottom {
                padding: 1rem 0;
            }
        }
    </style>
</head>
<body>
    <header class="header" id="header">
        @include('header')
    </header>

    <script>
        // Mobile menu toggle
        function toggleMobileMenu() {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        }
        
        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            if (!event.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu when window is resized
        window.addEventListener('resize', function() {
            const navMenu = document.getElementById('navMenu');
            const mobileToggle = document.getElementById('mobileToggle');
            
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    </script>

    <!-- Page Content -->
    <main>
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="site-footer">
        @include('footer')
    </footer>

    <!-- Scripts -->
    @yield('scripts')
</body>
</html>