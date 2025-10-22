        <nav class="nav-container">
            <a href="/" class="logo">
                <span>M.A.</span>
                <span>Triple M.A.</span>
            </a>
            
            <ul class="nav-menu" id="navMenu">
                <li><a href="/" class="nav-link {{ request()->is('/') ? 'active' : '' }}">Inicio</a></li>
                <li><a href="/dashboard" class="nav-link {{ request()->is('dashboard') ? 'active' : '' }}">Dashboard</a></li>
                <li><a href="/about" class="nav-link {{ request()->is('about') ? 'active' : '' }}">Acerca de</a></li>
                <li><a href="/contact" class="nav-link {{ request()->is('contact') ? 'active' : '' }}">Contacto</a></li>
            </ul>
            
            <div class="nav-actions">
                <a href="/login" class="btn-nav btn-nav-ghost">Iniciar Sesión</a>
                <a href="/register" class="btn-nav btn-nav-primary">Registrarse</a>
            </div>
            
            <button class="mobile-toggle" id="mobileToggle" onclick="toggleMobileMenu()">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </nav>
    