# Stage 1: Dependencies
FROM python:3.11-slim AS deps
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Test
FROM deps AS test
WORKDIR /app

# Copy application code
COPY . .

# Run tests
# Commented out for now - uncomment when tests are added
# RUN pytest

# Stage 3: Runtime
FROM python:3.11-slim AS runtime
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install production dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Fix line endings in case of Windows files
RUN apt-get update && apt-get install -y dos2unix && \
    find . -type f -name "*.py" -exec dos2unix {} \; && \
    find . -type f -name "*.sh" -exec dos2unix {} \; && \
    apt-get purge -y dos2unix && apt-get autoremove -y && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"] 