# Examples

This directory contains examples of various use cases for `BabelMultiTargetPlugin`. The purpose of these examples is
 twofold:

* Provide a reference for how to use the plugin in various scenarios
* Provide a testbed to ensure basic functionality of common use cases with the plugin

## Testing

The e2e tests run a small standard suite of checks against each example. Each example must:

* Display the text `BabelMultiTargetPlugin Example: example-name` in an element with the id `title`. This is generally
  handled by the root example template `~/examples/index.pug`
  
* Display the text `Welcome to example-name!` in an element with the id `welcome`. The message text should be set by
  in the example's code, and should not be present until the code executes.
  
* Include an element with the id `status`. Within the status element, include an element with the class `message`. After
  completing all startup tasks for the example, show the text `good to go!` in the status message element.
  
* Track unhandled errors by either using the root example template (`~/examples/index.pug`), which includes the desired
  error tracking code, or log errors to the DOM by including an `<errors>` element, and adding one `<error>` element
  per unhandled error encountered with the error message. Example apps must load without encountering unhandled errors.
  
* Track page clicks by including a `<clicks>` element, and adding a child elements with the class `click` for each
  mouse click. The text of the click element should be `timestamp: tagName`.
  
Additionally, while these points are not tested, the tests should, by convention:

* Use color cues to represent the state of the app by setting the background color of the `<html>` element:
  * Start the page with a default `darkorange` background to represent an uninitialized app.
  * Change the background to `red` when an unhandled error is encountered.
  * Change the background to `green` when the app has successfully completed its startup logic.

The first two (initial and error states) are handled automatically when using the root example template 
(`~/examples/index.pug`).

* Within the welcome text, include an icon representing the primary framework or technology being showcased by the
  example

## Per-Example Testing

If an example application tests logic that is not covered by the standard test suite, add example-specific tests to
`~/examples/example-name/e2e`, with the filename format `spec-name.e2e-spec.ts`. Any tests in this format will 
automatically be run in addition to the standard test suite when the example is tested.

An example of needing additional tests can be found with the `angular-routing` example, which tests Angular's routing
capabilities to ensure that route-specific modules were correctly compiled.
