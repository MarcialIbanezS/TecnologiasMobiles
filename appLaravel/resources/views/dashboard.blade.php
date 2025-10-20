<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Dashboard</title>
		<style>
			:root{--bg:#0f1724;--card:#0b1220;--accent:#4f46e5;--muted:#9aa4b2}
			html,body{height:100%;margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
			body{background:linear-gradient(180deg,#071128 0%,var(--bg) 100%);color:#e6eef8;display:flex;align-items:center;justify-content:center}
			.container{max-width:980px;padding:48px;box-sizing:border-box}
			.card{background:linear-gradient(180deg, rgba(246, 0, 74, 0.02), rgba(171, 9, 9, 0.01));border:1px solid rgba(255, 179, 179, 0.04);padding:36px;border-radius:12px;box-shadow:0 10px 30px rgba(255, 0, 102, 0.6)}
			h1{margin:0 0 12px 0;font-size:2.25rem;line-height:1.05}
			p.lead{margin:0 0 20px 0;color:var(--muted);font-size:1rem}
			.buttons{display:flex;gap:12px}
			.btn{display:inline-block;padding:10px 16px;border-radius:8px;text-decoration:none;color:white;font-weight:600}
			.btn-primary{background:linear-gradient(90deg,var(--accent),#7c3aed)}
			.btn-ghost{background:transparent;border:1px solid rgba(0, 255, 123, 0.06);color:#cfe6ff}
			footer{margin-top:20px;color:var(--muted);font-size:0.9rem}
			@media (max-width:640px){.container{padding:20px}h1{font-size:1.6rem}}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="card">
				<h1>Triple M.A.</h1>
				<p class="lead">Dashboard del proyecto Wohoo!!</p>
				<div class="buttons">
					<a class="btn btn-primary" href="/home">Get started</a>
				</div>
				<footer>
					<p>TRIPLE M.A. <small>October 2025</small></p>
				</footer>
			</div>
		</div>
	</body>
</html>

