# Use an official Python image as the base
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install SQLite
RUN apt-get update && apt-get install -y sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Flask will run on
EXPOSE 5000

# Set the command to run the Flask app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000", "--debug"]