FROM golang:1.17-alpine as builder

WORKDIR /app 
COPY . .

RUN apk add yarn make
RUN make build-web
RUN make build-backend

FROM scratch

COPY --from=builder /app/packages/app/wix-slides /

EXPOSE 4000

CMD ["/wix-slides", "-env", "production"]