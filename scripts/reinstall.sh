echo "Deleting node_modules"

rm -rf node_modules
ls  packages/**
rm -rf packages/**/**/node_modules

yarn