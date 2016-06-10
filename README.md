What is it?
===========
A way to make the awesome [Cockpit CMS](https://github.com/COCOPi/cockpit) even more awesome.

Built in a simple way to allow for easy installation and just to keep things simple.

Basically what this does, is it adds a simple overlay toolbar to your Cockpit CMS site when you are logged in.

![WYS toolbar](https://cloud.githubusercontent.com/assets/1729955/15963082/d78936ee-2f17-11e6-9b3e-a8f5797c5247.png)

Features:

* Link to main editor as a modal.
* Direct link to the editor of the page currently being viewed.
* Inline editing of defined areas with [MediumEditor](https://yabwe.github.io/medium-editor/).
* Possibility to add a shortcut to any Cockpit CMS page / feature.
* Overlayed tour to display the main features to new users.

Installing
==========
Clone this repository in to the `/cockpit` directory. Note that this has been tested with the
latest stable version 0.13.0 (might work with earlier versions, but most likely does not work
with the "next" branch)

Require helper functions with `require('cockpit/wys/wys_helpers.php');`

Require the main initializer in your templates head with `require('cockpit/wys/head.php');`

Initializer uses `$GLOBALS["logged_in"]` variable to determine if the user has logged in. Set that
according to the Cockpit CMS login status, for example after initializing Lime
with `$GLOBALS['logged_in'] = ($app("session")->read("cockpit.app.auth"));`.

Usage
=====
After successful installation, you should first see the overlay tour open up, explaining the
main features.

To redirect Cockpit CMS directly to your front page after logging in, edit the data-route attribute
in the html-tag of `cockpit/modules/core/Cockpit/views/layouts/login.php` from `@route('/')` to
just `/`.

To make content editable through the medium.js tools, use the `wqe` helper method. It wraps your
content with the required parameters to allow editing. For it to work, you need to pass in the type
of the editable content (collection or region), the collection/region slug name, the field that you are
editing, and the id of the collection/region to be edited. You can also pass in an extra argument called
"inline" to make content in one line not get wrapped in paragraphs or be displayed as a block while
editing.

Here's an example of editing the content field of an entry in the pages collection.
```php
$wqe_meta = [
  'type'=>'collection',
  'slug'=>'pages',
  'field'=>'content',
  'id'=>$page["_id"]
];
print wqe($page["content"],$wqe_meta);
```

To add shortcuts, write them in `meta/editor_shortcuts.json` as for example:
```json
[
  {"Shortcut title": "index.php/collections/entry/571ba5da18e15doc238298596"}
]
```

A very simple example of the basic usage of this tool can be found [here](https://github.com/nles/wys-example).
