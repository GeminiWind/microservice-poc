sudo chmod +x ./tools/mkcert
./tools/mkcert -install
./tools/mkcert -key-file api-gateway/cert/key.pem -cert-file api-gateway/cert/cert.pem  microservice.com "*.microservice.com"
