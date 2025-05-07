# This script adds the app.local entry to the hosts file
# Must be run as administrator

$hostsPath = "$env:windir\System32\drivers\etc\hosts"
$hostEntry = "127.0.0.1 app.local"

# Check if the entry already exists
$hostsContent = Get-Content -Path $hostsPath
if ($hostsContent -contains $hostEntry) {
    Write-Host "The host entry already exists in the hosts file."
    exit 0
}

# Append the new host entry
try {
    Add-Content -Path $hostsPath -Value "`n$hostEntry" -ErrorAction Stop
    Write-Host "Successfully added '$hostEntry' to the hosts file."
} catch {
    Write-Host "Error adding entry to hosts file. Make sure you're running as Administrator."
    Write-Host "Error: $_"
    exit 1
} 