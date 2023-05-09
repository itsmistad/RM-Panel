Controllers
===

As a part of the MVC implementation, RM Panel uses controllers to handle the pre-compilation and rendering of the view on the client's browser. Controllers use `Express` to route requests and execute accordingly.

## Creating a controller for a view

If you haven't [created a view yet](https://github.com/itsmistad/RM-Panle/tree/develop/src/views#creating-a-view), do that first before creating your controller.

1. In `src/controllers/`, create the directory path that reflects the one you created for your view.
2. Create `<name>Controller.js` where `<name>` is the name of your view without ".hjs".
3. Insert the following snippet, replacing `<Page>` and `<page>` (capitalization matters!) with the name of your view without ".hjs":

> ```js
> 'use strict';
> 
> const View = require('../views/shared/view');
> let config;
> 
> class <Page>Controller {
>     constructor(root) {
>         this.name = '<page>';
>         config = root.config;
>     }
> 
>     async run(route, req, res) {
>         const v = new View(config, res, 'path/to/<page>');
>         await v.render({
>             title: '<Page>'
>         });
>     }
> }
> 
> module.exports = <Page>Controller;
> ```

4. In [webService.js](https://github.com/itsmistad/RM-Panel/blob/develop/src/services/webService.js), search for `let routes = [`.
5. Add an entry for your controller using the provided template (in this case, use `'GET'`):

> ```js
> ['/path/to/page', '/path/to/<page>Controller', 'GET' or 'POST']
> ```

6. Be sure that the first string of your entry is the path to the page you want to render. For example, `https://abc.tld/user/profile` would have a path `/user/profile`.

Congratulations, your page will now render at the expected path!

## Creating and using controller variables

Often times, we'll need to pass data from the server to the client before the view renders without the need for an additional request. This can be achieved using controller variables:

1. Open your page's controller and search for `v.render({`. Here you should see `title:`. This is an example of a _required_ controller variable the `src/views/shared/layout.hjs` uses.
2. Below this, add your key-value pair that you want to be passed to the view on-render.
3. In your view, insert `{{ <key> }}` where `<key>` is the name of your variable as defined in step 2.

Your view will now render with the value of your controller variable.

## Creating a controller for POST requests

When we need to handle POST requests to a set of paths with the same base directory, we'll need to create a "base" controller. For example, `/user/create` and `/user/delete` would be a part of the `/user/userController.js`. Follow these steps to add a POST request route:

1. In `src/controllers/`, create or navigate to the directory path for your POST request.
2. Create `<name>Controller.js` where `<name>` is the name of the directory file the controller is in.
3. Insert the following snippet, replacing `<Post>` and `<post>` (capitalization matters!) with the name of your directory like in step 2:

> ```js
> 'use strict';
> 
> class <Post>Controller {
>     constructor(root) {
>         this.name = '<post>';
>     }
> 
>     async run(route, req, res) {
>     }
> }
> 
> module.exports = <Post>Controller;
> ```

4. In [webService.js](https://github.com/itsmistad/RM-Panel/blob/develop/src/services/webService.js), search for `let routes = [`.
5. Add another entry with the same template. For example, you could do `/user/create` or `/user/delete` for the route. Also, ensure your request type is `'POST'`.
6. In your controller, use a switch-case to split behavior based on the `route`:

> ```js
>     async run(route, req, res) {
>         switch (route) {
>         case 'create':
>             // Do something.
>             res.send('Hello world!');
>             break;
>         case 'delete':
>             // Do something else.
>             res.send('Hello world 2.0!');
>             break;
>         }
>     }
> ```

Done!