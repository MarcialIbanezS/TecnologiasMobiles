@extends('layouts.base')

@section('title', 'Acerca de - Triple M.A.')

@section('page-content')
<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
        
        <!-- Hero Section -->
        <div class="about-hero">
            <h1 class="about-title">Acerca de Triple M.A.</h1>
            <p class="about-subtitle">Revolucionando la tecnología médica móvil para un futuro más saludable</p>
        </div>

        <!-- Main Content Grid -->
        <div class="about-content-grid">
            
            <!-- Company Overview Card -->
            <div class="about-card">
                <div class="card-icon"></div>
                <h2>Nuestra Misión</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>

            <!-- Vision Card -->
            <div class="about-card">
                <div class="card-icon"></div>
                <h2>Nuestra Visión</h2>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            </div>

            <!-- Technology Card -->
            <div class="about-card">
                <div class="card-icon"></div>
                <h2>Nuestra Tecnología</h2>
                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
            </div>

        </div>

        <!-- Team Section -->
        <div class="team-section">
            <h2 class="section-title">Nuestro Equipo</h2>
            <p class="section-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-avatar"></div>
                    <h3>Martin Gottshalk</h3>
                    <p class="member-role">Director Médico</p>
                    <p class="member-bio">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>

                <div class="team-member">
                    <div class="member-avatar"></div>
                    <h3>Matias Sandoval</h3>
                    <p class="member-role">CTO</p>
                    <p class="member-bio">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>

                <div class="team-member">
                    <div class="member-avatar"></div>
                    <h3>Marcial Ibañez</h3>
                    <p class="member-role">Director de Innovación</p>
                    <p class="member-bio">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                </div>
            </div>
        </div>
        <!-- CTA Section -->
        <div class="cta-section">
            <h2>¿Listo para Comenzar?</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <div class="cta-buttons">
                @auth
                    <a class="btn btn-primary" href="{{ route('dashboard') }}">Ir al Dashboard</a>
                    <a class="btn btn-ghost" href="/contact">Contactar</a>
                @else
                    <a class="btn btn-primary" href="/register">Registrarse</a>
                    <a class="btn btn-ghost" href="/contact">Contactar</a>
                @endauth
            </div>
        </div>

    </div>
</div>
@endsection

@section('styles')
<style>
    /* About Page Specific Styles */
    .about-hero {
        text-align: center;
        margin-bottom: 4rem;
        padding: 2rem 0;
    }

    .about-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--text-primary), var(--accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .about-subtitle {
        font-size: 1.25rem;
        color: var(--muted);
        max-width: 600px;
        margin: 0 auto;
        line-height: 1.6;
    }

    .about-content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 4rem;
    }

    .about-card {
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.04);
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .about-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(2,6,23,0.8);
    }

    .card-icon {
        font-size: 3rem;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .about-card h2 {
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: center;
    }

    .about-card p {
        color: var(--muted);
        line-height: 1.6;
        margin-bottom: 1rem;
        text-align: justify;
    }

    /* Team Section */
    .team-section {
        margin-bottom: 4rem;
    }

    .section-title {
        color: var(--text-primary);
        font-size: 2.5rem;
        font-weight: 600;
        text-align: center;
        margin-bottom: 1rem;
    }

    .section-subtitle {
        color: var(--muted);
        font-size: 1.1rem;
        text-align: center;
        max-width: 600px;
        margin: 0 auto 3rem auto;
        line-height: 1.6;
    }

    .team-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .team-member {
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.04);
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        text-align: center;
        transition: transform 0.3s ease;
    }

    .team-member:hover {
        transform: translateY(-3px);
    }

    .member-avatar {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .team-member h3 {
        color: var(--text-primary);
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    .member-role {
        color: var(--accent);
        font-weight: 500;
        margin-bottom: 1rem;
        font-size: 0.95rem;
    }

    .member-bio {
        color: var(--muted);
        line-height: 1.5;
        font-size: 0.9rem;
    }

    /* Stats Section */
    .stats-section {
        margin-bottom: 4rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
    }

    .stat-item {
        text-align: center;
        padding: 2rem 1rem;
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 12px;
        transition: transform 0.3s ease;
    }

    .stat-item:hover {
        transform: scale(1.05);
    }

    .stat-number {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent);
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: var(--muted);
        font-weight: 500;
        font-size: 0.9rem;
    }

    /* CTA Section */
    .cta-section {
        text-align: center;
        padding: 3rem 2rem;
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        margin-bottom: 2rem;
    }

    .cta-section h2 {
        color: var(--text-primary);
        font-size: 2rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .cta-section p {
        color: var(--muted);
        font-size: 1.1rem;
        margin-bottom: 2rem;
        max-width: 500px;
        margin-left: auto;
        margin-right: auto;
    }

    .cta-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .about-title {
            font-size: 2.5rem;
        }

        .about-subtitle {
            font-size: 1.1rem;
        }

        .about-content-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .about-card {
            padding: 2rem 1.5rem;
        }

        .team-grid {
            grid-template-columns: 1fr;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .section-title {
            font-size: 2rem;
        }

        .cta-buttons {
            flex-direction: column;
            align-items: center;
        }

        .btn {
            width: 100%;
            max-width: 280px;
        }

        /* Mobile header spacing fix */
        div[style*="padding: 6rem 0 2rem 0"] {
            padding: 4rem 0 2rem 0 !important;
            margin-top: 1rem !important;
        }
    }
</style>
@endsection