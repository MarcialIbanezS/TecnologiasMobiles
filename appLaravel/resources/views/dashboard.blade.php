@extends('layouts.app')

@section('title', 'Dashboard - Triple M.A.')

@section('page-content')
<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
        <div class="card" >
            <div class="hero-content">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-primary);">Dashboard</h1>
                <p class="lead" style="font-size: 1.125rem; color: var(--text-primary); margin-bottom: 2rem; max-width: none;">Bienvenido al panel de control de Triple M.A. Aquí puedes gestionar todos los aspectos de tu aplicación médica.</p>
            </div>

            <!-- Dashboard Stats -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3>Comuna</h3>
                        <p class="stat-number">1,234</p>
                        <p class="stat-label">Total pacientes activos</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3>Ingresos</h3>
                        <p class="stat-number">56</p>
                        <p class="stat-label">Ingresos Anuales</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <h3>Antecedentes</h3>
                        <p class="stat-number">Hepatitis B</p>
                        <p class="stat-label">Mas Común</p>
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

            <!-- Ingresos por Comuna Chart -->
            <div class="chart-section">
                <h2>Ingresos por Comuna</h2>
                <div class="chart-container">
                    <div class="chart-header">
                        <p class="chart-subtitle">Distribución de ingresos médicos por comuna (Último trimestre)</p>
                    </div>
                    
                    <div class="bar-chart">
                        <div class="chart-bars">
                            <div class="bar-group">
                                <div class="bar" data-value="850" style="height: 85%;">
                                    <span class="bar-value">850K</span>
                                </div>
                                <span class="bar-label">Las Condes</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="720" style="height: 72%;">
                                    <span class="bar-value">720K</span>
                                </div>
                                <span class="bar-label">Providencia</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="650" style="height: 65%;">
                                    <span class="bar-value">650K</span>
                                </div>
                                <span class="bar-label">Vitacura</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="580" style="height: 58%;">
                                    <span class="bar-value">580K</span>
                                </div>
                                <span class="bar-label">Ñuñoa</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="520" style="height: 52%;">
                                    <span class="bar-value">520K</span>
                                </div>
                                <span class="bar-label">Santiago</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="480" style="height: 48%;">
                                    <span class="bar-value">480K</span>
                                </div>
                                <span class="bar-label">Maipú</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="420" style="height: 42%;">
                                    <span class="bar-value">420K</span>
                                </div>
                                <span class="bar-label">La Florida</span>
                            </div>
                            
                            <div class="bar-group">
                                <div class="bar" data-value="380" style="height: 38%;">
                                    <span class="bar-value">380K</span>
                                </div>
                                <span class="bar-label">Puente Alto</span>
                            </div>
                        </div>
                        
                        <!-- Chart Y-axis labels -->
                        <div class="chart-y-axis">
                            <span class="y-label">1M</span>
                            <span class="y-label">800K</span>
                            <span class="y-label">600K</span>
                            <span class="y-label">400K</span>
                            <span class="y-label">200K</span>
                            <span class="y-label">0</span>
                        </div>
                    </div>
                    
                    <!-- Chart Legend -->
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color"></div>
                            <span>Ingresos Totales</span>
                        </div>
                        <div class="chart-summary">
                            <span class="summary-text">Total: 4.62M | Promedio: 577K</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activity -->

            
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

    /* Chart Section Styles */
    .chart-section {
        margin: 3rem 0;
        padding: 2rem;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .chart-section h2 {
        color: var(--text-primary);
        margin: 0 0 0.5rem 0;
        font-size: 1.75rem;
        font-weight: 600;
    }

    .chart-header {
        margin-bottom: 2rem;
    }

    .chart-subtitle {
        color: var(--muted);
        margin: 0;
        font-size: 0.95rem;
    }

    .chart-container {
        position: relative;
    }

    .bar-chart {
        position: relative;
        display: flex;
        align-items: flex-end;
        height: 320px;
        padding: 20px 60px 60px 60px;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .chart-bars {
        display: flex;
        align-items: flex-end;
        gap: 1.5rem;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .bar-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    .bar {
        width: 100%;
        max-width: 60px;
        background: linear-gradient(180deg, var(--accent), #08ad6e);
        border-radius: 4px 4px 0 0;
        transition: all 0.3s ease;
        position: relative;
        cursor: pointer;
        min-height: 10px;
        box-shadow: 0 4px 15px rgba(17, 194, 203, 0.3);
    }

    .bar:hover {
        background: linear-gradient(180deg, #13d4de, #0ac471);
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(17, 194, 203, 0.4);
    }

    .bar-value {
        position: absolute;
        top: -25px;
        left: 50%;
        transform: translateX(-50%);
        color: var(--text-primary);
        font-size: 0.8rem;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.3s ease;
        white-space: nowrap;
    }

    .bar:hover .bar-value {
        opacity: 1;
    }

    .bar-label {
        margin-top: 10px;
        color: var(--muted);
        font-size: 0.8rem;
        text-align: center;
        transform: rotate(-45deg);
        transform-origin: center;
        white-space: nowrap;
        min-width: 80px;
    }

    .chart-y-axis {
        position: absolute;
        left: 10px;
        top: 20px;
        bottom: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
    }

    .y-label {
        color: var(--muted);
        font-size: 0.75rem;
        padding-right: 10px;
    }

    .chart-legend {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .legend-color {
        width: 16px;
        height: 16px;
        background: linear-gradient(90deg, var(--accent), #08ad6e);
        border-radius: 3px;
    }

    .legend-item span {
        color: var(--muted);
        font-size: 0.9rem;
    }

    .chart-summary {
        color: var(--text-primary);
        font-size: 0.9rem;
        font-weight: 500;
    }

    .summary-text {
        background: rgba(255, 255, 255, 0.05);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
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
        
        /* Mobile chart styles */
        .chart-section {
            margin: 2rem 0;
            padding: 1.5rem 1rem;
        }
        
        .chart-section h2 {
            font-size: 1.5rem;
        }
        
        .bar-chart {
            height: 280px;
            padding: 15px 40px 80px 40px;
        }
        
        .chart-bars {
            gap: 0.8rem;
        }
        
        .bar {
            max-width: 40px;
        }
        
        .bar-label {
            font-size: 0.7rem;
            min-width: 60px;
        }
        
        .chart-y-axis {
            left: 5px;
        }
        
        .y-label {
            font-size: 0.7rem;
            padding-right: 5px;
        }
        
        .chart-legend {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .chart-summary {
            align-self: stretch;
            text-align: center;
        }
        
        .summary-text {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
        }
    }
</style>
@endsection

