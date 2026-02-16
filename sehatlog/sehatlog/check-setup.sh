#!/bin/bash

echo "🔍 SehatLog - Installation Check"
echo "================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Installed${NC} ($NODE_VERSION)"
else
    echo -e "${RED}✗ Not installed${NC}"
    echo "  Install from: https://nodejs.org/"
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ Installed${NC} (v$NPM_VERSION)"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

# Check Python
echo -n "Checking Python 3... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Installed${NC} ($PYTHON_VERSION)"
else
    echo -e "${RED}✗ Not installed${NC}"
    echo "  Install from: https://www.python.org/"
fi

# Check pip
echo -n "Checking pip... "
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ Installed${NC} (v$PIP_VERSION)"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo ""
echo "================================="
echo "Project Structure:"
echo "================================="

# Check directories
for dir in "backend" "ai-service" "frontend"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir/"
    else
        echo -e "${RED}✗${NC} $dir/"
    fi
done

echo ""

# Check key files
declare -a files=(
    "backend/server.js"
    "backend/package.json"
    "backend/seed.js"
    "ai-service/ai_engine.py"
    "ai-service/requirements.txt"
    "frontend/index.html"
    "frontend/login.html"
    "frontend/dashboard.html"
    "README.md"
    "QUICKSTART.md"
)

echo "Key Files:"
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file"
    fi
done

echo ""
echo "================================="
echo "Port Availability:"
echo "================================="

# Check port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} Port 3000 is in use (Backend)"
else
    echo -e "${GREEN}✓${NC} Port 3000 available (Backend)"
fi

# Check port 5000
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} Port 5000 is in use (AI Service)"
else
    echo -e "${GREEN}✓${NC} Port 5000 available (AI Service)"
fi

echo ""
echo "================================="
echo "Next Steps:"
echo "================================="
echo ""
echo "1. Install dependencies:"
echo "   cd backend && npm install"
echo "   cd ../ai-service && pip3 install -r requirements.txt"
echo ""
echo "2. Seed sample data:"
echo "   cd backend && npm run seed"
echo ""
echo "3. Start application:"
echo "   ./start.sh"
echo ""
echo "Or see QUICKSTART.md for detailed instructions"
echo ""
