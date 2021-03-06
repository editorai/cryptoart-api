rm 归档.zip


echo "Build web"
rm -rf dist
npm run build

zip -q -r 归档.zip app.js config/ lib/ node_modules/ build/ package-lock.json package.json scripts/ README.md

echo "Password: Pablo1Su"
scp ./归档.zip root@39.100.120.123:cryptoart
scp ./归档.zip root@39.101.138.168:cryptoart

echo "cd cryptoart && unzip 归档.zip -d cryptoart/"

ssh root@39.100.120.123 




