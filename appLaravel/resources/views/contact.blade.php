@extends('layouts.base')

@section('title', 'Fichas Médicas - Triple M.A.')

@section('page-content')
<div style="padding: 2rem 0 2rem 0; ">
    <div class="container" style="max-width: 1400px; margin: 0 auto; padding: 0 1.5rem; ">
        
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
                    
                </div>
            </div>
        @endif

        <!-- Add New Ficha Form -->
        <div class="form-card" style="background: linear-gradient(180deg, rgba(0, 158, 147, 1), rgba(14, 148, 143, 0.75));">
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
                        <label for="fechaingreso" class="form-label">Fecha de Ingreso</label>
                        <input type="date" id="fechaingreso" name="fechaingreso" class="form-input" value="{{ date('Y-m-d') }}" required>
                    </div>

                    <div class="form-group">
                        <label for="idpaciente" class="form-label">Paciente</label>
                        <select id="idpaciente" name="idpaciente" class="form-input" required>
                            <option value="">Seleccione un paciente</option>
                            @foreach($pacienteOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }} (ID: {{ $id }})</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="idoperacion" class="form-label">Operación</label>
                        <select id="idoperacion" name="idoperacion" class="form-input">
                            <option value="">Sin operación</option>
                            @foreach($operacionOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="idcronico" class="form-label">Enfermedad Crónica</label>
                        <select id="idcronico" name="idcronico" class="form-input">
                            <option value="">Sin enfermedad crónica</option>
                            @foreach($cronicoOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }}</option>
                            @endforeach
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="idalergia" class="form-label">Alergia</label>
                        <select id="idalergia" name="idalergia" class="form-input">
                            <option value="">Sin alergia</option>
                            @foreach($alergiaOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }}</option>
                            @endforeach
                        </select>
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

        <!-- Search Specific Ficha Form -->
        <div class="form-card" style="background: linear-gradient(180deg, rgba(0, 158, 147, 1), rgba(14, 148, 143, 0.75));">
            <h2 class="form-title">
                <svg class="form-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Buscar Ficha Médica Específica
            </h2>
            <p style="color: var(--muted); margin-bottom: 1.5rem; font-size: 0.95rem;">
                Busca una ficha médica directamente desde la base de datos. Útil cuando hay más de 100 fichas registradas.
            </p>
            
            <form method="POST" action="{{ route('contact.search') }}" class="ficha-form">
                @csrf
                <div style="display: flex; gap: 1rem; align-items: flex-end;">
                    <div class="form-group" style="flex: 1; max-width: 500px;">
                        <label for="search_id" class="form-label">ID de Ficha Médica</label>
                        <input 
                            type="text" 
                            id="search_id" 
                            name="search_id" 
                            class="form-input" 
                            placeholder="Ej: 3299, 3300, etc." 
                            required
                            autocomplete="off"
                        >
                    </div>
                    <button type="submit" class="btn btn-primary" style="white-space: nowrap;">
                        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Buscar Ficha
                    </button>
                    <a href="{{ route('contact') }}" class="btn btn-secondary" style="white-space: nowrap;">
                        <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Limpiar Búsqueda
                    </a>
                </div>
            </form>
        </div>

        <!-- Data Table -->
        <div class="table-card" id="results-section" >
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
                </div>
            </div>

            @if(empty($fichasArray))
                <div class="empty-state">
                    <svg class="empty-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3>No se encontraron fichas médicas</h3>
                    <p>Aún no se han registrado fichas médicas en la base de datos, o hubo un error de conexión.</p>
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
                                <th>Acciones</th>
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
                                                <span style="font-weight: 500;">ID: {{ $ficha['idpaciente'] ?? 'N/A' }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="cell-diagnosis">
                                        @if($ficha['idoperacion'] ?? false)
                                        <div>{{ $ficha['idoperacion'] ?? 'N/A' }}</div>
                                        @endif
                                    </td>
                                    <td class="cell-diagnosis">
                                        @if($ficha['idcronico'] ?? false)
                                            <div>{{ $ficha['idcronico'] }}</div>
                                        @endif
                                    </td>
                                    <td class="cell-diagnosis">
                                        @if($ficha['idalergia'] ?? false)
                                            <div> {{ $ficha['idalergia']?? 'N/A' }}</div>
                                        @endif

                                    </td>
                                    <td class="cell-actions">
                                        <button class="btn-edit-ficha" onclick="openEditModal('{{ $ficha['idfichamedica'] ?? '' }}', this.closest('tr'))" title="Editar Ficha Médica">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="action-icon">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
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

<!-- Edit Ficha Modal -->
<div id="editFichaModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Editar Ficha Médica</h2>
            <button class="modal-close" onclick="closeEditModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="editFichaForm" class="edit-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">ID Ficha</label>
                        <input type="text" id="edit-id" class="form-input" readonly disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Fecha Ingreso</label>
                        <input type="date" id="edit-fecha" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Paciente</label>
                        <input type="text" id="edit-paciente" class="form-input" readonly disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ID Paciente</label>
                        <input type="text" id="edit-id-paciente" class="form-input" readonly disabled>
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Operación</label>
                        <select id="edit-operacion" class="form-input">
                            <option value="">Sin operación</option>
                            @foreach($operacionOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Enfermedad Crónica</label>
                        <select id="edit-cronico" class="form-input">
                            <option value="">Sin enfermedad crónica</option>
                            @foreach($cronicoOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Alergia</label>
                        <select id="edit-alergia" class="form-input">
                            <option value="">Sin alergia</option>
                            @foreach($alergiaOptions ?? [] as $id => $nombre)
                                <option value="{{ $id }}">{{ $nombre }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descripción Alergia</label>
                        <textarea id="edit-alergia-desc" class="form-input" style="resize: vertical;"></textarea>
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn-delete-ficha" onclick="deleteEditFicha()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 20px; height: 20px; margin-right: 0.5rem;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                ELIMINAR FICHA
            </button>
            <div style="display: flex; gap: 0.75rem; margin-left: auto;">
                <button class="btn-secondary" onclick="closeEditModal()">Cancelar</button>
                <button class="btn-primary" onclick="saveEditedFicha()">Guardar Cambios</button>
            </div>
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

    .btn-secondary {
        display: inline-flex;
        align-items: center;
        padding: 0.875rem 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
        font-size: 0.95rem;
        font-weight: 500;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    /* Table Card */
    .table-card {
        background: linear-gradient(180deg, rgba(0, 158, 147, 1), rgba(14, 148, 90, 1));
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

    /* Edit Button */
    .cell-actions {
        text-align: center;
        padding: 1rem !important;
    }

    .btn-edit-ficha {
        background: rgba(17, 194, 203, 0.15);
        border: 1px solid rgba(17, 194, 203, 0.3);
        color: var(--accent);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0;
    }

    .btn-edit-ficha:hover {
        background: rgba(17, 194, 203, 0.25);
        border-color: var(--accent);
        transform: scale(1.1);
    }

    .action-icon {
        width: 20px;
        height: 20px;
    }

    /* Modal Styles */
    .modal {
        display: none;
        position: fixed;
        z-index: 2000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        animation: fadeIn 0.3s ease;
    }

    .modal.active {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .modal-content {
        background: linear-gradient(180deg, rgba(11, 18, 32, 0.95), rgba(11, 18, 32, 0.98));
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
        from {
            transform: translateY(-50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-header h2 {
        color: var(--text-primary);
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .modal-close {
        background: none;
        border: none;
        color: var(--muted);
        font-size: 1.75rem;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }

    .modal-close:hover {
        color: var(--text-primary);
        transform: rotate(90deg);
    }

    .modal-body {
        padding: 2rem;
    }

    .modal-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-delete-ficha {
        display: inline-flex;
        align-items: center;
        padding: 0.875rem 1.5rem;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border: 2px solid #991b1b;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
    }

    .btn-delete-ficha:hover {
        background: linear-gradient(135deg, #dc2626, #b91c1c);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(239, 68, 68, 0.6);
        border-color: #7f1d1d;
    }

    .btn-delete-ficha:active {
        transform: translateY(0);
    }

    .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .edit-form .form-grid {
        gap: 1rem;
    }

    .edit-form .form-input {
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        color: #f0f4f8;
        font-size: 0.9rem;
        font-family: inherit;
        transition: all 0.3s ease;
    }

    .edit-form .form-input:focus {
        outline: none;
        border-color: var(--accent);
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 0 3px rgba(17, 194, 203, 0.1);
    }

    .edit-form .form-input:disabled {
        background: rgba(255, 255, 255, 0.02);
        color: #a8b4c0;
        cursor: not-allowed;
    }

    /* Fix dropdown option colors */
    .edit-form select.form-input option {
        background: #1a202c;
        color: #f0f4f8;
        padding: 0.5rem;
    }

    .edit-form select.form-input option:checked,
    .edit-form select.form-input option:hover {
        background: #2d3748;
        color: #f0f4f8;
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
            color: var(--muted);
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

        .modal-content {
            width: 95%;
            max-height: 85vh;
        }

        .modal-header {
            padding: 1.5rem;
        }

        .modal-body,
        .modal-footer {
            padding: 1.5rem;
        }
    }
</style>

<script>
    function openEditModal(fichaId, tableRow) {
        const modal = document.getElementById('editFichaModal');
        
        // Get data from the table row
        const cells = tableRow.querySelectorAll('td');
        const idFicha = cells[0]?.innerText.trim() || fichaId;
        const fechaIngreso = cells[1]?.innerText.trim() || '';
        const paciente = cells[2]?.innerText.trim() || '';
        const idPaciente = cells[2]?.querySelector('small')?.innerText?.replace('ID: ', '') || '';
        const operacionId = cells[3]?.innerText.trim() || '';
        const cronicoId = cells[4]?.innerText.trim() || '';
        const alergiaId = cells[5]?.innerText.trim() || '';
        
        // Populate form fields
        document.getElementById('edit-id').value = idFicha;
        document.getElementById('edit-fecha').value = fechaIngreso;
        document.getElementById('edit-paciente').value = paciente.split('\n')[0];
        document.getElementById('edit-id-paciente').value = idPaciente;
        
        // Set dropdown selections
        const operacionSelect = document.getElementById('edit-operacion');
        const cronicoSelect = document.getElementById('edit-cronico');
        const alergiaSelect = document.getElementById('edit-alergia');
        
        // Try to match the dropdown values by ID or text
        setSelectValue(operacionSelect, operacionId);
        setSelectValue(cronicoSelect, cronicoId);
        setSelectValue(alergiaSelect, alergiaId);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Helper function to set select value by ID or text match
    function setSelectValue(selectElement, value) {
        if (!value || value === 'N/A') {
            selectElement.value = '';
            return;
        }
        
        // First try to find exact value match (ID)
        if (selectElement.querySelector(`option[value="${value}"]`)) {
            selectElement.value = value;
            return;
        }
        
        // If no exact match, try to find by text content
        const options = selectElement.querySelectorAll('option');
        for (let option of options) {
            if (option.textContent.trim() === value.trim()) {
                selectElement.value = option.value;
                return;
            }
        }
        
        // If still no match, leave it empty
        selectElement.value = '';
    }

    function closeEditModal() {
        const modal = document.getElementById('editFichaModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function saveEditedFicha() {
        const fichaId = document.getElementById('edit-id').value;
        const fechaIngreso = document.getElementById('edit-fecha').value;
        const operacion = document.getElementById('edit-operacion').value;
        const cronico = document.getElementById('edit-cronico').value;
        const alergia = document.getElementById('edit-alergia').value;
        const alergiaDesc = document.getElementById('edit-alergia-desc').value;
        
        // Get CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        // Show loading state
        const saveBtn = event.target;
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Guardando...';
        saveBtn.disabled = true;
        
        // Send PUT request to update endpoint
        fetch(`/contact/${fichaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                fechaingreso: fechaIngreso,
                idoperacion: operacion,
                idcronico: cronico,
                idalergia: alergia,
                alergia_descripcion: alergiaDesc
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('✓ ' + data.message);
                closeEditModal();
                // Refresh the page to show updated data
                setTimeout(() => {
                    location.reload();
                }, 500);
            } else {
                alert('Error: ' + (data.message || 'No se pudo actualizar la ficha médica'));
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de conexión al actualizar la ficha médica');
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
        });
    }

    function deleteEditFicha() {
        const fichaId = document.getElementById('edit-id').value;
        const confirmDelete = confirm('¿ESTÁS SEGURO DE QUE QUIERES ELIMINAR ESTA FICHA MÉDICA?\n\nID Ficha: ' + fichaId + '\n\nEsta acción NO se puede deshacer.');
        
        if (confirmDelete) {
            // Get CSRF token
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            // Show loading state
            const deleteBtn = event.target.closest('button');
            const originalHTML = deleteBtn.innerHTML;
            deleteBtn.innerHTML = '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 0.5rem;">⌛</span>ELIMINANDO...';
            deleteBtn.disabled = true;
            
            // Send DELETE request
            fetch(`/contact/${fichaId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('✓ ' + data.message);
                    closeEditModal();
                    // Refresh the page to update the table
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                } else {
                    alert('Error: ' + (data.message || 'No se pudo eliminar la ficha médica'));
                    deleteBtn.innerHTML = originalHTML;
                    deleteBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión al eliminar la ficha médica');
                deleteBtn.innerHTML = originalHTML;
                deleteBtn.disabled = false;
            });
        }
    }

    // Close modal when clicking outside the content
    document.addEventListener('DOMContentLoaded', function() {
        const modal = document.getElementById('editFichaModal');
        if (modal) {
            modal.addEventListener('click', function(event) {
                if (event.target === modal) {
                    closeEditModal();
                }
            });
        }
    });

    // Allow Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeEditModal();
        }
    });

    // Auto-scroll to results section on successful search
    @if(session('success') && str_contains(session('success'), 'encontrada'))
        document.addEventListener('DOMContentLoaded', function() {
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) {
                setTimeout(function() {
                    resultsSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 300); // Small delay to ensure page is fully loaded
            }
        });
    @endif
</script>
@endsection