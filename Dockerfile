FROM golang:1.18-alpine as builder

WORKDIR /app 
COPY . .

RUN apk add yarn build-base
RUN apk add -U --no-cache ca-certificates 
RUN yarn set version stable
RUN yarn config set nodeLinker "node-modules"
RUN make build-web
RUN make build-backend

FROM scratch

COPY --from=builder /app/packages/app/wix-slides /
COPY --from=alpine /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

EXPOSE 4000
ENV APP_ENV=production

CMD ["/wix-slides"]
