@extends('layouts.app')

@section('title', 'Inicio - Triple M.A.')

@section('page-content')
<div style="padding-top: 30rem;">
    <div class="container">
        <div class="card">
            <div class="hero-content">
                <h1>Triple M.A.</h1>
                <div class="image-container">
                <img src="{{ asset('images/medico_paziente.jpg') }}" alt="Medico Paziente" class="hero-image">
            </div>
                <p class="lead">Homepage del proyecto Wohoo!! Bienvenido a nuestra plataforma de tecnologías móviles.</p>
            </div>

            <div class="buttons">
                <a class="btn btn-primary" href="/home">Get Started</a>
                <a class="btn btn-ghost" href="/dashboard">Dashboard</a>
            </div>

            
        </div>
    </div>
</div>
@endsection