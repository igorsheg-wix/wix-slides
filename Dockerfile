FROM golang:1.18-alpine as builder

WORKDIR /app 
COPY . .

RUN apk add yarn build-base ca-certificates
RUN update-ca-certificates
RUN make build-web
RUN make build-backend

FROM alpine:3.16

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/packages/app/wix-slides /

EXPOSE 4000
ENV APP_ENV=production

CMD ["/wix-slides"]