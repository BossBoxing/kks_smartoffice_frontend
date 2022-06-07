# escape=`

FROM registry.gitlab.com/softsquare_ssru/registry/base/node:12-win as builder

LABEL MAINTAINER siritas@gmail.com

# SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

ENV NPM_CONFIG_LOGLEVEL info

RUN npm install -g @angular/cli@8

