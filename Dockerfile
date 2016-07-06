FROM ubuntu:14.04
MAINTAINER Gabe Harms <gabeharms@gmail.com>

RUN sudo apt-get update -q
RUN sudo apt-get install -y -q curl libpq-dev gcc

RUN curl -sS https://static.rust-lang.org/rustup.sh > rustup.sh
RUN chmod +x ./rustup.sh
RUN ./rustup.sh --channel=nightly --yes --date=2016-05-09

RUN mkdir /payment_processor
WORKDIR /payment_processor

# Add Cargo.toml and Cargo.lock
ADD Cargo* /payment_processor/

# Add the rust code
ADD src /payment_processor/src/

ARG PORT=3000
EXPOSE $PORT

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN ["rm", "-rf", "./target"]
RUN ["cargo", "build", "--release", "--jobs", "4"]

CMD ["./target/release/payment_processor"]
