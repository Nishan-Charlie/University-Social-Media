/* eslint-disable import/no-anonymous-default-export */
// jest.config.js

export default {
  // ...
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest", // Use Babel to transform JS/JSX files
  },
  transformIgnorePatterns: ["/node_modules/(?!@babel/runtime)"],
  moduleFileExtensions: ["js", "jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  // ...
};
