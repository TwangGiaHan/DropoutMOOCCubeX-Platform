FROM python:3.10-slim

WORKDIR /app

# Install native dependencies for psycopg2 and building packages
RUN apt-get update && apt-get install -y libpq-dev gcc python3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
