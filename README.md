# StreamX

Live streaming platform. Written to learn Django Rest Framework and Channels. Used stack is Django and Next.js with addition of nginx-rtmp.

### Showcase
[![Showcase](https://img.youtube.com/vi/fK9ozIpunlk/0.jpg)](https://www.youtube.com/watch?v=fK9ozIpunlk)

## Development

To run developing environment, you need to have pipenv, python >=3.10, nodejs >=16.0.0 and npm installed.

Get started with opening 3 terminals for seperate services.
API:
```sh
pipenv shell # activate virtual environment
cd streamx-api
python manage.py runserver
```

Frontend:
```sh
cd streamx-web
yarn  # install dependencies
yarn dev
```

RTMP server:
Before starting nginx, you need to have nginx files in nginx folder. You can get them from [here](http://nginx-win.ecsds.eu/download/), don't forget to choose the right version - Gryphon (because it has rtmp module included).
```sh
cd nginx
start nginx
```

## Production

I use Render to deploy my app. You can use any other service, but you need to have 3 services running: API, Frontend and RTMP server. To run server with render.yaml file just go to Render.com dashboard and select Blueprints.