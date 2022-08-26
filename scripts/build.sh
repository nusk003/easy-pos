cd packages/libs
for d in * ; do
  echo Building @hm/$d
  cd $d && yarn build
  cd ..
done