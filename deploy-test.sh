#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Automatic Tester...${NC}"

# 1. Run Backend Tests
echo -e "\n${GREEN}Running Backend Tests...${NC}"
cd server
if npm test; then
    echo -e "${GREEN}Backend Tests Passed!${NC}"
else
    echo -e "${RED}Backend Tests Failed!${NC}"
    exit 1
fi
cd ..

# 2. Run Frontend Tests
echo -e "\n${GREEN}Running Frontend Tests...${NC}"
cd client
if npm test -- --run; then
    echo -e "${GREEN}Frontend Tests Passed!${NC}"
else
    echo -e "${RED}Frontend Tests Failed!${NC}"
    exit 1
fi
cd ..

echo -e "\n${GREEN}All Tests Passed Successfully! Ready for Deployment.${NC}"
exit 0
