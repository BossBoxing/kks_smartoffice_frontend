# escape=`

# FROM mcr.microsoft.com/windows/servercore:ltsc2019 as builder
FROM mcr.microsoft.com/windows/servercore:1809 as builder

ENV VERSION 1.16.1

LABEL MAINTAINER siritas@gmail.com

LABEL Description="Windows Server 1909 Nano Server base OS image with nginx 1.16.1" Vendor="Soft Square"

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop'; $ProgressPreference = 'SilentlyContinue';"]

RUN Invoke-WebRequest -OutFile C:/nginx.zip https://nginx.org/download/nginx-1.16.1.zip -UseBasicParsing ;
# COPY nginx-bin c:\\nginx.zip

RUN Expand-Archive -Path C:/nginx.zip -DestinationPath C:/ -Force; `
    Remove-Item -Path c:/nginx.zip -Confirm:$False; `
    Rename-Item -Path nginx-1.16.1 -NewName nginx

COPY nginx-win.conf /nginx/conf/nginx.conf

# # Make sure that Docker always uses default DNS servers which hosted by Dockerd.exe
# RUN Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name ServerPriorityTimeLimit -Value 0 -Type DWord; \
# 	Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name ScreenDefaultServers -Value 0 -Type DWord; \
# 	Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name ScreenUnreachableServers -Value 0 -Type DWord
	
# # Shorten DNS cache times
# RUN Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name MaxCacheTtl -Value 30 -Type DWord; \
# 	Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Services\Dnscache\Parameters' -Name MaxNegativeCacheTtl -Value 30 -Type DWord

WORKDIR /nginx

# RUN dir C:

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]