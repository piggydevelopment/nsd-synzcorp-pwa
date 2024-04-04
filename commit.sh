#!/bin/sh

commit=$1
branch=$2 || main

git add .
git commit -m "$commit"
git push origin $2