@extends('layouts.base')

@section('title', 'Inicio - Triple M.A.')

@section('page-content')
<div style="padding: 6rem 0 2rem 0; margin-top: 2rem;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
        <div class="card" style="background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 0px solid rgba(255,255,255,0.04);  border-radius: 0px;  margin-bottom: 2rem;">
            <div class="hero-content">
                <h1>Triple M.A.</h1>
                <div class="image-container">
                <img src="{{ asset('images/medico_paziente.jpg') }}" alt="Medico Paziente" class="hero-image">
            </div>
                <p class="lead">Homepage del proyecto Wohoo!! Bienvenido a nuestra plataforma de visualización de datos de Fichas Médicas.</p>
            </div>

            <div class="buttons">
                <a class="btn btn-primary" href="/home">Get Started</a>
                <a class="btn btn-ghost" href="/dashboard">Dashboard</a>
            </div> 
        </div>
    </div>
</div>
@endsection