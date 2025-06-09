# Stage 1: Python Base & Dependencies
FROM python:3.11-slim AS base
WORKDIR /app

# Set environment variables for consistency
ENV PYTHONDONTWRITEBYTECODE 1 # Prevents .pyc files
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on

# Install build tools needed for some Python packages, then system dependencies
# This layer is cached well if requirements.txt doesn't change frequently
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential libpq-dev dos2unix curl && \
    # Clean up apt lists immediately after install
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final Runtime Image
FROM python:3.11-slim AS runtime
WORKDIR /app

# Set environment variables
ENV PYTHONUNBUFFERED=1
# Use an environment variable for port, default to 8000
ENV PORT=${API_PORT:-8000}
ENV APP_USER=appuser
ENV APP_GROUP=appgroup
ENV APP_UID=1001
ENV APP_GID=1001
# Configurable Uvicorn workers
ENV WORKERS=${UVICORN_WORKERS:-2}

# Install curl and dos2unix directly in the runtime stage for healthcheck and utility
# Also any other essential runtime utilities that were in base and are small
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl dos2unix libcurl4 && \
    # Clean up apt lists immediately after install to keep image smaller
    rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from the 'base' stage
COPY --from=base /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=base /usr/local/bin/ /usr/local/bin/

COPY . .

# Fix line endings in case of Windows files after code copy
RUN find . -type f \( -name "*.py" -o -name "*.sh" \) -print0 | xargs -0 -r dos2unix || true

# Create a non-root user and group
RUN addgroup --system --gid $APP_GID $APP_GROUP && \
    adduser --system --home /app --uid $APP_UID --gid $APP_GID $APP_USER && \
    chown -R $APP_USER:$APP_GROUP /app /usr/local/lib/python3.11/site-packages /usr/local/bin
    # curl and dos2unix are in system paths, their ownership is managed by apt

USER $APP_USER

EXPOSE ${PORT}

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers ${WORKERS}