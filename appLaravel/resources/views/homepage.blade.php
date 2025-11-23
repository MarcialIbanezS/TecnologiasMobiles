@extends('layouts.base')

@section('title', 'Inicio - Triple M.A.')

@section('page-content')
<div style="padding: 2rem 0 2rem 0; ">
    <div class="container" style="max-width: 1200px; margin: 0 auto;">
        <div class="card" style="background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));    ">
            <div class="hero-content">
                </div>
                    <p class="lead">Bienvenido a nuestra plataforma de visualización de datos de Fichas Médicas.</p>
                </div>
                <div class="buttons">
                    <a class="btn btn-primary" href="/dashboard">Dashboard</a>
                    <a class="btn btn-primary" href="/contact">Editar Fichas</a>

                </div> 

                <div class="image-container">
                    <img src="{{ asset('images/medico_paziente.jpg') }}" alt="Medico Paziente" class="hero-image">
            

            
                </div>
    </div>
</div>
@endsection