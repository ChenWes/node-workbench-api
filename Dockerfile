# Basic Image
FROM node:boron

# Machine Infomation
MAINTAINER chenxuhua0530@163.com

# Step 1: Create Folder
RUN mkdir -p /usr/src/app

# Step 2: Setting Work Space
WORKDIR /usr/src/app


# Just Setting Nodejs Environment Variable
# ENV NODE_ENV=production
# ENV NODE_ENV=test
# ENV PORT=3000

# Step 3: Copy Package Json And bower Json File
COPY /workbench-api/package.json /usr/src/app
COPY /workbench-api/.bowerrc /usr/src/app
COPY /workbench-api/bower.json /usr/src/app

# Step 4: npm and bower Install Package
RUN npm install -g gulp bower \
    && npm install \
    && bower install --allow-root

# Step 5: Copy Other File To Work Space
COPY /workbench-api /usr/src/app

# Step 6: Export Port 3000
# if setting nodejs environment variable port , need change to new port
EXPOSE 3000

# Start Command
CMD ["npm","start"]

