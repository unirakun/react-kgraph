### Publish

1. `yarn`: install dependencies
2. Edit the version in the root **package.json**
3. `yarn build`: build lib
4. `git commit -am ':bookmark: v<version>'`: commit modification
5. `cd pkg && npm publish && cd -`: publish the lib into npm
6. `yarn gh-pages-deploy`: build and publish documentation (storybook)
7. `git push`: push locals modifications
