# escape=`

# FROM mcr.microsoft.com/windows/servercore:ltsc2019 as builder
FROM mcr.microsoft.com/windows/servercore:1809 as base

LABEL MAINTAINER siritas@gmail.com

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

ENV NPM_CONFIG_LOGLEVEL info

RUN Invoke-WebRequest -OutFile C:/node.zip https://nodejs.org/dist/v12.16.1/node-v12.16.1-win-x64.zip -UseBasicParsing; `
    Expand-Archive -Path C:/node.zip -DestinationPath C:/ -Force; `
    Remove-Item -Path c:/node.zip -Confirm:$False; `
    Rename-Item -Path node-v12.16.1-win-x64 -NewName node

RUN SETX PATH C:\node

CMD [ "node.exe" ]

FROM mcr.microsoft.com/windows/nanoserver:1809 as builder

COPY --from=base c:/node/ c:/node/

ENV NPM_CONFIG_LOGLEVEL info

USER ContainerAdministrator

RUN setx /M PATH "%PATH%;C:\node"

USER ContainerUser

ENV PATH "C:\\Windows\\system32;C:\\Windows;C:\\Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\;c:\\node"

WORKDIR c:\src
RUN npm install -g @angular/cli@9.0.7
COPY package*.json c:\src\
RUN npm ci --loglevel=error
COPY . c:\src\
RUN node ./node_modules/@angular/cli/bin/ng version
RUN npm run build-prod

# ENV PORT 3000

# EXPOSE ${PORT}

# CMD ["node.exe"]
FROM caddy:2.0.0-windowsservercore-1809 as runer

LABEL MAINTAINER siritas@gmail.com

COPY docker/Caddyfile /etc/caddy/Caddyfile

COPY --from=builder c:\src\dist\spa /usr/share/caddy/

