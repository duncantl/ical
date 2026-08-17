# ical package extension

This extends the ical to include the names of attendees of each event.

We do this by changing the JavaScript code in the `ical::ical_parse()` function.

The updated code (extended directly from the ical package) is in [cal.js](cal.js).

One can source() the [cal.R](cal.R) file to update the 
`ical::ical_parse()` function in the `ical` package's namespace with the modified JavaScript code.

The result is to add a `who` element to the result. Each element of this is a single
string consisting of a comma-separated list of "common name" for each attendee. Each of these
may be a regular name or an email address.


# License

Same as the ical package - MIT.

