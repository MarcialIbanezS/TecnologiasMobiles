@extends('layouts.app')

@section('title', 'Dashboard - Triple M.A.')

@section('page-content')
<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
        <div class="card" style="background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.04); padding: 3rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(2,6,23,0.6); margin-bottom: 2rem;">
            <div class="hero-content">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-primary);">Dashboard</h1>
                <p class="lead" style="font-size: 1.125rem; color: var(--muted); margin-bottom: 2rem; max-width: none;">Bienvenido al panel de control de Triple M.A. Aquí puedes gestionar todos los aspectos de tu aplicación médica.</p>
            </div>

            <!-- Dashboard Stats -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3>Usuarios</h3>
                        <p class="stat-number">1,234</p>
                        <p class="stat-label">Total registrados</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3>Proyectos</h3>
                        <p class="stat-number">56</p>
                        <p class="stat-label">Proyectos activos</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <h3>Reportes</h3>
                        <p class="stat-number">23</p>
                        <p class="stat-label">Generados hoy</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🏥</div>
                    <div class="stat-content">
                        <h3>Consultas</h3>
                        <p class="stat-number">89</p>
                        <p class="stat-label">Esta semana</p>
                    </div>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div class="buttons">
                    <a class="btn btn-primary" href="/patients">Ver Pacientes</a>
                    <a class="btn btn-ghost" href="/reports">Generar Reporte</a>
                    <a class="btn btn-ghost" href="/settings">Configuración</a>
                </div>
            </div>

            <!-- Recent Activity -->
            <div class="recent-activity">
                <h2>Actividad Reciente</h2>
                <div class="activity-list">
                    <div class="activity-item">
                        <div class="activity-icon">👤</div>
                        <div class="activity-content">
                            <p><strong>Nuevo usuario registrado</strong></p>
                            <p class="activity-time">Hace 5 minutos</p>
                        </div>
                    </div>
                    
                    <div class="activity-item">
                        <div class="activity-icon">📋</div>
                        <div class="activity-content">
                            <p><strong>Reporte mensual generado</strong></p>
                            <p class="activity-time">Hace 1 hora</p>
                        </div>
                    </div>
                    
                    <div class="activity-item">
                        <div class="activity-icon">🔧</div>
                        <div class="activity-content">
                            <p><strong>Sistema actualizado</strong></p>
                            <p class="activity-time">Hace 2 horas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('styles')
<style>
    .dashboard-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }

    .stat-card {
        background: rgba(255, 255, 255, 0.05);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(79, 70, 229, 0.15);
    }

    .stat-icon {
        font-size: 2.5rem;
        opacity: 0.8;
    }

    .stat-content h3 {
        margin: 0 0 0.5rem 0;
        color: var(--accent);
        font-size: 1rem;
        font-weight: 600;
    }

    .stat-number {
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
        color: var(--text-primary);
    }

    .stat-label {
        color: var(--muted);
        margin: 0;
        font-size: 0.85rem;
    }

    .quick-actions, .recent-activity {
        margin: 2.5rem 0;
    }

    .quick-actions h2, .recent-activity h2 {
        color: var(--text-primary);
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .activity-list {
        background: rgba(255, 255, 255, 0.03);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        overflow: hidden;
    }

    .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .activity-item:last-child {
        border-bottom: none;
    }

    .activity-icon {
        font-size: 1.5rem;
        opacity: 0.7;
    }

    .activity-content {
        flex: 1;
    }

    .activity-content p {
        margin: 0;
    }

    .activity-content p:first-child {
        color: var(--text-primary);
        font-weight: 500;
    }

    .activity-time {
        color: var(--muted);
        font-size: 0.85rem;
        margin-top: 0.25rem !important;
    }

    @media (max-width: 768px) {
        .container {
            padding: 0 1rem !important;
        }
        
        .card {
            padding: 2rem 1.5rem !important;
            margin: 0 !important;
        }
        
        .hero-content h1 {
            font-size: 2rem !important;
        }
        
        /* Mobile header spacing fix */
        @media (max-width: 768px) {
            div[style*="padding: 6rem 0 2rem 0"] {
                padding: 4rem 0 2rem 0 !important;
                margin-top: 1rem !important;
            }
        }
        
        .dashboard-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .stat-card {
            padding: 1.25rem;
        }
        
        .buttons {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .btn {
            width: 100%;
            max-width: 280px;
            text-align: center;
        }
        
        .quick-actions, .recent-activity {
            margin: 2rem 0;
        }
    }
</style>
@endsection

