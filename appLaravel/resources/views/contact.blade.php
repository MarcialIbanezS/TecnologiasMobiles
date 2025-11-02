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
                    <span class="stats-badge" id="total-count">
                        Total: {{ count($fichasArray ?? []) }} fichas
                    </span>
                    <span class="stats-badge" id="filtered-count" style="display: none; background: rgba(255, 193, 7, 0.1); color: #ffc107;">
                        Mostrando: 0 fichas
                    </span>
                </div>
            </div>

            <!-- Search Box -->
            @if(!empty($fichasArray))
            <div class="search-container">
                <div class="search-box">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        id="searchInput" 
                        class="search-input" 
                        placeholder="Buscar por ID de Ficha Médica..."
                        autocomplete="off"
                    >
                    <button id="clearSearch" class="clear-btn" style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div id="searchResults" class="search-results"></div>
            </div>
            @endif

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
                                <th>ID Ficha</th>
                                <th>Fecha Ingreso</th>
                                <th>Paciente</th>
                                <th>Operación</th>
                                <th>Enfermedad Crónica</th>
                                <th>Alergia</th>
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
                                            <div>
                                                <span style="font-weight: 500;">{{ $ficha['paciente_nombre'] ?? 'Sin paciente' }}</span>
                                                <small style="display: block; opacity: 0.7; font-size: 0.8rem;">ID: {{ $ficha['idpaciente'] ?? 'N/A' }}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="cell-diagnosis">
                                        <div>{{ $ficha['operacion_nombre'] ?? 'N/A' }}</div>
                                        @if($ficha['idoperacion'] ?? false)
                                            <small style="opacity: 0.6;">ID: {{ $ficha['idoperacion'] }}</small>
                                        @endif
                                    </td>
                                    <td class="cell-diagnosis">
                                        <div>{{ $ficha['cronico_nombre'] ?? 'N/A' }}</div>
                                        @if($ficha['idcronico'] ?? false)
                                            <small style="opacity: 0.6;">ID: {{ $ficha['idcronico'] }}</small>
                                        @endif
                                    </td>
                                    <td class="cell-diagnosis">
                                        <div>{{ $ficha['alergia_nombre'] ?? 'N/A' }}</div>
                                        @if($ficha['alergia_descripcion'] && $ficha['alergia_descripcion'] != 'N/A')
                                            <small style="opacity: 0.7; font-style: italic;">{{ $ficha['alergia_descripcion'] }}</small>
                                        @endif
                                        @if($ficha['idalergia'] ?? false)
                                            <small style="opacity: 0.6; display: block;">ID: {{ $ficha['idalergia'] }}</small>
                                        @endif
                                    </td>
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

    /* Search Container */
    .search-container {
        padding: 1.5rem 2.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .search-box {
        position: relative;
        max-width: 500px;
    }

    .search-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        color: var(--muted);
        pointer-events: none;
    }

    .search-input {
        width: 100%;
        padding: 0.875rem 3rem 0.875rem 3rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        color: var(--text-primary);
        font-size: 0.95rem;
        transition: all 0.3s ease;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 3px rgba(17, 194, 203, 0.1);
    }

    .search-input::placeholder {
        color: var(--muted);
        opacity: 0.6;
    }

    .clear-btn {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(239, 68, 68, 0.1);
        border: none;
        padding: 0.4rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .clear-btn svg {
        width: 16px;
        height: 16px;
        color: #f87171;
    }

    .clear-btn:hover {
        background: rgba(239, 68, 68, 0.2);
    }

    .search-results {
        margin-top: 0.75rem;
        font-size: 0.9rem;
        color: var(--muted);
    }

    .table-row.hidden {
        display: none;
    }

    .highlight {
        background: rgba(255, 193, 7, 0.2);
        padding: 0.1rem 0.3rem;
        border-radius: 3px;
        font-weight: 600;
        color: #ffc107;
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

    .cell-rut {
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--accent);
    }

    .cell-diagnosis small {
        display: block;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }

    .cell-name > div > small {
        color: var(--muted);
        font-weight: 400;
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

        .table-stats {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .search-container {
            padding: 1rem 1.5rem;
        }

        .search-box {
            max-width: 100%;
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

<script>
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    const searchResults = document.getElementById('searchResults');
    const tableRows = document.querySelectorAll('.table-row');
    const totalCount = document.getElementById('total-count');
    const filteredCount = document.getElementById('filtered-count');
    const totalFichas = {{ count($fichasArray ?? []) }};

    if (!searchInput) return;

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        clearBtn.style.display = searchTerm ? 'flex' : 'none';

        if (searchTerm === '') {
            // Reset: show all rows
            tableRows.forEach(row => {
                row.classList.remove('hidden');
                // Remove highlights
                const cells = row.querySelectorAll('.cell-id');
                cells.forEach(cell => {
                    cell.innerHTML = cell.textContent;
                });
            });
            
            searchResults.innerHTML = '';
            totalCount.style.display = 'inline-block';
            filteredCount.style.display = 'none';
            return;
        }

        let matchCount = 0;

        tableRows.forEach(row => {
            const idCell = row.querySelector('.cell-id');
            const fichaId = idCell.textContent.toLowerCase();

            if (fichaId.includes(searchTerm)) {
                row.classList.remove('hidden');
                matchCount++;
                
                // Highlight matching text
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                idCell.innerHTML = idCell.textContent.replace(regex, '<span class="highlight">$1</span>');
            } else {
                row.classList.add('hidden');
                // Remove highlights
                idCell.innerHTML = idCell.textContent;
            }
        });

        // Update results message
        if (matchCount === 0) {
            searchResults.innerHTML = '<span style="color: #f87171;">⚠️ No se encontraron fichas con ese ID</span>';
        } else if (matchCount === 1) {
            searchResults.innerHTML = '<span style="color: #4ade80;">✓ Se encontró 1 ficha</span>';
        } else {
            searchResults.innerHTML = `<span style="color: #4ade80;">✓ Se encontraron ${matchCount} fichas</span>`;
        }

        // Update counter badges
        totalCount.style.display = 'none';
        filteredCount.style.display = 'inline-block';
        filteredCount.textContent = `Mostrando: ${matchCount} de ${totalFichas} fichas`;
    });

    // Clear search
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });

    // Allow Enter key to maintain search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    });
});
</script>
@endsection