#!/bin/bash
# NPM Initialization Script
# This script initializes Nginx Proxy Manager with default admin credentials
# when running fresh deployments

set -e

echo "🔧 Initializing Nginx Proxy Manager..."

# Wait for NPM to be ready
echo "⏳ Waiting for NPM to start..."
for i in {1..60}; do
    # Check if NPM web interface is responding
    if curl -s http://localhost:81/ > /dev/null 2>&1; then
        echo "✅ NPM web interface is responding"
        
        # Wait a bit more for the API to be ready
        sleep 5
        
        # Check if NPM API is responding
        if curl -s http://localhost:81/api/schema > /dev/null 2>&1; then
            echo "✅ NPM API is ready"
            break
        fi
    fi
    if [ $i -eq 60 ]; then
        echo "❌ NPM failed to start within 10 minutes"
        echo "📋 Checking NPM container logs..."
        docker logs $(docker ps -q -f name=npm) --tail 20 2>/dev/null || true
        exit 1
    fi
    echo "   Waiting for NPM to be fully ready... ($i/60)"
    sleep 10
done

# Check if admin user exists by trying to login
echo "🔍 Checking if admin user exists..."

# Default credentials
DEFAULT_EMAIL="admin@example.com"
DEFAULT_PASSWORD="changeme"
NEW_EMAIL="${NPM_ADMIN_EMAIL:-mirkotrottac@gmail.com}"
NEW_PASSWORD="${NPM_ADMIN_PASSWORD:-SecurePassword123!}"

# Try to get a token with default credentials
RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
  -X POST "http://localhost:81/api/tokens" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$DEFAULT_EMAIL\",\"secret\":\"$DEFAULT_PASSWORD\"}" \
  2>/dev/null || echo "HTTPSTATUS:000")

HTTP_CODE=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

