FROM alpine:latest

# Certificates
ADD cert.crt /usr/local/share/ca-certificates/cert.crt
RUN chmod 644 /usr/local/share/ca-certificates/cert.crt
RUN cat /usr/local/share/ca-certificates/cert.crt >> /etc/ssl/certs/ca-certificates.crt

# FFMPEG
RUN apk add --update ffmpeg bash curl make

WORKDIR /tmp/videos

ENTRYPOINT [ "top" ]