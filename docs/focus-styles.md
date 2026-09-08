# Focus styling in 1.0.1

Components no longer add a surrounding or inset focus ring. Their existing borders, relief shadows, validation colors, selection state and keyboard behavior remain. Keyboard focus uses an underline, a small internal marker, an existing border's dash pattern, or the control's existing active treatment.

Update an npm installation with `npm install duoop-ui@1.0.1` and keep importing `duoop-ui/styles.css`. For copied components, download their source again and replace both their component CSS and `src/base.css` using the [source-copy guide](source-installation.md).

Input groups and resizable textareas explicitly suppress wrapper outlines during focus. Consumer styles with greater specificity or `!important` can still override the library's styles.

Verification: `node tests/focus.browser.mjs` exercises focus in live catalog previews; `npm run test:package` installs a packed archive into a separate React application and verifies keyboard operation, focus markers, preserved borders and error styling.
