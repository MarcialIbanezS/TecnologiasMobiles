# README — Ejecutar la aplicación Laravel por primera vez

Este documento explica los pasos mínimos para poner en marcha la aplicación Laravel en un entorno de desarrollo.

## Requisitos
- PHP >= 8.x (según versión del proyecto)
- Composer
- Node.js + npm o Yarn
- Base de datos MySQL
- Git (opcional)
- Firebase: Firestore Database (opcional, se puede conectar a la nuestra).

## Pasos rápidos

1. Clonar repositorio (si aplica)
```bash
git clone <repo-url> proyecto
cd proyecto
```

2. Copiar archivo de entorno y configurar
```bash
cp .env.example .env
# En Windows PowerShell:
# copy .env.example .env
```
Editar `.env` y ajustar:
- APP_NAME, APP_URL
- DB_CONNECTION, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- MAIL_*, REDIS_*, etc. según necesidad

3. Instalar dependencias PHP
```bash
composer install --no-interaction --prefer-dist
```

4. Generar clave de aplicación
```bash
php artisan key:generate
```

5. Instalar dependencias de frontend y compilar
```bash
npm install
# o
yarn

npm run dev
# o para producción
npm run build
```

6. Migrar base de datos y ejecutar seeders (si aplica)
```bash
php artisan migrate
php artisan db:seed   # opcional
```

7. Crear enlace público a storage
```bash
php artisan storage:link
```

8. Permisos (Linux)
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```
(En Windows normalmente no es necesario ajustar permisos.)

9. Iniciar servidor de desarrollo
```bash
php artisan serve
# Visitar http://127.0.0.1:8000
```
Alternativas: configurar VirtualHost (Apache), Nginx, Homestead, Valet.

## Comandos útiles de mantenimiento
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## Solución de problemas rápida
- Si hay errores de migración, revisar credenciales DB en `.env`.
- Si cambios en `.env` no surten efecto: `php artisan config:clear`.
- Errores de permisos: ajustar ownership/permissions en `storage` y `bootstrap/cache`.

Fin.  