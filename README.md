# Three Custom Block
This custom block example inserts three.js logic into the editor as well as the frontend of a 3OV powered site. If you want to manipulate the frontend rend of this example plugin see blocks/three-custom-block-front.js

After making a change to the example files, be sure to run a `yarn build` before trying the logic. After running a build, you can zip up this entire directory and install it on a WordPress. Be sure to not include the `vendor` or `node_modules` folders in those zips. This is a crude example in current state but will certainly get you on the path to extending 3OV with your own custom Three.js logic.


[![Built With Plugin Machine](https://img.shields.io/badge/Built%20With-Plugin%20Machine-lightgrey)](https://pluginmachine.com)

## Working With JavaScript

- Build JS/CSS
    - `yarn build`

## Local Development Environment

A [docker-compose](https://docs.docker.com/samples/wordpress/)-based local development environment is provided.

- Start server
    - `docker-compose up -d`
- Acess Site
    - [http://localhost:6039](http://localhost:6039)
- WP CLI
    - Run any WP CLI command in container:
        - `docker-compose run wpcli wp ...`
    - Setup site with WP CLI
        - `docker-compose run wpcli wp core install --url=http://localhost:6039 --title="Three Object Viewer" --admin_user=admin0 --admin_email=something@example.com`
        - `docker-compose run wpcli wp user create admin admin@example.com --role=administrator --user_pass=pass`


There is a special phpunit container for running WordPress tests, with WordPress and MySQL configured.

- Enter container
    - `docker-compose run phpunit`
- Composer install
    - `composer install`
- Test
    - `composer test:wordpress`

