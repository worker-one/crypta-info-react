# Use a Python 3.11 slim image as the base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the working directory
COPY app ./app
COPY scripts ./scripts

# Set the command to run the application
CMD ["./scripts/run.sh"]