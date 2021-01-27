# Akaneia Updater

## Install

First make sure `yarn` is intalled on your system, if not:

```bash
npm install -g yarn  # run as root if it doesn't work
```

then you can install the dependencies:

```bash
yarn install
```


## Building

To build the app with electron-builder simply run:

```bash
yarn build
```

the output can be found in the `dist` folder

## Supported package format

The supported update package format will look like this:

`manifest.json`

`stable/patch.xdelta`

`experimental/patch.xdelta`

`INSTRUCTIONS.txt`

Example manifest.json:

```json
{
    "name": "Akaneia",
    "version": "1.0.5"
    "packages" : [
        {
            "name" : "stable",
            "patch": "stable/patch.xdelta"
        },
        {
            "name" : "experimental",
            "patch": "experimental/patch.xdelta"
        }
    ]
}
```