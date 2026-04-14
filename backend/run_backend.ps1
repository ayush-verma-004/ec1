$env_file = Get-Content .env
foreach($line in $env_file) {
    if($line -match '^\s*([^#\s][^=]*)\s*=\s*(.*)$') {
        $name = $Matches[1].Trim()
        $value = $Matches[2].Trim()
        Set-Item -Path "Env:$name" -Value $value
        Write-Host "Set $name"
    }
}

# Force SPRING_DATA_MONGODB_URI and IPv4 stack
$env:SPRING_DATA_MONGODB_URI = $env:MONGO_URI
$env:JAVA_OPTS = "-Djava.net.preferIPv4Stack=true"

Write-Host "Set SPRING_DATA_MONGODB_URI"
Write-Host "Forcing IPv4 stack via JAVA_OPTS"

./mvnw spring-boot:run
