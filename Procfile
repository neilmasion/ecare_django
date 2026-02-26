web: gunicorn eCare.app.wsgi
web: python manage.py collectstatic --noinput && gunicorn eCare.app.wsgi --log-file -