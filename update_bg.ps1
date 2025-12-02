$path = "src/components/ThemedBackground.tsx"
$content = Get-Content $path -Raw

# Change 1: Interface
# Add className to interface
$content = $content -replace "interface ThemedBackgroundProps {", "interface ThemedBackgroundProps {`n  className?: string;"

# Change 2: Signature
# Update component signature and add finalClasses logic
$content = $content -replace "const ThemedBackground: React.FC<ThemedBackgroundProps> = \({ theme }\) => {", "const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ theme, className }) => {`n  const defaultClasses = `"fixed inset-0 pointer-events-none z-[-1]`";`n  const finalClasses = className || defaultClasses;"

# Change 3: Return statements
# Replace hardcoded classes with finalClasses
$content = $content -replace 'className="fixed inset-0 pointer-events-none z-\[-1\]"', 'className={finalClasses}'
$content = $content -replace 'className="fixed inset-0 z-0"', 'className={finalClasses}'

Set-Content $path $content -NoNewline
Write-Host "Successfully updated ThemedBackground.tsx"
