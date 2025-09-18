FROM ubuntu:latest
LABEL authors="oliviastepper"


ENTRYPOINT ["top", "-b"]

FROM postgres:15

WORKDIR /app
COPY *.csv ./
COPY load_data.sh .

RUN chmod +x load_data.sh

CMD ["./load_data.sh"]
