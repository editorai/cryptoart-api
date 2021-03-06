rm -rf dist
npm run build

~/ossutil config -e oss-cn-shanghai.aliyuncs.com -i LTAI4FramnvGWP9pHCKQtLUe -k 1XwgwGE7ovV5dGgiVvEDxRiDCsz7VN

~/ossutil cp ./dist oss://pandachain-webpage/ --recursive --force --exclude ".DS_Store"

echo "oss-pandachina.macroshen.cn"