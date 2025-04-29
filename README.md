# keychainhelper-playground

A webpack frontend, using typescript to serve as practical documentation for [KeychainHelper](https://www.npmjs.com/package/keychain-helper)

To use keychain-helper.
Using Node:

```bash
npm i keychain-helper
```

Using Yarn:

```
yard add keychain-helper
```

---

Important notes:

## 🐛 Potential Runtime Error with CSS Modules (`TypeError: Cannot read properties of undefined`)

When configuring CSS Modules with Webpack 5, React, and TypeScript, specifically when importing and using the `styles` object from a `.module.css` file, the following error might appear in the browser console at runtime, even if the Webpack build was successful:
`Uncaught TypeError: Cannot read properties of undefined (reading 'checking')`
This indicates that the `styles` variable, which should be an object containing your CSS classes, is `undefined`.

**Cause:**

This issue can be due to a compatibility or a specific bug between certain recent versions of `css-loader` (v7.x.x) and `style-loader` (v4.x.x) with your Webpack 5 version and/or Node.js environment, preventing the CSS module's default export from being correctly generated.

**Solution:**

The confirmed solution is to **downgrade the versions of `css-loader` and `style-loader`** to previous stable combinations.

1.  Stop your development server (`npm start` or `yarn start`).
2.  Uninstall the current versions of these loaders:
    ```bash
    npm uninstall css-loader style-loader
    # or
    yarn remove css-loader style-loader
    ```
3.  Install previous stable versions (e.g., v6.x.x for `css-loader` and v3.x.x for `style-loader`):
    ```bash
    npm install css-loader@^6.0.0 style-loader@^3.0.0 --save-dev
    # or
    yarn add css-loader@^6.0.0 style-loader@^3.0.0 --dev
    ```
    _(The exact versions that worked in this specific case were css-loader@6.8.1 and style-loader@3.3.3)_
4.  Clear the persistent Webpack cache (optional but recommended):
    ```bash
    # From your project root
    rm -rf node_modules/.cache/webpack
    # or on Windows
    del /s /q node_modules\.cache\webpack
    ```
5.  Start your development server or run the build again:
    ```bash
    npm start
    # or
    npm run build
    ```

With the older versions of the loaders, `css-loader` will correctly generate the CSS module's default export, resolving the runtime `TypeError`.
