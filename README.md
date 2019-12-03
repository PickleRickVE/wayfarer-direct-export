# Wayfarer direct export

Script for Tampermonkey to export nomination data directly from the Wayfarer page.

![teaser](assets/teaser_1.png?raw=true)

## Installation

First install Tampermonkey Plugin for Chrome Browser. Go to:

```
https://www.tampermonkey.net/
```

![installation](assets/installation_1.png?raw=true)
Click on download. You'll be redirected to Chrome's webstore.

Choose 'Add to Chrome'.
![installation](assets/installation_2.png?raw=true)

Now go the new extension...
![installation](assets/installation_3.png?raw=true)
![installation](assets/installation_4.png?raw=true)

...and open options.
![installation](assets/installation_5.png?raw=true)

For installing the script, click on '+'. An editor should now open.
![installation](assets/installation_6.png?raw=true)

Open the 
```
[script file](wayfarer-direct-export.js)
```
in a text editor, copy the entire text an paste it in Tampermonkey's editor. 
![installation](assets/installation_7.png?raw=true)

After saving it should look like the following:
![installation](assets/installation_8.png?raw=true)


## Getting started

Go to the Wayfarer homepage and open your nominations page. If enabled, the script will create an overlay and adds an export button. Data is in CSV format. You can now save your nominations or display them on a map of your convenience.

### Planned features

* Export to MySQL 

### Thanks

* Credit to [AlfonsoML](https://gitlab.com/AlfonsoML) for the inspiration and some base code.