if [ "$HTTP_CODE" -eq "200" ]; then
    echo "🎯 Default admin credentials found - updating to production credentials..."
    
    # Extract token
    TOKEN=$(echo $RESPONSE | sed -e 's/HTTPSTATUS:.*//' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    if [ -n "$TOKEN" ]; then
        echo "✅ Authentication successful, updating admin user..."
        
        # Update admin user with new credentials
        UPDATE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
          -X PUT "http://localhost:81/api/users/1" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d "{
            \"email\":\"$NEW_EMAIL\",
            \"name\":\"Administrator\",
            \"nickname\":\"Admin\",
            \"password\":\"$NEW_PASSWORD\",
            \"is_disabled\":false,
            \"roles\":[\"admin\"]
          }" 2>/dev/null || echo "HTTPSTATUS:000")
        
        UPDATE_CODE=$(echo $UPDATE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        
        if [ "$UPDATE_CODE" -eq "200" ] || [ "$UPDATE_CODE" -eq "204" ]; then
            echo "✅ Admin credentials updated successfully!"
            echo "📧 Email: $NEW_EMAIL"
            echo "🔐 Password: $NEW_PASSWORD"
        else
            echo "⚠️  Failed to update admin credentials (HTTP: $UPDATE_CODE)"
            echo "📧 Using default: $DEFAULT_EMAIL"
            echo "🔐 Using default: $DEFAULT_PASSWORD"
        fi
    else
        echo "⚠️  Could not extract authentication token"
        echo "📧 Using default: $DEFAULT_EMAIL"
        echo "🔐 Using default: $DEFAULT_PASSWORD"
    fi
elif [ "$HTTP_CODE" -eq "401" ]; then
    echo "🔍 Admin user exists but credentials changed - trying production credentials..."
    
    # Try with production credentials
    PROD_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
      -X POST "http://localhost:81/api/tokens" \
      -H "Content-Type: application/json" \
      -d "{\"identity\":\"$NEW_EMAIL\",\"secret\":\"$NEW_PASSWORD\"}" \
      2>/dev/null || echo "HTTPSTATUS:000")
    
    PROD_CODE=$(echo $PROD_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$PROD_CODE" -eq "200" ]; then
        echo "✅ Production credentials are working!"
        echo "📧 Email: $NEW_EMAIL"
        echo "🔐 Password: $NEW_PASSWORD"
    else
        echo "❌ Neither default nor production credentials work"
        echo "🔧 Manual reset may be required"
        echo "⚠️  Continuing deployment - you may need to manually configure NPM"
        NEW_EMAIL="$DEFAULT_EMAIL"
        NEW_PASSWORD="$DEFAULT_PASSWORD"
    fi
else
    echo "⚠️  NPM API not responding properly (HTTP: $HTTP_CODE)"
    echo "🔄 Attempting to reset NPM database for fresh initialization..."
    
    # Try to reset by removing the database file and restarting NPM
    if docker exec $(docker ps -q -f name=npm) rm -f /data/database.sqlite 2>/dev/null; then
        echo "🗑️  Removed NPM database file"
        
        # Restart NPM container to force re-initialization
        echo "🔄 Restarting NPM container..."
        docker restart $(docker ps -q -f name=npm) > /dev/null 2>&1 || true
        
        # Wait for restart
        echo "⏳ Waiting for NPM to restart and initialize..."
        sleep 30
        
        # Try again with default credentials
        RESET_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
          -X POST "http://localhost:81/api/tokens" \
          -H "Content-Type: application/json" \
          -d "{\"identity\":\"$DEFAULT_EMAIL\",\"secret\":\"$DEFAULT_PASSWORD\"}" \
          2>/dev/null || echo "HTTPSTATUS:000")
        
        RESET_CODE=$(echo $RESET_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        
        if [ "$RESET_CODE" -eq "200" ]; then
            echo "✅ NPM reset successful! Default credentials are working."
            echo "🎯 Now updating to production credentials..."
            
            # Extract token and update credentials (same logic as above)
            TOKEN=$(echo $RESET_RESPONSE | sed -e 's/HTTPSTATUS:.*//' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
            
            if [ -n "$TOKEN" ]; then
                UPDATE_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" \
                  -X PUT "http://localhost:81/api/users/1" \
                  -H "Content-Type: application/json" \
                  -H "Authorization: Bearer $TOKEN" \
                  -d "{
                    \"email\":\"$NEW_EMAIL\",
                    \"name\":\"Administrator\",
                    \"nickname\":\"Admin\",
                    \"password\":\"$NEW_PASSWORD\",
                    \"is_disabled\":false,
                    \"roles\":[\"admin\"]
                  }" 2>/dev/null || echo "HTTPSTATUS:000")
                
                UPDATE_CODE=$(echo $UPDATE_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
                
                if [ "$UPDATE_CODE" -eq "200" ] || [ "$UPDATE_CODE" -eq "204" ]; then
                    echo "✅ Production credentials set successfully after reset!"
                    NEW_EMAIL="$NEW_EMAIL"
                    NEW_PASSWORD="$NEW_PASSWORD"
                else
                    echo "⚠️  Reset worked but failed to update credentials"
                    NEW_EMAIL="$DEFAULT_EMAIL"
                    NEW_PASSWORD="$DEFAULT_PASSWORD"
                fi
            fi
        else
            echo "❌ NPM reset failed. Manual intervention required."
            echo "📧 Try accessing with: $DEFAULT_EMAIL"
            echo "🔐 Try password: $DEFAULT_PASSWORD"
            NEW_EMAIL="$DEFAULT_EMAIL"
            NEW_PASSWORD="$DEFAULT_PASSWORD"
        fi
    else
        echo "❌ Could not reset NPM database. Manual intervention required."
        echo "📧 Try default: $DEFAULT_EMAIL"
        echo "🔐 Try default: $DEFAULT_PASSWORD"
        NEW_EMAIL="$DEFAULT_EMAIL"
        NEW_PASSWORD="$DEFAULT_PASSWORD"
    fi
fi

echo ""
echo "🎉 NPM Initialization completed!"
echo "🌐 Access NPM Admin: http://$(curl -s ifconfig.me):81"
echo "📧 Email: $NEW_EMAIL"
echo "🔐 Password: $NEW_PASSWORD"
echo ""
echo "ℹ️  Note: If you still can't log in, try these troubleshooting steps:"
echo "   1. Wait 2-3 minutes for NPM to fully initialize"
echo "   2. Try the default credentials: admin@example.com / changeme"
echo "   3. Clear browser cache and try again"
echo "" 