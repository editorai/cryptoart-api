rm -rf dist
npm run build

zip -q -r dist.zip dist/ 

echo "Password: Lipenghui199908"
scp ./dist.zip root@47.74.241.234:pandachain707

echo "cd pandachain707 && unzip dist.zip -d dist/"

ssh root@47.74.241.234
