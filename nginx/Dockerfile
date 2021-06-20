FROM nginx:alpine

LABEL maintainer="Shashank Aital <aitalshashank2@gmail.com>"

WORKDIR /

RUN mkdir -p /reverse_proxy_logs/nginx_logs \ 
    && chown -R nginx:nginx /reverse_proxy_logs \
    && chmod -R o+r /reverse_proxy_logs

WORKDIR /etc/nginx

RUN rm -f ./conf.d/default.conf

ADD ./conf.d ./conf.d
