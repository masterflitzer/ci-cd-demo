#!/bin/bash

screen -S ci-cd -p 0 -X stuff $'\003' > /dev/null
screen -S ci-cd -dm deno run --allow-net /var/www/ci-cd-demo/hello-world.ts
