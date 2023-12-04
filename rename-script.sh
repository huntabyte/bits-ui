#!/bin/bash

# Find all .svelte files in the current directory
files=$(find . -maxdepth 1 -type f -name '*.svelte')

# Loop through each found file
for file in $files; do
    # Extract the filename without the extension
    filename=$(basename -- "$file")
    filename_noext="${filename%.*}"

    # Convert PascalCase to kebab-case using sed
    new_filename=$(echo "$filename_noext" | sed 's/\([^A-Z]\)\([A-Z]\)/\1-\2/g; s/\([A-Z]\)\([A-Z][a-z]\)/\1-\2/g; s/\([a-z0-9]\)\([A-Z]\)$/\1-\2/g' | tr '[:upper:]' '[:lower:]')

    # Rename the file if needed using git mv
    if [ "$filename_noext" != "$new_filename" ]; then
        git mv "$file" "$(dirname "$file")/$new_filename.svelte"
        echo "Renamed $filename to $new_filename.svelte"
    else
        echo "Skipped $filename (already in kebab-case)"
    fi
done