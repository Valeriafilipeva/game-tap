/** @type {import('jest').Config} */
module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  setupFiles: [
    "./node_modules/react-native/jest/setup.js"
  ],
  testEnvironment: "jest-environment-jsdom", // теперь он установлен
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/android/", "/ios/"]
};
