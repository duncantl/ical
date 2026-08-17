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



# Automatically changing the `ical_parse()` function

To set this programmatically, we can use
```r
set = 
function(dir = "path/to/this/directory")
{
	owd = getwd()
	on.exit(setwd(owd))
	setwd(dir)
	source("cal.R")
}
```

This ensures we are in the same directory for cal.R and cal.js and return to the original working
directory.


We could do this with a package, but it is strange to load a package to modify another package and
not do anything else!

We can put this in our `.Rprofile`. That would mean loading `ical` even if it wasn't needed for this session.

Alternatively, it would be nice to have a mechanism (`hook`) that is called if the 
`ical` package is loaded - either via library or implicitly via the namespace mechanism and call
this function after the load.

We can "get around" this using `addTaskCallback()`

```r
do = function(...) {
   if("package:ical" %in% search())  {
       set("~/GitWorkingArea/ical")
	   return(FALSE)
    }
	TRUE
 }
addTaskCallback(do)
rm(do)
```

This does not capture implicit loading of the ical namespace.
However, this does.

```r
do = function(...) {
   if("ical" %in% loadedNamespaces())  {
       set("~/GitWorkingArea/ical")
	   return(FALSE)
    }
	TRUE
 }
addTaskCallback(do)
rm(do)
```

Now we can check if this worked:
```r
a = ical::ical_parse
body(a)[[5]][[2]]
b = ical::ical_parse
body(b)[[5]][[2]]
```

The first call gets the unmodified version.
After this call, the `ical` namespace has been loaded and the task modifies the `ical_parse()`
function.
The second call to `ical::ical_parse()` gets the modified version now in the namespace.


# Alternative

The `ical_parse()` function could be written as 

```r
JSParseCode = "// prepare data\n  vcalendar = new ICAL.Component(ICAL.parse(cal_data));\n\n ........"
ical_parse
function (file = NULL, text = NULL, js = JSParseCode) 
{
    if (is.null(text) | is.function(text)) 
        text <- readLines(file)

    text <- paste0(text, collapse = "\n")
    v8_env$v8$assign("cal_data", text)
    v8_env$v8$eval(js)
    ical_clean_ical_parsed(v8_env$v8$get("res"))	
}
```


Note that this approach of using `eval()` and global JavaScript variables `cal_data` and `res` 
means we are using language strings and have to manage the variables.
This function may overwrite global variables in the V8 JavaScript global address space.
It also does not remove the variables at the end of the function so doesn't reclaim memory.

A better approach to inter-language integration is to create objects (e.g., `ICAL.Component()`) and
return it to R and then invoke its methods and return the results of these calls to R.
This avoids managing JS variable names.
(One can use assign and get to create JS variables if an object is to be reused directly in JS code.)

