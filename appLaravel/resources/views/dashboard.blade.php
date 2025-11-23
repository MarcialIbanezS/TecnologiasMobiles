@extends('layouts.base')

@section('title', 'Dashboard - Triple M.A.')

@section('page-content')
<div style="padding: 0 0 2rem 0; ">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; ">
        <div class="card" style="background: #00b3a1ff;">
            <div class="hero-content">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-primary);">Dashboard</h1>
                <p class="lead" style="font-size: 1.125rem; color: var(--text-primary); margin-bottom: 2rem; max-width: none;">Bienvenido al panel de control de Triple M.A. Aquí puedes gestionar todos los aspectos de tu aplicación médica.</p>
            </div>

            @if(isset($error))
            <div class="alert alert-error" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #f87171; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                <strong>Error:</strong> {{ $error }}
            </div>
            @endif

            <!-- Dashboard Stats -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-content">
                        <h3>Pacientes</h3>
                        <p class="stat-number">{{ number_format($totalPacientes ?? 0) }}</p>
                        <p class="stat-label">Total pacientes registrados</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3>Fichas</h3>
                        <p class="stat-number">{{ number_format($fichasThisYear ?? 0) }}</p>
                        <p class="stat-label">Fichas creadas este año</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <h3>Condición Común</h3>
                        <p class="stat-number" style="font-size: 1.2rem;">{{ $mostCommonCronico ?? 'N/A' }}</p>
                        <p class="stat-label">Más frecuente</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">🏥</div>
                    <div class="stat-content">
                        <h3>Total Fichas</h3>
                        <p class="stat-number">{{ number_format($totalFichas ?? 0) }}</p>
                        <p class="stat-label">Todas las fichas médicas</p>
                    </div>
                </div>
            </div>

            <!-- Ingresos por Comuna Chart -->
            <div class="chart-section" style="background: #006f64bc;">
                <h2>Distribución de Fichas por Alergia</h2>
                <div class="chart-container">
                    <div class="chart-header">
                        <p class="chart-subtitle">Fichas médicas clasificadas por tipo de alergia</p>
                    </div>
                    
                    @php
                        $alergiaChartData = $alergiaChartData ?? [];
                        $maxValue = !empty($alergiaChartData) ? max($alergiaChartData) : 1;
                        $totalAlergias = array_sum($alergiaChartData);
                        $avgAlergias = $totalAlergias > 0 && count($alergiaChartData) > 0 ? round($totalAlergias / count($alergiaChartData)) : 0;
                    @endphp
                    
                    @if(!empty($alergiaChartData))
                    <div class="bar-chart">
                        <div class="chart-bars">
                            @foreach($alergiaChartData as $alergia => $count)
                            <div class="bar-group">
                                <div class="bar" data-value="{{ $count }}" style="height: {{ $maxValue > 0 ? ($count / $maxValue * 100) : 0 }}%;">
                                    <span class="bar-value">{{ $count }}</span>
                                </div>
                                <span class="bar-label">{{ $alergia }}</span>
                            </div>
                            @endforeach
                        </div>
                        
                        <!-- Chart Y-axis labels -->
                        <div class="chart-y-axis">
                            <span class="y-label">{{ $maxValue }}</span>
                            <span class="y-label">{{ round($maxValue * 0.8) }}</span>
                            <span class="y-label">{{ round($maxValue * 0.6) }}</span>
                            <span class="y-label">{{ round($maxValue * 0.4) }}</span>
                            <span class="y-label">{{ round($maxValue * 0.2) }}</span>
                            <span class="y-label">0</span>
                        </div>
                    </div>
                    
                    <!-- Chart Legend -->
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color"></div>
                            <span>Fichas con Alergias</span>
                        </div>
                        <div class="chart-summary">
                            <span class="summary-text">Total: {{ number_format($totalAlergias) }} | Promedio: {{ number_format($avgAlergias) }}</span>
                        </div>
                    </div>
                    @else
                    <div class="empty-chart">
                        <p style="text-align: center; color: var(--muted); padding: 3rem;">No hay datos de alergias disponibles</p>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Chronic Diseases Chart -->
            <div class="chart-section" style="background: #006f64bc;">
                <h2>Distribución de Fichas por Enfermedad Crónica</h2>
                <div class="chart-container">
                    <div class="chart-header">
                        <p class="chart-subtitle">Fichas médicas clasificadas por enfermedad crónica</p>
                    </div>
                    
                    @php
                        $cronicoChartData = $cronicoChartData ?? [];
                        $maxValueCronico = !empty($cronicoChartData) ? max($cronicoChartData) : 1;
                        $totalCronicos = array_sum($cronicoChartData);
                        $avgCronicos = $totalCronicos > 0 && count($cronicoChartData) > 0 ? round($totalCronicos / count($cronicoChartData)) : 0;
                    @endphp
                    
                    @if(!empty($cronicoChartData))
                    <div class="bar-chart">
                        <div class="chart-bars">
                            @foreach($cronicoChartData as $cronico => $count)
                            <div class="bar-group">
                                <div class="bar bar-cronico" data-value="{{ $count }}" style="height: {{ $maxValueCronico > 0 ? ($count / $maxValueCronico * 100) : 0 }}%;">
                                    <span class="bar-value">{{ $count }}</span>
                                </div>
                                <span class="bar-label">{{ $cronico }}</span>
                            </div>
                            @endforeach
                        </div>
                        
                        <!-- Chart Y-axis labels -->
                        <div class="chart-y-axis">
                            <span class="y-label">{{ $maxValueCronico }}</span>
                            <span class="y-label">{{ round($maxValueCronico * 0.8) }}</span>
                            <span class="y-label">{{ round($maxValueCronico * 0.6) }}</span>
                            <span class="y-label">{{ round($maxValueCronico * 0.4) }}</span>
                            <span class="y-label">{{ round($maxValueCronico * 0.2) }}</span>
                            <span class="y-label">0</span>
                        </div>
                    </div>
                    
                    <!-- Chart Legend -->
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: linear-gradient(90deg, #ff6b6b, #ff8c42);"></div>
                            <span>Fichas con Enfermedades Crónicas</span>
                        </div>
                        <div class="chart-summary">
                            <span class="summary-text">Total: {{ number_format($totalCronicos) }} | Promedio: {{ number_format($avgCronicos) }}</span>
                        </div>
                    </div>
                    @else
                    <div class="empty-chart">
                        <p style="text-align: center; color: var(--muted); padding: 3rem;">No hay datos de enfermedades crónicas disponibles</p>
                    </div>
                    @endif
                </div>
            </div>

            <!-- Operations Chart -->
            <div class="chart-section" style="background: #006f64bc;">
                <h2>Distribución de Fichas por Operación</h2>
                <div class="chart-container">
                    <div class="chart-header">
                        <p class="chart-subtitle">Fichas médicas clasificadas por tipo de operación</p>
                    </div>
                    
                    @php
                        $operacionChartData = $operacionChartData ?? [];
                        $maxValueOperacion = !empty($operacionChartData) ? max($operacionChartData) : 1;
                        $totalOperaciones = array_sum($operacionChartData);
                        $avgOperaciones = $totalOperaciones > 0 && count($operacionChartData) > 0 ? round($totalOperaciones / count($operacionChartData)) : 0;
                    @endphp
                    
                    @if(!empty($operacionChartData))
                    <div class="bar-chart">
                        <div class="chart-bars">
                            @foreach($operacionChartData as $operacion => $count)
                            <div class="bar-group">
                                <div class="bar bar-operacion" data-value="{{ $count }}" style="height: {{ $maxValueOperacion > 0 ? ($count / $maxValueOperacion * 100) : 0 }}%;">
                                    <span class="bar-value">{{ $count }}</span>
                                </div>
                                <span class="bar-label">{{ $operacion }}</span>
                            </div>
                            @endforeach
                        </div>
                        
                        <!-- Chart Y-axis labels -->
                        <div class="chart-y-axis">
                            <span class="y-label">{{ $maxValueOperacion }}</span>
                            <span class="y-label">{{ round($maxValueOperacion * 0.8) }}</span>
                            <span class="y-label">{{ round($maxValueOperacion * 0.6) }}</span>
                            <span class="y-label">{{ round($maxValueOperacion * 0.4) }}</span>
                            <span class="y-label">{{ round($maxValueOperacion * 0.2) }}</span>
                            <span class="y-label">0</span>
                        </div>
                    </div>
                    
                    <!-- Chart Legend -->
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background: linear-gradient(90deg, #4c6ef5, #7873f5);"></div>
                            <span>Fichas con Operaciones</span>
                        </div>
                        <div class="chart-summary">
                            <span class="summary-text">Total: {{ number_format($totalOperaciones) }} | Promedio: {{ number_format($avgOperaciones) }}</span>
                        </div>
                    </div>
                    @else
                    <div class="empty-chart">
                        <p style="text-align: center; color: var(--muted); padding: 3rem;">No hay datos de operaciones disponibles</p>
                    </div>
                    @endif
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
        background: rgba(11, 18, 32, 0.6);
        padding: 1.5rem;
        border-radius: 12px;
        border: 1px solid rgba(17, 194, 203, 0.2);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(17, 194, 203, 0.2);
        background: rgba(11, 18, 32, 0.8);
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
        color: #a0d8d4;
        margin: 0;
        font-size: 0.85rem;
        font-weight: 500;
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
        width: 100%;
        max-width: 100%;
        overflow: hidden;
        box-sizing: border-box;
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
        color: #c0e8e4;
        margin: 0;
        font-size: 0.95rem;
        font-weight: 500;
    }

    .chart-container {
        position: relative;
        width: 100%;
        max-width: 100%;
        overflow: visible;
        z-index: 1;
    }

    .bar-chart {
        position: relative;
        display: flex;
        align-items: flex-end;
        height: 280px;
        width: 100%;
        max-width: 100%;
        padding: 15px 40px 50px 50px;
        background: rgba(11, 18, 32, 0.8);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: visible;
        box-sizing: border-box;
        z-index: 1;
    }

    .chart-bars {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        width: 100%;
        height: 100%;
        position: relative;
        flex-shrink: 1;
        min-width: 0;
    }

    .bar-group {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        min-width: 0;
        max-width: 80px;
    }

    .bar {
        width: 100%;
        max-width: 100%;
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
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(17, 194, 203, 0.95);
        color: #0b1220;
        font-size: 0.85rem;
        font-weight: 700;
        padding: 6px 12px;
        border-radius: 6px;
        opacity: 0;
        transition: opacity 0.2s ease;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(17, 194, 203, 0.4);
    }

    .bar-value::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid rgba(17, 194, 203, 0.95);
    }

    .bar:hover .bar-value {
        opacity: 1;
    }

    .bar-cronico {
        background: linear-gradient(180deg, #ff6b6b, #ff8c42);
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    }

    .bar-cronico:hover {
        background: linear-gradient(180deg, #ff5252, #ff7030);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }

    .bar-operacion {
        background: linear-gradient(180deg, #4c6ef5, #7873f5);
        box-shadow: 0 4px 15px rgba(76, 110, 245, 0.3);
    }

    .bar-operacion:hover {
        background: linear-gradient(180deg, #3d5ce0, #6661de);
        box-shadow: 0 6px 20px rgba(76, 110, 245, 0.4);
    }

    .bar-label {
        margin-top: 8px;
        color: #e0e7ff;
        font-size: 0.65rem;
        text-align: center;
        transform: rotate(-45deg);
        transform-origin: left top;
        white-space: nowrap;
        max-width: 100px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .chart-y-axis {
        position: absolute;
        left: 5px;
        top: 15px;
        bottom: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
    }

    .y-label {
        color: #d4d4e6;
        font-size: 0.65rem;
        padding-right: 8px;
        font-weight: 500;
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
        color: #d4e8f5;
        font-size: 0.9rem;
        font-weight: 500;
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

