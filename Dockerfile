# Specify the base image
FROM --platform=linux/arm64 node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies including TypeScript.
# --legacy-peer-deps matches ci.yml: @babel/core@8 is ahead of the ^7 peer range
# that ts-jest's babel plugins still declare.
RUN npm ci --legacy-peer-deps

# Copy TypeScript configuration and source files
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run your app using the JavaScript output in dist
CMD ["node", "dist/index.js"]