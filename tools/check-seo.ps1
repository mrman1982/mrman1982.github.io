param(
  [string]$Root = (Resolve-Path ".").Path
)

$ErrorActionPreference = "Stop"
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([string]$Message)
  $script:failures.Add($Message) | Out-Null
}

function Read-Text {
  param([string]$Path)
  Get-Content -LiteralPath $Path -Raw
}

$htmlFiles = Get-ChildItem -LiteralPath $Root -Filter "*.html" -File
$indexableExceptions = @("404.html", "search.html", "thank-you.html")

foreach ($file in $htmlFiles) {
  $html = Read-Text $file.FullName

  if ($html -notmatch "<title>.+?</title>") {
    Add-Failure "$($file.Name): missing <title>"
  }

  if ($html -notmatch "rel=""canonical""") {
    Add-Failure "$($file.Name): missing canonical link"
  }

  if ($html -notmatch "<h1\b") {
    Add-Failure "$($file.Name): missing H1"
  }

  if ($file.Name -notin $indexableExceptions -and $html -notmatch "name=""description""") {
    Add-Failure "$($file.Name): missing meta description"
  }

  foreach ($script in [regex]::Matches($html, '<script type="application/ld\+json">\s*(.*?)\s*</script>', 'Singleline')) {
    try {
      $null = $script.Groups[1].Value | ConvertFrom-Json
    } catch {
      Add-Failure "$($file.Name): invalid JSON-LD"
    }
  }

  foreach ($image in [regex]::Matches($html, '<img\b[^>]*>', 'IgnoreCase')) {
    if ($image.Value -notmatch "\salt=") {
      Add-Failure "$($file.Name): image missing alt attribute"
    }
  }

  if ($html -notmatch '<script src="/js/script.js" defer></script>') {
    Add-Failure "$($file.Name): missing shared script include"
  }
}

$robotsPath = Join-Path $Root "robots.txt"
if (-not (Test-Path -LiteralPath $robotsPath)) {
  Add-Failure "robots.txt: missing"
} else {
  $robots = Read-Text $robotsPath
  foreach ($expected in @("https://gen-ai-solutions.ie/sitemap.xml", "https://gen-ai-solutions.ie/image-sitemap.xml")) {
    if ($robots -notmatch [regex]::Escape($expected)) {
      Add-Failure "robots.txt: missing sitemap reference $expected"
    }
  }
}

$sitemapPath = Join-Path $Root "sitemap.xml"
if (-not (Test-Path -LiteralPath $sitemapPath)) {
  Add-Failure "sitemap.xml: missing"
} else {
  Select-String -Path $sitemapPath -Pattern "<loc>(.*?)</loc>" | ForEach-Object {
    $url = $_.Matches[0].Groups[1].Value
    $path = ([uri]$url).AbsolutePath.TrimStart("/")
    if ([string]::IsNullOrWhiteSpace($path)) {
      $path = "index.html"
    }
    if (-not (Test-Path -LiteralPath (Join-Path $Root $path))) {
      Add-Failure "sitemap.xml: $url points to missing local file $path"
    }
  }
}

$scriptPath = Join-Path $Root "js/script.js"
if (-not (Test-Path -LiteralPath $scriptPath)) {
  Add-Failure "js/script.js: missing"
} else {
  $script = Read-Text $scriptPath
  if ($script -notmatch 'GA_MEASUREMENT_ID\s*=\s*"G-[A-Z0-9]+"') {
    Add-Failure "js/script.js: missing GA4 measurement ID"
  }
  if ($script -notmatch "googletagmanager\.com/gtag/js") {
    Add-Failure "js/script.js: missing GA4 loader"
  }
  if ($script -notmatch "dataLayer") {
    Add-Failure "js/script.js: missing dataLayer event support"
  }
}

$indexPath = Join-Path $Root "index.html"
$indexHtml = Read-Text $indexPath
if ($indexHtml -notmatch 'name="google-site-verification"') {
  Add-Failure "index.html: missing Google Search Console verification meta"
}
if ($indexHtml -notmatch 'name="msvalidate\.01"') {
  Add-Failure "index.html: missing Bing verification meta"
}

foreach ($machineFile in @("llms.txt", "pricing.md")) {
  $path = Join-Path $Root $machineFile
  if (-not (Test-Path -LiteralPath $path)) {
    Add-Failure "${machineFile}: missing"
  } elseif ((Read-Text $path).Trim().Length -lt 200) {
    Add-Failure "${machineFile}: too short to be useful"
  }
}

if ($failures.Count -gt 0) {
  Write-Host "SEO audit failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host "- $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "SEO audit passed." -ForegroundColor Green
Write-Host "Checked $($htmlFiles.Count) HTML files, robots.txt, sitemap.xml, analytics wiring, verification tags, llms.txt, and pricing.md."
