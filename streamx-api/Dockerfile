FROM python:3.11

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip && \
    pip install -r requirements.txt && \
    python manage.py migrate

CMD ["gunicorn", "streamx.asgi:application", "-w", "4", "-k", "uvicorn.workers.UvicornWorker"]