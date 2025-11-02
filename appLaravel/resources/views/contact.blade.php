@extends('layouts.base')

@section('title', 'Fichas Médicas - Triple M.A.')

@section('page-content')
<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem;">
        
        <!-- Page Header -->
        <div class="page-header">
            <h1 class="page-title">Fichas Médicas</h1>
            <p class="page-subtitle">Gestión y visualización de datos médicos desde Firebase</p>
        </div>

        <!-- Success/Error Messages -->
        @if(session('success'))
            <div class="alert alert-success">
                <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ session('success') }}
            </div>
        @endif

        @if(session('error') || isset($error))
            <div class="alert alert-error">
                <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <div><strong>Error:</strong> {{ session('error') ?? $error }}</div>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">
                        <strong>Debug Info:</strong><br>
                        - Credentials file expected at: {{ base_path(env('FIREBASE_CREDENTIALS')) }}<br>
                        - File exists: {{ file_exists(base_path(env('FIREBASE_CREDENTIALS'))) ? 'YES' : 'NO' }}<br>
                        - Database URL: {{ env('FIREBASE_DATABASE_URL') }}<br>
                        - Firebase Project: {{ env('FIREBASE_PROJECT') }}
                    </div>
                </div>
            </div>
        @endif

        <!-- Add New Ficha Form -->
        <div class="form-card">
            <h2 class="form-title">
                <svg class="form-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar Nueva Ficha Médica
            </h2>
            
            <form method="POST" action="{{ route('contact.store') }}" class="ficha-form">
                @csrf
                <div class="form-grid">
                    <div class="form-group">
                        <label for="idfichamedica" class="form-label">ID Ficha Médica</label>
                        <input type="text" id="idfichamedica" name="idfichamedica" class="form-input" placeholder="Ingrese el ID de la ficha" required>
                    </div>

                    <div class="form-group">
                        <label for="fechaingreso" class="form-label">Fecha de Ingreso</label>
                        <input type="date" id="fechaingreso" name="fechaingreso" class="form-input" value="{{ date('Y-m-d') }}" required>
                    </div>

                    <div class="form-group">
                        <label for="idpaciente" class="form-label">ID Paciente</label>
                        <input type="text" id="idpaciente" name="idpaciente" class="form-input" placeholder="Ingrese el ID del paciente" required>
                    </div>

                    <div class="form-group">
                        <label for="idoperacion" class="form-label">ID Operación</label>
                        <input type="text" id="idoperacion" name="idoperacion" class="form-input" placeholder="ID de operación (opcional)">
                    </div>

                    <div class="form-group">
                        <label for="idcronico" class="form-label">ID Crónico</label>
                        <input type="text" id="idcronico" name="idcronico" class="form-input" placeholder="ID de enfermedad crónica (opcional)">
                    </div>

                    <div class="form-group">
                        <label for="idalergia" class="form-label">ID Alergia</label>
                        <input type="text" id="idalergia" name="idalergia" class="form-input" placeholder="ID de alergia (opcional)">
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Guardar Ficha
                    </button>
                </div>
            </form>
        </div>

        <!-- Data Table -->
        <div class="table-card">
            <div class="table-header">
                <h2 class="table-title">
                    <svg class="table-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Fichas Médicas Registradas
                </h2>
                <div class="table-stats">
                    <span class="stats-badge">
                        Total: {{ count($fichasArray ?? []) }} fichas
                    </span>
                </div>
            </div>

            @if(empty($fichasArray))
                <div class="empty-state">
                    <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>No hay fichas médicas</h3>
                    <p>Aún no se han registrado fichas médicas en la base de datos.</p>
                </div>
            @else
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID Ficha Médica</th>
                                <th>Fecha de Ingreso</th>
                                <th>ID Paciente</th>
                                <th>ID Operación</th>
                                <th>ID Crónico</th>
                                <th>ID Alergia</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($fichasArray as $ficha)
                                <tr class="table-row">
                                    <td class="cell-id">{{ $ficha['idfichamedica'] ?? 'N/A' }}</td>
                                    <td class="cell-date">{{ $ficha['fechaingreso'] ?? 'N/A' }}</td>
                                    <td class="cell-name">
                                        <div class="patient-info">
                                            <div class="patient-avatar">👤</div>
                                            <span>{{ $ficha['idpaciente'] ?? 'Sin paciente' }}</span>
                                        </div>
                                    </td>
                                    <td class="cell-diagnosis">{{ $ficha['idoperacion'] ?? 'N/A' }}</td>
                                    <td class="cell-diagnosis">{{ $ficha['idcronico'] ?? 'N/A' }}</td>
                                    <td class="cell-diagnosis">{{ $ficha['idalergia'] ?? 'N/A' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif
        </div>

    </div>
</div>
@endsection

@section('styles')
<style>
    /* Page Layout */
    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .page-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 1rem;
        background: linear-gradient(135deg, var(--text-primary), var(--accent));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .page-subtitle {
        font-size: 1.2rem;
        color: var(--muted);
        max-width: 600px;
        margin: 0 auto;
    }

    /* Alert Styles */
    .alert {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        font-weight: 500;
    }

    .alert-success {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.2);
        color: #4ade80;
    }

    .alert-error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        color: #f87171;
    }

    .alert-icon {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    }

    /* Form Card */
    .form-card {
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.04);
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        margin-bottom: 3rem;
    }

    .form-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 2rem;
    }

    .form-icon {
        width: 24px;
        height: 24px;
        color: var(--accent);
    }

    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-label {
        color: var(--text-primary);
        font-weight: 500;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .form-input {
        padding: 0.875rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.95rem;
        transition: all 0.3s ease;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 3px rgba(17, 194, 203, 0.1);
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
    }

    .btn-icon {
        width: 18px;
        height: 18px;
        margin-right: 0.5rem;
    }

    /* Table Card */
    .table-card {
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(2,6,23,0.6);
        overflow: hidden;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .table-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
    }

    .table-icon {
        width: 24px;
        height: 24px;
        color: var(--accent);
    }

    .stats-badge {
        background: rgba(17, 194, 203, 0.1);
        color: var(--accent);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--muted);
    }

    .empty-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem auto;
        opacity: 0.5;
    }

    .empty-state h3 {
        color: var(--text-primary);
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
    }

    .empty-state p {
        font-size: 1rem;
        line-height: 1.5;
    }

    /* Table Styles */
    .table-container {
        overflow-x: auto;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
    }

    .data-table th {
        background: rgba(255, 255, 255, 0.02);
        color: var(--text-primary);
        font-weight: 600;
        font-size: 0.9rem;
        padding: 1rem 1.5rem;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .data-table td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        color: var(--muted);
        font-size: 0.9rem;
    }

    .table-row:hover {
        background: rgba(255, 255, 255, 0.02);
    }

    .cell-id {
        font-family: monospace;
        font-size: 0.8rem;
        color: var(--accent);
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .patient-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .patient-avatar {
        width: 32px;
        height: 32px;
        background: rgba(17, 194, 203, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
    }

    .cell-name {
        color: var(--text-primary);
        font-weight: 500;
    }

    .age-badge {
        background: rgba(255, 255, 255, 0.05);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .cell-diagnosis {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
        .page-title {
            font-size: 2.5rem;
        }

        .form-card, .table-header {
            padding: 1.5rem;
        }

        .form-grid {
            grid-template-columns: 1fr;
        }

        .table-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .data-table {
            font-size: 0.8rem;
        }

        .data-table th,
        .data-table td {
            padding: 0.75rem 1rem;
        }

        /* Mobile header spacing fix */
        div[style*="padding: 6rem 0 2rem 0"] {
            padding: 4rem 0 2rem 0 !important;
            margin-top: 1rem !important;
        }
    }
</style>
@endsection