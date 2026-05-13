param(
  [string]$Url = "https://gen-ai-solutions.ie/",
  [ValidateSet("mobile", "desktop", "both")]
  [string]$Strategy = "both",
  [int]$MinPerformance = 80,
  [int]$MinSeo = 90,
  [int]$MinAccessibility = 90,
  [int]$MinBestPractices = 90
)

$ErrorActionPreference = "Stop"
$strategies = if ($Strategy -eq "both") { @("mobile", "desktop") } else { @($Strategy) }
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure {
  param([string]$Message)
  $script:failures.Add($Message) | Out-Null
}

function Get-Score {
  param($Category)
  if ($null -eq $Category -or $null -eq $Category.score) {
    return $null
  }
  return [math]::Round($Category.score * 100)
}

function Format-Metric {
  param($Audit, [string]$Unit)
  if ($null -eq $Audit -or $null -eq $Audit.numericValue) {
    return "n/a"
  }

  if ($Unit -eq "s") {
    return "$([math]::Round($Audit.numericValue / 1000, 2))s"
  }

  return "$([math]::Round($Audit.numericValue, 3))"
}

foreach ($currentStrategy in $strategies) {
  $query = @{
    url = $Url
    strategy = $currentStrategy
    category = @("performance", "accessibility", "best-practices", "seo")
  }

  if ($env:PAGESPEED_API_KEY) {
    $query.key = $env:PAGESPEED_API_KEY
  }

  $pairs = foreach ($key in $query.Keys) {
    foreach ($value in @($query[$key])) {
      "$([uri]::EscapeDataString($key))=$([uri]::EscapeDataString([string]$value))"
    }
  }
  $apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?$($pairs -join "&")"

  Write-Host "Running PageSpeed Insights for $Url ($currentStrategy)..."
  try {
    $result = Invoke-RestMethod -Uri $apiUrl -TimeoutSec 180
  } catch {
    $response = $_.Exception.Response
    $statusCode = if ($response) { [int]$response.StatusCode } else { 0 }
    if ($statusCode -eq 429 -and -not $env:PAGESPEED_API_KEY) {
      Add-Failure "$currentStrategy PageSpeed API request was rate-limited. Set PAGESPEED_API_KEY and rerun."
      continue
    }

    Add-Failure "$currentStrategy PageSpeed API request failed: $($_.Exception.Message)"
    continue
  }
  $categories = $result.lighthouseResult.categories
  $audits = $result.lighthouseResult.audits

  $performance = Get-Score $categories.performance
  $accessibility = Get-Score $categories.accessibility
  $bestPractices = Get-Score $categories.'best-practices'
  $seo = Get-Score $categories.seo
  $lcp = Format-Metric $audits.'largest-contentful-paint' "s"
  $cls = Format-Metric $audits.'cumulative-layout-shift' "score"
  $tbt = Format-Metric $audits.'total-blocking-time' "ms"

  Write-Host "$currentStrategy scores: performance=$performance accessibility=$accessibility best-practices=$bestPractices seo=$seo lcp=$lcp cls=$cls tbt=$tbt"

  if ($performance -lt $MinPerformance) {
    Add-Failure "$currentStrategy performance score $performance is below $MinPerformance"
  }
  if ($accessibility -lt $MinAccessibility) {
    Add-Failure "$currentStrategy accessibility score $accessibility is below $MinAccessibility"
  }
  if ($bestPractices -lt $MinBestPractices) {
    Add-Failure "$currentStrategy best-practices score $bestPractices is below $MinBestPractices"
  }
  if ($seo -lt $MinSeo) {
    Add-Failure "$currentStrategy SEO score $seo is below $MinSeo"
  }
}

if ($failures.Count -gt 0) {
  Write-Host "PageSpeed check failed:" -ForegroundColor Red
  foreach ($failure in $failures) {
    Write-Host "- $failure" -ForegroundColor Red
  }
  exit 1
}

Write-Host "PageSpeed check passed." -ForegroundColor Green
