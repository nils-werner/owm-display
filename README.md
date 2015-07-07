Weather Display
===============

This page is a small, HTML- and JS-only, website to show basic weather information for a sailing spot in southern germany.

![Screenshot](img/screenshot.png)

The API key must be provided using the URL hash, like

    index.html#!abcdef

When using this site for any other spot, please edit the settings `position` in the file `js/loader.js`:

    position = "49.106389,10.987222";

Then open the file in your browser.

## Related Projects

<https://github.com/nils-werner/raspi-dashboard> is a dashboard-style Linux
installation for the Raspberry Pi. It boots with read-only file systems to
make shutting down and rebooting the system easier (by just unplugging it).

## Example

An example of this site can be found on <http://nils-werner.github.io/owm-display/>
