#!/bin/bash

if [ -z "$1" ]
then
  echo "No setup destination directory argument supplied."
  exit 1
fi

if [ -z "$2" ]
then
  echo "No setup source directory argument supplied."
  exit 1
fi

if [ ! -d $1 ]
then
  mkdir $1
fi

cd $2

rm -rf node_modules
cp gulpfile.js $1
cp package.json $1
cp -r tasks $1
cd $1
npm install
