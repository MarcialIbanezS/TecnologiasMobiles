# Manual de Uso — Ejecutar la aplicación Laravel por primera vez

Este documento explica los pasos mínimos para poner en marcha la aplicación Laravel en un entorno de desarrollo.

## Requisitos
- PHP >= 8.x (según versión del proyecto)
- PHP extension: GRPC
    Tutorial Windows: https://www.php.net/manual/en/install.pecl.windows.php 
    - https://grpc.io/docs/languages/php/quickstart/
    - https://docs.cloud.google.com/php/docs/reference/help/grpc 

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
cd appLaravel
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
- MAIL_*, REDIS_*

**Database Configuration**
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=<Nombre Base de datos>
DB_USERNAME=<nombre usuario>
DB_PASSWORD=<clave usuario>

**Google OAuth Configuration**
GOOGLE_CLIENT_ID=264276022373-f68e3gjlpi3ar4fnpbm3kv4je5u4vs58.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"

**Firebase Firestore**
```bash
#
FIREBASE_PROJECT=appLaravel
FIREBASE_CREDENTIALS=laravel_keys.json
FIREBASE_PROJECT_ID=appmoviles-b5003
```
**Las credenciales de Firebase no se incluyen en el repositorio, se adjunta con la entrega**
**Dejela dentro del root de Laravel ()**

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
- Si le dice "the requested client requires the gRPC extension". Entonces tiene que ir a su php.ini
    -cmd:   php --ini   #para encontrar la ruta de su php.ini
    -ingrese a este archivo y agregue "extension=grpc"
- Errores de conexion: revisar las credenciales de laravel_keys.json estan configuradas. 
    - En caso de que el error persista, comunicarse con nosotros.


Fin.  