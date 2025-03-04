#!/bin/bash

# Display welcome message
echo "===================================================="
echo "     Wayne Center - Clinical Supervision Form"
echo "===================================================="
echo ""

# Get the directory where this script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check if the form file exists
if [ ! -f "$DIR/supervision-form.html" ]; then
    echo "ERROR: Required form files not found."
    echo "Please make sure all files are in the same folder."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Create Saved Forms directory if it doesn't exist
if [ ! -d "$DIR/Saved Forms" ]; then
    mkdir -p "$DIR/Saved Forms"
    echo "Created \"Saved Forms\" folder for your completed forms."
fi

echo "Opening form in your default browser..."
echo ""
echo "If you need help, please refer to the README.txt file."
echo ""

# Open the HTML file in the default browser
if [ $(uname) == "Darwin" ]; then
    # macOS
    open "$DIR/supervision-form.html"
else
    # Linux
    xdg-open "$DIR/supervision-form.html" 2>/dev/null || \
    sensible-browser "$DIR/supervision-form.html" 2>/dev/null || \
    echo "ERROR: Could not open browser. Please open supervision-form.html manually."
fi

# Make this script executable on first run
chmod +x "$DIR/open-form.command"

exit 0
