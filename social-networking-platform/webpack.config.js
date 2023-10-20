module: {
  rules: [
    {
      test: /\.js$/,
      exclude:
        /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
      loader: "babel-loader",
    },
  ];
}
plugins: [
  new webpack.ProvidePlugin({
    "window.Quill": "quill",
  }),
];
