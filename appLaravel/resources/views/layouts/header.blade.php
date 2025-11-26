<div class="header-content" x-data="{ open: false, userMenuOpen: false }">
    <nav class="nav-container"> 
        <a href="{{ auth()->check() ? route('dashboard') : '/' }}" class="logo">
            <span>M.A.</span>
            <span>Triple M.A.</span>
        </a>
        
        <!-- Desktop Navigation -->
        <ul class="nav-menu" id="navMenu">
            @auth
                <!-- Authenticated Navigation -->
                <li><a href="{{ route('dashboard') }}" class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">Dashboard</a></li>
                <li><a href="/about" class="nav-link {{ request()->is('about') ? 'active' : '' }}">Acerca de</a></li>
                <li><a href="/contact" class="nav-link {{ request()->is('contact') ? 'active' : '' }}">Fichas Médicas</a></li>

            @else
                <!-- Guest Navigation -->
                <li><a href="/" class="nav-link {{ request()->is('/') ? 'active' : '' }}">Inicio</a></li>
                <li><a href="/about" class="nav-link {{ request()->is('about') ? 'active' : '' }}">Acerca de</a></li>
                <li><a href="/contact" class="nav-link {{ request()->is('contact') ? 'active' : '' }}">Fichas Médicas</a></li>
            @endauth
        </ul>
        
        <!-- Desktop Actions -->
        <div class="nav-actions">
            @auth
                <!-- User Dropdown -->
                <div class="user-dropdown" x-data="{ open: false }">
                    <button @click="open = !open" class="user-menu-btn">
                        <span class="user-name">{{ Auth::user()->name }}</span>
                        <svg class="dropdown-arrow" :class="{'rotate-180': open}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div x-show="open" 
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-75"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95"
                         @click.away="open = false"
                         class="user-dropdown-menu">
                        <a href="{{ route('profile.edit') }}" class="dropdown-item">
                            <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Perfil
                        </a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="dropdown-item logout-btn">
                                <svg class="dropdown-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            @else
                <!-- Guest Actions -->
                <a href="/login" class="btn-nav btn-nav-ghost" >Iniciar Sesión</a>
                <a href="/register" class="btn-nav btn-nav-primary">Registrarse</a>
            @endauth
        </div>
        
        <!-- Mobile Toggle -->
        <button class="mobile-toggle" @click="open = !open" id="mobileToggle">
            <span :class="{'rotate-45 translate-y-2': open}"></span>
            <span :class="{'opacity-0': open}"></span>
            <span :class="{'-rotate-45 -translate-y-2': open}"></span>
        </button>
    </nav>
    
    <!-- Mobile Menu -->
    <div :class="{'block': open, 'hidden': !open}" class="mobile-menu hidden">
        <div class="mobile-nav-links">
            @auth
                <!-- Authenticated Mobile Links -->
                <a href="{{ route('dashboard') }}" class="mobile-nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}">Dashboard</a>
                <a href="/about" class="mobile-nav-link {{ request()->is('about') ? 'active' : '' }}">Acerca de</a>
                <a href="/contact" class="mobile-nav-link {{ request()->is('contact') ? 'active' : '' }}">Fichas Médicas</a>
                
                <!-- Mobile User Section -->
                <div class="mobile-user-section">
                    <div class="mobile-user-info">
                        <div class="mobile-user-name">{{ Auth::user()->name }}</div>
                        <div class="mobile-user-email">{{ Auth::user()->email }}</div>
                    </div>
                    <div class="mobile-user-actions">
                        <a href="{{ route('profile.edit') }}" class="mobile-nav-link">Perfil</a>
                        <form method="POST" action="{{ route('logout') }}">
                            @csrf
                            <button type="submit" class="mobile-nav-link logout-btn">Cerrar Sesión</button>
                        </form>
                    </div>
                </div>
            @else
                <!-- Guest Mobile Links --> 
                <a href="/" class="mobile-nav-link {{ request()->is('/') ? 'active' : '' }}">Inicio</a>
                <a href="/about" class="mobile-nav-link {{ request()->is('about') ? 'active' : '' }}">Acerca de</a>
                <a href="/contact" class="mobile-nav-link {{ request()->is('contact') ? 'active' : '' }}">Fichas Médicas</a>
                
                <!-- Mobile Guest Actions -->
                <div class="mobile-auth-actions">
                    <a href="/login" class="btn-nav btn-nav-ghost mobile-auth-btn">Iniciar Sesión</a>
                    <a href="/register" class="btn-nav btn-nav-primary mobile-auth-btn">Registrarse</a>
                </div>
            @endauth
        </div>
    </div>
</div>

<style>
/* User Dropdown Styles */
.user-dropdown {
    position: relative;
}

.user-menu-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.user-menu-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

.user-name {
    font-weight: 500;
}

.dropdown-arrow {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
}

.dropdown-arrow.rotate-180 {
    transform: rotate(180deg);
}

.user-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    min-width: 200px;
    background: rgba(11, 18, 32, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 50;
    overflow: hidden;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.875rem 1rem;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
}

.dropdown-item:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
}

.logout-btn {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn:hover {
    background: rgba(220, 38, 38, 0.1);
    color: #fca5a5;
}

.dropdown-icon {
    width: 18px;
    height: 18px;
}

/* Mobile Menu Styles */
.mobile-menu {
    background: rgba(11, 18, 32, 0.98);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 40;
}

.mobile-nav-links {
    padding: 1rem 0;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}

.mobile-nav-link {
    display: block;
    padding: 0.875rem 0;
    color: var(--muted);
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    transition: color 0.3s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
    color: var(--text-primary);
}

.mobile-user-section {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 1rem;
    padding-top: 1rem;
}

.mobile-user-info {
    margin-bottom: 1rem;
}

.mobile-user-name {
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1rem;
}

.mobile-user-email {
    color: var(--muted);
    font-size: 0.9rem;
    margin-top: 0.25rem;
}

.mobile-user-actions {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 1rem;
}

.mobile-auth-actions {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-top: 1rem;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.mobile-auth-btn {
    text-align: center;
    padding: 0.75rem 1rem;
}

/* Mobile Toggle Animation */
.mobile-toggle span {
    transition: all 0.3s ease;
}

.btn-nav-ghost {

        background: var(--card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #00e68eff;
 

}

@media (max-width: 768px) {
    .nav-menu,
    .nav-actions {
        display: none;
    }
    
    .mobile-toggle {
        display: flex;
    }
}
</style>