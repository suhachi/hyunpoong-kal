# UTF-8 설정
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Continue"
$OutputDir = "code-exports"
$Timestamp = Get-Date -Format "yyyy-MM-dd-HHmm"

# 출력 디렉토리 생성
if (Test-Path $OutputDir) {
    Remove-Item -Path $OutputDir -Recurse -Force
}
New-Item -Path $OutputDir -ItemType Directory | Out-Null

Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "Code Export Script - 10 MD Files" -ForegroundColor Cyan
Write-Host "Timestamp: $Timestamp" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# 함수: MD 파일에 코드 추가
function Add-CodeToMD {
    param(
        [string]$FilePath,
        [string]$OutputFile,
        [string]$Category
    )
    
    if (Test-Path $FilePath) {
        $relativePath = $FilePath -replace [regex]::Escape($PWD.Path + "\"), ""
        $extension = [System.IO.Path]::GetExtension($FilePath).TrimStart('.')
        
        # 언어 매핑
        $langMap = @{
            'ts' = 'typescript'
            'tsx' = 'tsx'
            'js' = 'javascript'
            'jsx' = 'jsx'
            'json' = 'json'
            'css' = 'css'
            'html' = 'html'
            'sh' = 'bash'
            'md' = 'markdown'
        }
        $lang = $langMap[$extension]
        if (-not $lang) { $lang = $extension }
        
        $content = Get-Content -Path $FilePath -Raw -Encoding UTF8
        
        $codeBlock = @"

## $relativePath

``````$lang
$content
``````

---

"@
        
        # UTF8 without BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::AppendAllText($OutputFile, $codeBlock, $utf8NoBom)
        
        Write-Host "  [OK] $relativePath" -ForegroundColor Green
    }
}

# 함수: MD 파일 헤더 생성
function New-MDHeader {
    param(
        [string]$OutputFile,
        [string]$Title,
        [string]$Description
    )
    
    $header = @"
# $Title

**Generated**: $Timestamp  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

$Description

---
"@
    
    # UTF8 without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($OutputFile, $header, $utf8NoBom)
}

###############################################################################
# 01. Admin Pages
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "01. Extracting Admin Pages..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output01 = "$OutputDir\01-Admin-Pages-Code.md"
New-MDHeader -OutputFile $output01 -Title "Admin Pages - Full Source Code" -Description "Complete source code of 11 admin pages."

$adminPages = @(
    "src\pages\admin\Dashboard.tsx",
    "src\pages\admin\Orders.tsx",
    "src\pages\admin\Menus.tsx",
    "src\pages\admin\Reviews.tsx",
    "src\pages\admin\Analytics.tsx",
    "src\pages\admin\IntegratedAnalytics.tsx",
    "src\pages\admin\Delivery.tsx",
    "src\pages\admin\Promotions.tsx",
    "src\pages\admin\Points.tsx",
    "src\pages\admin\Support.tsx"
)

foreach ($page in $adminPages) {
    Add-CodeToMD -FilePath $page -OutputFile $output01 -Category "Admin Pages"
}

Write-Host ""

###############################################################################
# 02. Admin Settings
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "02. Extracting Admin Settings..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output02 = "$OutputDir\02-Admin-Settings-Code.md"
New-MDHeader -OutputFile $output02 -Title "Admin Settings - Full Source Code" -Description "Complete source code of admin settings page and 5 tabs."

$settingsPages = @(
    "src\pages\admin\Settings\index.tsx",
    "src\pages\admin\Settings\PaymentTab.tsx",
    "src\pages\admin\Settings\DeliveryTab.tsx",
    "src\pages\admin\Settings\MapsTab.tsx",
    "src\pages\admin\Settings\FCMTab.tsx",
    "src\pages\admin\Settings\OperationsTab.tsx"
)

foreach ($page in $settingsPages) {
    Add-CodeToMD -FilePath $page -OutputFile $output02 -Category "Admin Settings"
}

Write-Host ""

###############################################################################
# 03. App Pages
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "03. Extracting App Pages..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output03 = "$OutputDir\03-App-Pages-Code.md"
New-MDHeader -OutputFile $output03 -Title "App Pages - Full Source Code" -Description "Complete source code of 9 user-facing pages."

$appPages = @(
    "src\pages\app\Home.tsx",
    "src\pages\app\MenuList.tsx",
    "src\pages\app\Cart.tsx",
    "src\pages\app\Order.tsx",
    "src\pages\app\OrderHistory.tsx",
    "src\pages\app\Coupons.tsx",
    "src\pages\app\PointsHistory.tsx",
    "src\pages\app\My.tsx",
    "src\pages\Dev.tsx"
)

foreach ($page in $appPages) {
    Add-CodeToMD -FilePath $page -OutputFile $output03 -Category "App Pages"
}

Write-Host ""

###############################################################################
# 04. Lib APIs
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "04. Extracting Lib APIs..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output04 = "$OutputDir\04-Lib-APIs-Code.md"
New-MDHeader -OutputFile $output04 -Title "Lib APIs - Full Source Code" -Description "Complete source code of Firebase API layer and external API integrations."

$libFiles = @(
    "src\lib\firebase.ts",
    "src\lib\orders.api.ts",
    "src\lib\menus.api.ts",
    "src\lib\reviews.api.ts",
    "src\lib\coupons.api.ts",
    "src\lib\points.api.ts",
    "src\lib\nicepay.ts",
    "src\lib\tosspayments.ts",
    "src\lib\delivery\kakaoMobility.ts",
    "src\lib\admin\support.api.ts",
    "src\lib\admin\settingsCenter.api.ts"
)

foreach ($file in $libFiles) {
    Add-CodeToMD -FilePath $file -OutputFile $output04 -Category "Lib APIs"
}

Write-Host ""

###############################################################################
# 05. Contexts
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "05. Extracting Contexts..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output05 = "$OutputDir\05-Contexts-Code.md"
New-MDHeader -OutputFile $output05 -Title "Contexts - Full Source Code" -Description "Complete source code of React Contexts (AuthContext, CartContext, etc.)."

$contexts = @(
    "src\contexts\AuthContext.tsx",
    "src\contexts\CartContext.tsx",
    "src\contexts\NotificationContext.tsx"
)

foreach ($file in $contexts) {
    Add-CodeToMD -FilePath $file -OutputFile $output05 -Category "Contexts"
}

Write-Host ""

###############################################################################
# 06. Components
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "06. Extracting Components..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output06 = "$OutputDir\06-Components-Code.md"
New-MDHeader -OutputFile $output06 -Title "Components - Full Source Code" -Description "Complete source code of reusable components."

# Admin 컴포넌트
$adminComponents = Get-ChildItem -Path "src\components\admin" -Filter "*.tsx" -Recurse -ErrorAction SilentlyContinue
foreach ($file in $adminComponents) {
    Add-CodeToMD -FilePath $file.FullName -OutputFile $output06 -Category "Components"
}

# App 컴포넌트
$appComponents = Get-ChildItem -Path "src\components\app" -Filter "*.tsx" -Recurse -ErrorAction SilentlyContinue
foreach ($file in $appComponents) {
    Add-CodeToMD -FilePath $file.FullName -OutputFile $output06 -Category "Components"
}

# Brand 컴포넌트
$brandComponents = @(
    "src\components\brand\BrandLogo.tsx",
    "src\components\brand\StoreInfo.tsx"
)
foreach ($file in $brandComponents) {
    Add-CodeToMD -FilePath $file -OutputFile $output06 -Category "Components"
}

Write-Host ""

###############################################################################
# 07. Types & Constants
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "07. Extracting Types & Constants..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output07 = "$OutputDir\07-Types-Constants-Code.md"
New-MDHeader -OutputFile $output07 -Title "Types & Constants - Full Source Code" -Description "Complete source code of TypeScript type definitions and constants."

# Types
$types = Get-ChildItem -Path "src\types" -Filter "*.ts" -ErrorAction SilentlyContinue
foreach ($file in $types) {
    Add-CodeToMD -FilePath $file.FullName -OutputFile $output07 -Category "Types & Constants"
}

# Constants
$constants = Get-ChildItem -Path "src\constants" -Filter "*.ts" -ErrorAction SilentlyContinue
foreach ($file in $constants) {
    Add-CodeToMD -FilePath $file.FullName -OutputFile $output07 -Category "Types & Constants"
}

Write-Host ""

###############################################################################
# 08. Config & Utils
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "08. Extracting Config & Utils..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output08 = "$OutputDir\08-Config-Utils-Code.md"
New-MDHeader -OutputFile $output08 -Title "Config & Utils - Full Source Code" -Description "Complete source code of configuration files and utility functions."

$configFiles = @(
    "src\config\env.ts",
    "vite.config.ts",
    "tsconfig.json",
    "tailwind.config.js",
    "postcss.config.js",
    "package.json"
)

foreach ($file in $configFiles) {
    Add-CodeToMD -FilePath $file -OutputFile $output08 -Category "Config & Utils"
}

# Utils
$utils = Get-ChildItem -Path "src\utils" -Filter "*.ts" -ErrorAction SilentlyContinue
foreach ($file in $utils) {
    Add-CodeToMD -FilePath $file.FullName -OutputFile $output08 -Category "Config & Utils"
}

Write-Host ""

###############################################################################
# 09. E2E Tests
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "09. Extracting E2E Tests..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output09 = "$OutputDir\09-E2E-Tests-Code.md"
New-MDHeader -OutputFile $output09 -Title "E2E Tests - Full Source Code" -Description "Complete source code of Playwright E2E tests."

$e2eFiles = @(
    "src\playwright.config.ts",
    "src\e2e\admin-routes.spec.ts",
    "src\e2e\admin-settings.spec.ts"
)

foreach ($file in $e2eFiles) {
    Add-CodeToMD -FilePath $file -OutputFile $output09 -Category "E2E Tests"
}

Write-Host ""

###############################################################################
# 10. Main & Routes
###############################################################################
Write-Host "-" * 50 -ForegroundColor Yellow
Write-Host "10. Extracting Main & Routes..." -ForegroundColor Yellow
Write-Host "-" * 50 -ForegroundColor Yellow

$output10 = "$OutputDir\10-Main-Routes-Code.md"
New-MDHeader -OutputFile $output10 -Title "Main & Routes - Full Source Code" -Description "Complete source code of main entry points and routing configuration."

$mainFiles = @(
    "src\main.tsx",
    "src\App.tsx",
    "src\App.full.tsx",
    "index.html",
    "src\index.css"
)

foreach ($file in $mainFiles) {
    Add-CodeToMD -FilePath $file -OutputFile $output10 -Category "Main & Routes"
}

Write-Host ""

###############################################################################
# Summary
###############################################################################
Write-Host "=" * 50 -ForegroundColor Green
Write-Host "Export Complete!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Green
Write-Host ""

# 생성된 파일 통계
$mdFiles = Get-ChildItem -Path $OutputDir -Filter "*.md"
$totalSize = ($mdFiles | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host "Generated Files:" -ForegroundColor Cyan
foreach ($file in $mdFiles) {
    $lines = (Get-Content $file.FullName -Encoding UTF8 | Measure-Object -Line).Lines
    $sizeKB = [math]::Round($file.Length / 1KB, 2)
    Write-Host "  [OK] $($file.Name) - $lines lines, $sizeKB KB" -ForegroundColor White
}

Write-Host ""
Write-Host "Output Directory: $OutputDir" -ForegroundColor Cyan
Write-Host "Total Size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "All MD files have been generated successfully!" -ForegroundColor Green
Write-Host ""
