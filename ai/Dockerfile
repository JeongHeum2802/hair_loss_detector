# 1. Base Image: Lightweight Python
FROM python:3.9-slim

# 2. Set Working Directory
WORKDIR /app

# 3. Copy Dependencies First (for caching)
COPY requirements.txt .

# 4. Install Dependencies
# --no-cache-dir: Keep image small
# --upgrade: Ensure latest compatible versions
RUN pip install --no-cache-dir --upgrade pip && \
  pip install --no-cache-dir -r requirements.txt

COPY models/ models/

# 5. Copy Application Code
COPY . .

ENV TF_ENABLE_ONEDNN_OPTS=0
ENV OMP_NUM_THREADS=1
ENV TF_NUM_INTRAOP_THREADS=1
ENV TF_NUM_INTEROP_THREADS=1

# 6. Run Application
# Use shell form to allow variable expansion for ${PORT}
# Use python -m uvicorn to ensure uvicorn is found in path
CMD python -m uvicorn api:app --host 0.0.0.0 --port ${PORT:-8080}
