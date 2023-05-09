Views
===

Typically, web servers serve .html files across the network to browsers. Instead, RM Panel serves .hjs templates, an extension of [Hogan.js](https://twitter.github.io/hogan.js/). This templating engine allows us to use shared partials and controller variables from within the template while still writing HTML markup.

## Creating a view

This is what would usually be an .html file, but in our case it's an .hjs file.

1. In `src/views/`, create an .hjs file in the path of your choice. For example, I would create the .hjs file for `https://abd.tld/user/profile` at `src/views/user/profile.hjs`.
2. Place any valid HTML markup in this file.
3. Insert any [partials](https://github.com/itsmistad/RM-Panle/tree/develop/src/views#creating-and-using-a-partial) or [controller variables](https://github.com/itsmistad/RM-Panle/tree/develop/src/controllers#creating-and-using-controller-variables).

## Creating and using a partial

Partials are shared .hjs templates that any .hjs template can access. The only rules are as follows:
> 1. You cannot have circular dependencies.
> 2. You cannot layer partials.
> 3. You cannot define [pre-render stylesheets](https://github.com/itsmistad/RM-Panle/tree/develop/src/views#adding-pre-render-stylesheets) or [post-render scripts](https://github.com/itsmistad/RM-Panle/tree/develop/src/views#adding-post-render-scripts) in a partial.

To create a partial, follow these steps:

1. Create a .hjs file in the `shared` directory. It does not need to be in the root of `shared`, but be sure to remember the path to the file as we'll need it in the next steps.
2. In [webService.js](https://github.com/itsmistad/RM-Panle/blob/develop/src/services/webService.js), search for `app.set('partials', {`.
3. Here you may define your partial. Simply add an entry with the value as the path to your partial.
4. In another .hjs template, add `{{{> name }}}` where "name" is the name of your partial.

## Adding pre-render stylesheets

Super simple. Just add this to the bottom of your view:

> ```html
> {{#yield-styles}}
>     <link rel='stylesheet' href='/css/path/to/stylesheet.css' />
> {{/yield-styles}}
> ```

Be sure to replace `path/to/stylesheet`. Remember, you may have created a .scss file, but the application will only deliver its compiled .css output!

## Adding post-render scripts

Just add this to the bottom of your view:

> ```html
> {{#yield-scripts}}
>     <script type="text/javascript" src="/js/path/to/script.js"></script>
> {{/yield-scripts}}
> ```

Be sure to replace `path/to/script`.
